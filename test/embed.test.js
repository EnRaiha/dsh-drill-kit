import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'

import { SHARD_PREFIXES, callers, callees, dependentFiles, impact, isUsable, locate, openStore, toStoredPath, toWorktreePath } from '../lib/embed.js'

const root = mkdtempSync(join(tmpdir(), 'drill-embed-'))
after(() => rmSync(root, { recursive: true, force: true }))

const store = join(root, 'Embed', 'c2g', 'graph_index.sqlite')
mkdirSync(join(root, 'Embed', 'c2g'), { recursive: true })
writeFileSync(join(root, 'Embed', 'c2g', 'manifest.json'), JSON.stringify({ source: 'c2g', count: 5, built_at: '2026-09-24T05:24:54+0800' }))

execFileSync('sqlite3', [store], { input: `
  CREATE TABLE nodes(id TEXT PRIMARY KEY, name TEXT, kind TEXT, file TEXT, repo TEXT, line INTEGER);
  CREATE TABLE links(source TEXT, target TEXT, relation TEXT);
  INSERT INTO nodes VALUES
    ('n1','target_fn','Function','nd_src/control/a.rs','nd_src',10),
    ('n2','target_fn','Function','nd_sql/src/b.rs','nd_sql',5),
    ('n3','caller_fn','Function','nd_src/control/c.rs','nd_src',20),
    ('n4','root_fn','Function','nd_tests/wire.rs','nd_tests',1),
    ('n5','loose_fn','Function','scripts/tool.py','nd_rest',3);
  INSERT INTO links VALUES
    ('n3','n1','CALL'),
    ('n4','n3','CALL'),
    ('n5','n1','CALL'),
    ('n1','n2','CALL'),
    ('n3','n1','IMPORT');
` })

// A worktree carrying the mapped files; nd_sql/src/b.rs deliberately missing.
const worktree = join(root, 'nodedb-296')
for (const file of ['nodedb/src/control/a.rs', 'nodedb/src/control/c.rs', 'nodedb/tests/wire.rs', 'scripts/tool.py']) {
  mkdirSync(join(worktree, file, '..'), { recursive: true })
  writeFileSync(join(worktree, file), '// fixture\n')
}

test('openStore reads the manifest and refuses a missing path', () => {
  const opened = openStore(store)
  assert.equal(opened.builtAt, '2026-09-24T05:24:54+0800')
  assert.equal(opened.count, 5)
  assert.equal(openStore(join(root, 'nope.sqlite')), null)
  assert.equal(isUsable(store), true)
})

test('shard paths map both ways', () => {
  assert.equal(SHARD_PREFIXES.nd_src, 'nodedb/src')
  assert.deepEqual(toWorktreePath(worktree, 'nd_src/control/a.rs', 'nd_src'), { path: 'nodedb/src/control/a.rs', exists: true })
  assert.deepEqual(toWorktreePath(worktree, 'nd_sql/src/b.rs', 'nd_sql'), { path: 'nodedb-sql/src/b.rs', exists: false })
  assert.deepEqual(toWorktreePath(worktree, 'scripts/tool.py', 'nd_rest'), { path: 'scripts/tool.py', exists: true })
  assert.deepEqual(toWorktreePath(worktree, 'somewhere/x.go', 'other_repo'), { path: 'somewhere/x.go', exists: false })

  assert.equal(toStoredPath('nodedb/src/control/a.rs'), 'nd_src/control/a.rs')
  assert.equal(toStoredPath('nodedb-sql/src/b.rs'), 'nd_sql/src/b.rs')
  assert.equal(toStoredPath('scripts/tool.py'), 'nd_rest/scripts/tool.py')

  const overridden = toWorktreePath(worktree, 'nd_src/control/a.rs', 'nd_src', { nd_src: 'crates/server/src' })
  assert.equal(overridden.path, 'crates/server/src/control/a.rs')
})

test('locate maps shard rows into the worktree and flags paths that are not there', () => {
  const rows = locate(store, 'target_fn', { worktree })
  assert.equal(rows.length, 2)
  const src = rows.find(r => r.repo === 'nd_src')
  assert.equal(src.path, 'nodedb/src/control/a.rs')
  assert.equal(src.exists, true)
  const sql = rows.find(r => r.repo === 'nd_sql')
  assert.equal(sql.path, 'nodedb-sql/src/b.rs')
  assert.equal(sql.exists, false, 'a shard path missing from this worktree is not claimed as present')
  assert.equal(locate(store, 'target_fn', { worktree, file: 'nd_sql' }).length, 1)
  assert.deepEqual(locate(store, 'no_such_symbol', { worktree }), [])
})

test('callers, callees and impact walk resolved CALL links only', () => {
  const up = callers(store, 'target_fn', { worktree })
  // The fixture names two nodes target_fn: the nd_src definition is called by
  // caller_fn, loose_fn and by the nd_sql definition across a CALL edge, while
  // the nd_src -> nd_sql IMPORT edge is not a call and must not appear twice.
  assert.deepEqual(up.map(r => r.caller).sort(), ['caller_fn', 'loose_fn', 'target_fn'])
  assert.equal(up.filter(r => r.caller === 'caller_fn').length, 1, 'the IMPORT edge is not a second call site')
  assert.equal(up.find(r => r.caller === 'caller_fn').path, 'nodedb/src/control/c.rs')
  assert.equal(up.find(r => r.caller === 'loose_fn').path, 'scripts/tool.py')

  const imports = callers(store, 'target_fn', { worktree, relations: ['IMPORT'] })
  assert.deepEqual(imports.map(r => r.caller), ['caller_fn'], 'the relation filter is honoured')

  const down = callees(store, 'target_fn', { worktree })
  assert.deepEqual(down.map(r => r.callee), ['target_fn'], 'the nd_sql definition is a separate node')

  const transitive = impact(store, 'target_fn', { worktree, depth: 2 })
  const pairs = transitive.map(r => `${r.depth}:${r.caller}`).sort()
  assert.deepEqual(pairs, ['1:caller_fn', '1:loose_fn', '1:target_fn', '2:root_fn'])
  const shallow = impact(store, 'target_fn', { worktree, depth: 1 })
  assert.equal(shallow.some(r => r.caller === 'root_fn'), false, 'depth 1 stops before the second hop')
})

test('dependentFiles walks back from a worktree file', () => {
  const rows = dependentFiles(store, worktree, 'nodedb/src/control/a.rs', { depth: 2 })
  const names = rows.map(r => r.path).sort()
  assert.deepEqual(names, ['nodedb/src/control/c.rs', 'nodedb/tests/wire.rs', 'scripts/tool.py'])
  assert.ok(rows.every(r => r.exists), 'every dependent exists in the fixture worktree')
})

test('a non-store file is not usable', () => {
  const bogus = join(root, 'bogus.sqlite')
  writeFileSync(bogus, 'not a database')
  assert.equal(isUsable(bogus), false)
})

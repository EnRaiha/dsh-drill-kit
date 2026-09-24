import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'

import { definitionPattern, indexDirFor, indexFor, indexRoot, indexSlug, parseJsonLine, readIndexMeta, resolveBin, resolveEngine, searchText } from '../lib/search.js'

const root = mkdtempSync(join(tmpdir(), 'drill-search-'))
after(() => rmSync(root, { recursive: true, force: true }))

const repo = join(root, 'repo')
mkdirSync(join(repo, 'src'), { recursive: true })
writeFileSync(join(repo, 'src', 'a.rs'), 'pub fn target_fn(x: u32) -> u32 {\n    x + 1\n}\n\nfn other() {}\n')
writeFileSync(join(repo, 'src', 'b.rs'), 'use crate::a::target_fn;\n\nfn caller() { let _ = target_fn(1); }\n')

test('resolveBin finds a real binary and rejects a missing one', () => {
  const rg = resolveBin('rg')
  assert.ok(rg !== null && rg.endsWith('rg'), 'ripgrep is expected on this host')
  assert.equal(resolveBin('definitely-not-a-real-binary-xyz'), null)
})

test('resolveEngine prefers tgrep only when the root carries an index', () => {
  const auto = resolveEngine({ engine: 'auto', root: repo, indexDir: join(root, 'no-indexes') })
  assert.equal(auto.engine, 'rg', 'no index anywhere for this root')

  // A separate root so the in-tree marker cannot leak into the other cases.
  const indexedRoot = join(root, 'root-with-intree-index')
  mkdirSync(join(indexedRoot, '.tgrep'), { recursive: true })
  const indexed = resolveEngine({ engine: 'auto', root: indexedRoot, indexDir: join(root, 'no-indexes') })
  if (resolveBin('tgrep') === null) {
    assert.equal(indexed.engine, 'rg', 'tgrep is not installed here, so auto falls back to rg')
  } else {
    assert.equal(indexed.engine, 'tgrep', 'an in-tree index switches auto to tgrep')
    assert.equal(indexed.indexDir, join(indexedRoot, '.tgrep'))
  }

  assert.equal(resolveEngine({ engine: 'rg', root: repo }).engine, 'rg')
  assert.equal(resolveEngine({ engine: 'rg', root: repo, rgBin: 'nope-xyz' }), null)
})

test('parseJsonLine reads a match event and ignores everything else', () => {
  const line = JSON.stringify({
    type: 'match',
    data: { path: { text: 'src/a.rs' }, line_number: 12, lines: { text: 'fn target_fn() {}\n' }, submatches: [{ start: 3, end: 12, match: { text: 'target_fn' } }] },
  })
  assert.deepEqual(parseJsonLine(line), { file: 'src/a.rs', line: 12, column: 4, text: 'fn target_fn() {}' })
  assert.equal(parseJsonLine('{"type":"begin","data":{}}'), null)
  assert.equal(parseJsonLine('not json'), null)
  assert.equal(parseJsonLine(''), null)
})

test('definitionPattern escapes regex metacharacters and only matches definitions', () => {
  const pattern = definitionPattern('nextval_batch')
  assert.match(pattern, /fn\|struct/)
  assert.ok(!definitionPattern('a.b').includes('a.b'), 'the dot is escaped')
  assert.match(definitionPattern('a.b'), /a\\\.b/)
})

test('searchText returns labelled hits and an empty result for a miss', () => {
  const hit = searchText({ pattern: definitionPattern('target_fn'), root: repo, engine: 'rg' })
  assert.equal(hit.engine, 'rg')
  assert.equal(hit.error, null)
  assert.equal(hit.hits.length, 1)
  assert.equal(hit.hits[0].file, join(repo, 'src', 'a.rs'))
  assert.equal(hit.hits[0].line, 1)

  const miss = searchText({ pattern: 'no_such_symbol_anywhere', root: repo, engine: 'rg' })
  assert.deepEqual(miss.hits, [])
  assert.equal(miss.error, null, 'a no-match exit code is an empty result, not a failure')

  const wordy = searchText({ pattern: 'target', word: true, fixed: true, root: repo, engine: 'rg' })
  assert.deepEqual(wordy.hits, [], 'whole-word matching excludes target_fn')

  const occurrences = searchText({ pattern: 'target_fn', word: true, fixed: true, root: repo, engine: 'rg' })
  assert.equal(occurrences.hits.length, 3, 'definition, use statement and call site')
})

test('searchText reports an unavailable engine instead of throwing', () => {
  const result = searchText({ pattern: 'x', root: repo, engine: 'rg', rgBin: 'definitely-missing-xyz' })
  assert.equal(result.engine, null)
  assert.match(result.error, /neither rg nor tgrep/)
})

const hasTgrep = resolveBin('tgrep') !== null

test('index paths are stable and root-specific', () => {
  const a = indexSlug('/home/maya/projects/nodedb-296')
  assert.equal(a, 'home-maya-projects-nodedb-296')
  assert.equal(indexDirFor('/home/maya/projects/nodedb-296', '/cache'), join('/cache', a))
  assert.notEqual(indexSlug('/a/b'), indexSlug('/a/c'))
})

test('readIndexMeta reports nothing for an empty directory', () => {
  const empty = join(root, 'empty-idx')
  mkdirSync(empty, { recursive: true })
  assert.equal(readIndexMeta(empty), null)
  assert.equal(indexFor(repo, join(root, 'no-such-base')), null)
})

test('indexRoot builds outside the worktree and leaves no .tgrep inside it', { skip: !hasTgrep }, () => {
  const baseDir = join(root, 'idx-base')
  const built = indexRoot({ root: repo, baseDir })
  assert.equal(built.ok, true, built.error ?? '')
  assert.ok(built.dir.startsWith(baseDir), 'the index lives in the cache base')
  assert.equal(existsSync(join(repo, '.tgrep')), false, 'the worktree stays clean')
  const meta = readIndexMeta(built.dir)
  assert.ok(meta.files >= 2, 'both source files are indexed')
  assert.equal(indexFor(repo, baseDir), built.dir, 'the index is matched back to its root')
  assert.equal(indexFor(join(root, 'other-repo'), baseDir), null, 'a different root does not borrow it')
})

test('auto picks tgrep once an out-of-tree index exists, and searches through it', { skip: !hasTgrep }, () => {
  const baseDir = join(root, 'idx-base')
  const resolved = resolveEngine({ engine: 'auto', root: repo, indexDir: baseDir })
  assert.equal(resolved.engine, 'tgrep')
  assert.equal(resolved.indexDir, indexDirFor(repo, baseDir))

  const found = searchText({ pattern: definitionPattern('target_fn'), root: repo, engine: 'auto', indexDir: baseDir })
  assert.equal(found.engine, 'tgrep')
  assert.equal(found.error, null)
  assert.equal(found.hits.length, 1)
  assert.equal(found.hits[0].line, 1)

  const forced = resolveEngine({ engine: 'rg', root: repo, indexDir: baseDir })
  assert.equal(forced.engine, 'rg')
  assert.equal(forced.indexDir, null, 'forcing rg ignores the index')
})

test('indexRoot reports a missing tgrep binary instead of throwing', () => {
  const built = indexRoot({ root: repo, baseDir: join(root, 'x'), tgrepBin: 'definitely-missing-xyz' })
  assert.equal(built.ok, false)
  assert.match(built.error, /tgrep is not available/)
})

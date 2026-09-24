import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'

import { callers, callees, discoverDb, impact, locateByFrame, locateByName, query, sqlStr } from '../lib/c2g.js'

const root = mkdtempSync(join(tmpdir(), 'drill-c2g-'))
after(() => rmSync(root, { recursive: true, force: true }))

const projectDir = join(root, 'projects', 'deadbeef')
const dbPath = join(projectDir, 'cache.sqlite3')
mkdirSync(projectDir, { recursive: true })

const REPO = '/tmp/fake-nodedb'

const sql = `
CREATE TABLE meta (singleton INTEGER PRIMARY KEY, application_identity TEXT NOT NULL, canonical_root BLOB NOT NULL, project_key BLOB NOT NULL);
CREATE TABLE graph_snapshots (snapshot_id INTEGER PRIMARY KEY, resolver_tier TEXT NOT NULL, created_at_ns INTEGER NOT NULL);
CREATE TABLE active_snapshots (resolver_tier TEXT NOT NULL, completeness INTEGER NOT NULL, snapshot_id INTEGER NOT NULL, PRIMARY KEY (resolver_tier, completeness));
CREATE TABLE graph_symbols (snapshot_id INTEGER NOT NULL, ordinal INTEGER NOT NULL, id BLOB NOT NULL, scip TEXT NOT NULL, name TEXT NOT NULL, file TEXT NOT NULL, span_start INTEGER NOT NULL, span_end INTEGER NOT NULL, kind TEXT NOT NULL, symbol BLOB NOT NULL, PRIMARY KEY (snapshot_id, ordinal));
CREATE TABLE graph_edges (snapshot_id INTEGER NOT NULL, from_ord INTEGER NOT NULL, to_ord INTEGER NOT NULL, role TEXT NOT NULL, occurrence_file TEXT NOT NULL, occurrence_line INTEGER NOT NULL, confidence REAL NOT NULL);
INSERT INTO meta VALUES (1, 'code2graph-cache', '${REPO}', x'00');
INSERT INTO graph_snapshots VALUES (7, 'scope', 0);
INSERT INTO active_snapshots VALUES ('scope', 1, 7);
INSERT INTO graph_symbols VALUES
  (7, 1, x'01', 'a', 'caller_fn',  'src/a.rs', 10, 40, '"Function"', '{"line":10}'),
  (7, 2, x'02', 'b', 'target_fn',  'src/b.rs', 5,  30, '"Function"', '{"line":5}'),
  (7, 3, x'03', 'c', 'leaf_fn',    'src/c.rs', 1,   9, '"Function"', '{"line":1}'),
  (7, 4, x'04', 'd', 'target_fn',  'other/b.rs', 3, 20, '"Function"', '{"line":3}');
INSERT INTO graph_edges VALUES
  (7, 1, 2, '"Call"', 'src/a.rs', 22, 0.9),
  (7, 2, 3, '"Call"', 'src/b.rs', 12, 0.8),
  (7, 1, 3, '"Read"', 'src/a.rs', 25, 0.5);
`

execFileSync('sqlite3', [dbPath], { input: sql })

test('sqlStr escapes single quotes', () => {
  assert.equal(sqlStr("o'brien"), "'o''brien'")
})

test('discoverDb finds the cache by canonical_root, not by path hash', () => {
  const found = discoverDb(REPO, join(root, 'projects'))
  assert.ok(found, 'cache should be discovered')
  assert.equal(found.db, dbPath)
  assert.equal(found.snapshotId, 7)
})

test('discoverDb matches a subdirectory of the indexed root', () => {
  const found = discoverDb(`${REPO}/crates/inner`, join(root, 'projects'))
  assert.equal(found?.db, dbPath)
})

test('discoverDb returns null for an unindexed repository', () => {
  assert.equal(discoverDb('/tmp/somewhere-else', join(root, 'projects')), null)
})

test('locateByName decodes the JSON-encoded kind and reads the line from the symbol blob', () => {
  const rows = locateByName(dbPath, 'target_fn')
  assert.equal(rows.length, 2, 'duplicate names across crates are both returned')
  assert.equal(rows[0].kind, 'Function', 'kind arrives JSON-quoted in the db and must be decoded')
  assert.equal(rows.find(r => r.file === 'src/b.rs').line, 5, 'line lives in the symbol json, not the span offsets')
})

test('locateByName narrows to one file when the name repeats', () => {
  const rows = locateByName(dbPath, 'target_fn', { file: 'other/b.rs' })
  assert.equal(rows.length, 1)
  assert.equal(rows[0].file, 'other/b.rs')
})

test('locateByFrame picks the nearest definition at or above the frame line', () => {
  const hit = locateByFrame(dbPath, 'src/a.rs', 27)
  assert.equal(hit.name, 'caller_fn')
  assert.equal(hit.line, 10)
  assert.equal(locateByFrame(dbPath, 'src/a.rs', 5), undefined, 'a line above every definition has no owner')
})

test('callers and callees walk call edges only, not read edges', () => {
  const up = callers(dbPath, 'target_fn', { file: 'src/b.rs' })
  assert.deepEqual(up.map(r => r.caller), ['caller_fn'])
  const down = callees(dbPath, 'target_fn', { file: 'src/b.rs' })
  assert.deepEqual(down.map(r => r.callee), ['leaf_fn'])
  const leaf = callees(dbPath, 'caller_fn')
  assert.deepEqual(leaf.map(r => r.callee), ['target_fn'], 'the Read edge to leaf_fn must not appear as a callee')
})

test('impact walks transitive callers to a bounded depth', () => {
  const rows = impact(dbPath, 'leaf_fn', { depth: 2 })
  const byDepth = rows.map(r => `${r.depth}:${r.caller}`).sort()
  assert.deepEqual(byDepth, ['1:target_fn', '2:caller_fn'])
  const shallow = impact(dbPath, 'leaf_fn', { depth: 1 })
  assert.deepEqual(shallow.map(r => r.caller), ['target_fn'])
})

test('unknown symbols resolve to no rows rather than throwing', () => {
  assert.deepEqual(callers(dbPath, 'nope'), [])
  assert.deepEqual(impact(dbPath, 'nope'), [])
})

test('query refuses to write through the read-only connection', () => {
  assert.throws(() => query(dbPath, "INSERT INTO meta VALUES (2,'x','y',x'00')"), /readonly|attempt to write/i)
})

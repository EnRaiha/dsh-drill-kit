import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'

import { DEFAULT_TTL_MS, cacheRoot, pruneDir, readCache, sizeOf, touch, writeCache } from '../lib/cache.js'
import { clearDiscovery, discoverDb, forgetDiscovery } from '../lib/c2g.js'
import { indexDirFor, indexFor, indexRoot, pruneIndexes, resolveBin } from '../lib/search.js'

const root = mkdtempSync(join(tmpdir(), 'drill-cache-'))
after(() => rmSync(root, { recursive: true, force: true }))

const DAY = 24 * 60 * 60 * 1000
/** Backdate a path so the TTL sees it as idle. */
const age = (path, ms) => {
  const when = new Date(Date.now() - ms)
  utimesSync(path, when, when)
}

test('the cache root defaults away from /tmp and honours an override', () => {
  assert.equal(cacheRoot(''), join(process.env.XDG_CACHE_HOME ?? join(process.env.HOME, '.cache'), 'dsh-drill'))
  assert.ok(!cacheRoot('').startsWith('/tmp'), 'derived data must not live in a wiped directory')
  assert.equal(cacheRoot('/custom/cache'), '/custom/cache')
})

test('a cache entry expires by idleness, and a touch extends its life', () => {
  const path = join(root, 'entry.json')
  writeCache(path, { hello: 'world' })
  assert.deepEqual(readCache(path, DEFAULT_TTL_MS), { hello: 'world' })

  age(path, 8 * DAY)
  assert.equal(readCache(path, DEFAULT_TTL_MS), null, 'idle for more than a week reads as absent')

  touch(path)
  assert.deepEqual(readCache(path, DEFAULT_TTL_MS), { hello: 'world' }, 'a touch resets the idle clock')

  assert.deepEqual(readCache(path, 0), { hello: 'world' }, 'ttl 0 disables expiry')
  assert.equal(readCache(join(root, 'missing.json'), DEFAULT_TTL_MS), null)
})

test('pruneDir removes only idle entries and protects the keep list', () => {
  const dir = join(root, 'entries')
  mkdirSync(join(dir, 'stale'), { recursive: true })
  writeFileSync(join(dir, 'stale', 'blob.bin'), 'x'.repeat(2048))
  mkdirSync(join(dir, 'fresh'), { recursive: true })
  writeFileSync(join(dir, 'fresh', 'blob.bin'), 'y'.repeat(512))
  mkdirSync(join(dir, 'protected'), { recursive: true })
  age(join(dir, 'stale'), 10 * DAY)
  age(join(dir, 'protected'), 10 * DAY)

  const result = pruneDir(dir, { ttlMs: DEFAULT_TTL_MS, keep: ['protected'] })
  assert.deepEqual(result.removed, ['stale'])
  assert.ok(result.freedBytes >= 2048, 'the freed size is reported')
  assert.ok(result.kept.includes('fresh'))
  assert.ok(result.kept.includes('protected'))
  assert.equal(existsSync(join(dir, 'stale')), false)
  assert.equal(existsSync(join(dir, 'protected')), true)
  assert.ok(sizeOf(dir) >= 512)
})

test('c2g discovery is cached, expires, and can be forgotten', () => {
  const c2gDir = join(root, 'c2g-projects', 'proj')
  const drillCache = join(root, 'drill-cache')
  mkdirSync(c2gDir, { recursive: true })
  const db = join(c2gDir, 'cache.sqlite3')
  execFileSync('sqlite3', [db], { input: `
    CREATE TABLE meta (singleton INTEGER PRIMARY KEY, application_identity TEXT NOT NULL, canonical_root BLOB NOT NULL, project_key BLOB NOT NULL);
    CREATE TABLE graph_snapshots (snapshot_id INTEGER PRIMARY KEY, resolver_tier TEXT NOT NULL, created_at_ns INTEGER NOT NULL);
    CREATE TABLE active_snapshots (resolver_tier TEXT NOT NULL, completeness INTEGER NOT NULL, snapshot_id INTEGER NOT NULL, PRIMARY KEY (resolver_tier, completeness));
    INSERT INTO meta VALUES (1, 'code2graph-cache', '${root}/repo', x'00');
    INSERT INTO graph_snapshots VALUES (3, 'scope', 0);
    INSERT INTO active_snapshots VALUES ('scope', 1, 3);
  ` })

  const options = { cacheDir: drillCache, ttlMs: DEFAULT_TTL_MS }
  const first = discoverDb(`${root}/repo`, join(root, 'c2g-projects'), 'sqlite3', options)
  assert.equal(first.cached, false, 'the first call scans')
  assert.equal(first.snapshotId, 3)
  const discoveryFile = join(drillCache, 'c2g-discovery.json')
  assert.equal(existsSync(discoveryFile), true, 'the result is written to the cache root')
  const saved = JSON.parse(readFileSync(discoveryFile, 'utf8'))
  assert.equal(saved.entries[`${root}/repo`].db, db)

  const second = discoverDb(`${root}/repo`, join(root, 'c2g-projects'), 'sqlite3', options)
  assert.equal(second.cached, true, 'the second call answers from the cache')
  assert.equal(second.db, db)

  // A cached database that disappeared must not be served.
  const moved = `${db}.moved`
  execFileSync('mv', [db, moved])
  assert.equal(discoverDb(`${root}/repo`, join(root, 'c2g-projects'), 'sqlite3', options), null)
  execFileSync('mv', [moved, db])
  assert.equal(discoverDb(`${root}/repo`, join(root, 'c2g-projects'), 'sqlite3', options).db, db, 'the entry is re-established once the database is back')

  // Expired entries are dropped on read, so the file shrinks on the next write.
  const stale = JSON.parse(readFileSync(discoveryFile, 'utf8'))
  stale.entries[`${root}/repo`].savedAt = Date.now() - 8 * DAY
  writeFileSync(discoveryFile, JSON.stringify(stale))
  const refreshed = discoverDb(`${root}/repo`, join(root, 'c2g-projects'), 'sqlite3', options)
  assert.equal(refreshed.cached, false, 'an expired entry triggers a rescan')

  assert.equal(forgetDiscovery(`${root}/repo`, drillCache), true)
  assert.equal(discoverDb(`${root}/repo`, join(root, 'c2g-projects'), 'sqlite3', options).cached, false)
  clearDiscovery(drillCache)
  assert.equal(existsSync(discoveryFile), false)
})

test('tgrep indexes are pruned by idleness and kept when in use', { skip: resolveBin('tgrep') === null }, () => {
  const repoA = join(root, 'repoA')
  const repoB = join(root, 'repoB')
  for (const repo of [repoA, repoB]) {
    mkdirSync(repo, { recursive: true })
    writeFileSync(join(repo, 'a.rs'), 'pub fn f() {}\n')
  }
  const baseDir = join(root, 'tgrep')
  assert.equal(indexRoot({ root: repoA, baseDir }).ok, true)
  assert.equal(indexRoot({ root: repoB, baseDir }).ok, true)
  assert.equal(indexFor(repoA, baseDir), indexDirFor(repoA, baseDir))

  age(indexDirFor(repoA, baseDir), 9 * DAY)
  const pruned = pruneIndexes({ baseDir, ttlMs: DEFAULT_TTL_MS, keepRoots: [] })
  assert.deepEqual(pruned.removed, [indexDirFor(repoA, baseDir).split('/').pop()])
  assert.equal(existsSync(indexDirFor(repoA, baseDir)), false)
  assert.equal(existsSync(indexDirFor(repoB, baseDir)), true, 'the recently used index survives')

  // A kept root is protected even when idle.
  age(indexDirFor(repoB, baseDir), 9 * DAY)
  const kept = pruneIndexes({ baseDir, ttlMs: DEFAULT_TTL_MS, keepRoots: [repoB] })
  assert.deepEqual(kept.removed, [])
  assert.equal(existsSync(indexDirFor(repoB, baseDir)), true)

  // ttl 0 disables pruning entirely.
  const disabled = pruneIndexes({ baseDir, ttlMs: 0 })
  assert.deepEqual(disabled.removed, [])
})

test('indexFor touches the index so idleness tracks use', { skip: resolveBin('tgrep') === null }, () => {
  const repo = join(root, 'repoTouch')
  mkdirSync(repo, { recursive: true })
  writeFileSync(join(repo, 'a.rs'), 'pub fn f() {}\n')
  const baseDir = join(root, 'tgrep-touch')
  indexRoot({ root: repo, baseDir })
  const dir = indexDirFor(repo, baseDir)
  age(dir, 3 * DAY)
  const before = statSync(dir).mtimeMs
  assert.equal(indexFor(repo, baseDir), dir)
  assert.ok(statSync(dir).mtimeMs > before, 'a lookup refreshes the idle clock')
})

test('a parent-directory cache without an active snapshot does not claim coverage', () => {
  const c2gDir = join(root, 'c2g-parent', 'proj')
  const drillCache = join(root, 'drill-cache-2')
  mkdirSync(c2gDir, { recursive: true })
  const db = join(c2gDir, 'cache.sqlite3')
  execFileSync('sqlite3', [db], { input: `
    CREATE TABLE meta (singleton INTEGER PRIMARY KEY, application_identity TEXT NOT NULL, canonical_root BLOB NOT NULL, project_key BLOB NOT NULL);
    CREATE TABLE graph_snapshots (snapshot_id INTEGER PRIMARY KEY, resolver_tier TEXT NOT NULL, created_at_ns INTEGER NOT NULL);
    CREATE TABLE active_snapshots (resolver_tier TEXT NOT NULL, completeness INTEGER NOT NULL, snapshot_id INTEGER NOT NULL, PRIMARY KEY (resolver_tier, completeness));
    INSERT INTO meta VALUES (1, 'code2graph-cache', '${root}', x'00');
  ` })
  // Rooted at a parent, but no active scope snapshot: it cannot answer queries.
  assert.equal(discoverDb(`${root}/some/worktree`, join(root, 'c2g-parent'), 'sqlite3', { cacheDir: drillCache, ttlMs: DEFAULT_TTL_MS }), null)

  // Add the snapshot and it becomes a candidate for everything beneath it.
  execFileSync('sqlite3', [db], { input: `
    INSERT INTO graph_snapshots VALUES (9, 'scope', 0);
    INSERT INTO active_snapshots VALUES ('scope', 1, 9);
  ` })
  const found = discoverDb(`${root}/some/worktree`, join(root, 'c2g-parent'), 'sqlite3', { cacheDir: drillCache, ttlMs: DEFAULT_TTL_MS })
  assert.equal(found.snapshotId, 9)
  assert.equal(found.db, db)
})

test('a cached discovery entry without a snapshot is never served', () => {
  const drillCache = join(root, 'drill-cache-3')
  const c2gDir = join(root, 'c2g-nosnap')
  mkdirSync(c2gDir, { recursive: true })
  const db = join(c2gDir, 'cache.sqlite3')
  writeFileSync(db, 'not-a-database')
  mkdirSync(drillCache, { recursive: true })
  writeFileSync(join(drillCache, 'c2g-discovery.json'), JSON.stringify({
    version: 1,
    entries: { [`${root}/legacy`]: { db, snapshotId: null, savedAt: Date.now() } },
  }))
  // The entry is dropped on read, so the caller rescans instead of trusting it.
  assert.equal(discoverDb(`${root}/legacy`, c2gDir, 'sqlite3', { cacheDir: drillCache, ttlMs: DEFAULT_TTL_MS }), null)
  const after = JSON.parse(readFileSync(join(drillCache, 'c2g-discovery.json'), 'utf8'))
  assert.deepEqual(Object.keys(after.entries), [], 'the stale entry is gone from the map')
})

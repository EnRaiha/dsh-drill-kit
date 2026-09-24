import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

import { DEFAULT_TTL_MS, cacheRoot, drop, readCache, touch, writeCache } from './cache.js'

/**
 * Read-only access to the local code2graph (c2g) cache, used for drill stages 1–2:
 * localization (stack frame → exact symbol) and blast radius (callers/callees/impact).
 *
 * The cache lives at `<cacheDir>/<project-key>/cache.sqlite3`; the key is NOT a
 * hash of the repository path, so the database is discovered by matching
 * `meta.canonical_root` instead of being computed.
 */

/** c2g cache layout this module understands. */
export const C2G_SCHEMA_VERSION = 3

/** Name of the discovery cache file under the drill cache root. */
export const DISCOVERY_CACHE_FILE = 'c2g-discovery.json'

/**
 * Read the cached discovery map. The map records which database answered for a
 * repository path, so a call does not re-probe every c2g project directory with
 * a sqlite3 process. Entries carry their own timestamp and expire with the TTL.
 */
function readDiscovery(cacheDir, ttlMs) {
  const data = readCache(join(cacheDir, DISCOVERY_CACHE_FILE), ttlMs)
  if (data === null || typeof data !== 'object' || data === undefined) return { entries: {}, path: join(cacheDir, DISCOVERY_CACHE_FILE) }
  const entries = data.entries !== undefined && typeof data.entries === 'object' ? data.entries : {}
  // Drop expired entries while loading, so the file shrinks on the next write.
  const now = Date.now()
  for (const [key, value] of Object.entries(entries)) {
    const savedAt = Number(value?.savedAt ?? 0)
    const id = value?.snapshotId
    if (ttlMs > 0 && now - savedAt > ttlMs) delete entries[key]
    else if (value?.db === undefined || !existsSync(value.db)) delete entries[key]
    // An entry recorded before the coverage rule required an active scope
    // snapshot must not be served: it would send callers at a database that
    // resolves nothing.
    else if (id === null || id === undefined) delete entries[key]
  }
  return { entries, path: join(cacheDir, DISCOVERY_CACHE_FILE) }
}

/** Persist the discovery map, stamping every entry it keeps. */
function writeDiscovery(cache, cacheDir) {
  const stamped = {}
  for (const [key, value] of Object.entries(cache.entries)) stamped[key] = { ...value, savedAt: value.savedAt ?? Date.now() }
  writeCache(join(cacheDir, DISCOVERY_CACHE_FILE), { version: 1, entries: stamped })
}

/**
 * Forget one repository's cached discovery result (used when a cached database
 * has disappeared or a caller asks for a refresh).
 *
 * @param root Repository path.
 * @param cacheDir Drill cache root.
 * @param ttlMs Time to live in milliseconds.
 * @returns True when an entry was dropped.
 */
export function forgetDiscovery(root, cacheDir = cacheRoot(), ttlMs = DEFAULT_TTL_MS) {
  const cache = readDiscovery(cacheDir, ttlMs)
  const key = resolve(root)
  if (cache.entries[key] === undefined) return false
  delete cache.entries[key]
  writeDiscovery(cache, cacheDir)
  return true
}

/**
 * Prune the whole discovery cache.
 *
 * @param cacheDir Drill cache root.
 * @returns True when the file was removed.
 */
export function clearDiscovery(cacheDir = cacheRoot()) {
  return drop(join(cacheDir, DISCOVERY_CACHE_FILE))
}

/** Quote a value for a SQL literal, doubling embedded quotes. */
export function sqlStr(value) {
  return `'${String(value).replaceAll("'", "''")}'`
}

/**
 * Locate the c2g cache database whose `meta.canonical_root` matches a repository.
 *
 * @param root Repository path (resolved through symlinks before matching).
 * @param cacheDir c2g cache directory; defaults to `~/.cache/code2graph/projects`.
 * @param sqliteBin sqlite3 executable used for the probe query.
 * @returns `{ db, schemaVersion, snapshotId }`, or null when no cache matches.
 */
export function discoverDb(root, cacheDir = join(homedir(), '.cache', 'code2graph', 'projects'), sqliteBin = 'sqlite3', options = {}) {
  const wanted = resolve(root)
  const drillCacheDir = options.cacheDir ?? cacheRoot()
  const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS

  if (options.refresh !== true) {
    const cached = readDiscovery(drillCacheDir, ttlMs).entries[wanted]
    if (cached?.db !== undefined && existsSync(cached.db)) {
      touch(join(drillCacheDir, DISCOVERY_CACHE_FILE))
      return { db: cached.db, schemaVersion: cached.schemaVersion ?? null, snapshotId: cached.snapshotId ?? null, cached: true }
    }
  }

  if (!existsSync(cacheDir)) return null
  let best = null
  for (const entry of readdirSync(cacheDir)) {
    const db = join(cacheDir, entry, 'cache.sqlite3')
    if (!existsSync(db)) continue
    let meta
    try {
      meta = query(db, 'SELECT CAST(canonical_root AS TEXT) root, CAST(application_identity AS TEXT) identity FROM meta LIMIT 1', sqliteBin)
    } catch {
      continue
    }
    const row = meta[0]
    if (!row?.root) continue
    if (row.identity !== undefined && row.identity !== 'code2graph-cache') continue
    const canonical = resolve(String(row.root))
    const matches = canonical === wanted || wanted.startsWith(`${canonical}/`)
    if (!matches) continue

    let snapshotId = null
    try {
      const snap = query(db, "SELECT snapshot_id FROM active_snapshots WHERE resolver_tier='scope' LIMIT 1", sqliteBin)
      snapshotId = snap[0]?.snapshot_id ?? null
    } catch {
      snapshotId = null
    }
    // Coverage has to mean "can answer": every query this module runs resolves
    // through the active scope snapshot, so a cache without one is not a
    // candidate — a container directory indexed once (for example a cache
    // rooted at the home directory, or a /tmp fixture) would otherwise claim
    // every repository beneath it while returning nothing.
    if (snapshotId === null) continue
    // A cache indexed at a parent directory also covers its subdirectories, so
    // several caches can match one path; the most specific root wins.
    const score = [canonical.length]
    if (best === null || score[0] > best.score[0]) {
      let userVersion = null
      try {
        userVersion = query(db, 'PRAGMA user_version', sqliteBin)[0]?.user_version ?? null
      } catch {
        userVersion = null
      }
      best = { db, schemaVersion: userVersion, snapshotId, score }
    }
  }
  const discovery = readDiscovery(drillCacheDir, ttlMs)
  if (best === null) {
    delete discovery.entries[wanted]
    writeDiscovery(discovery, drillCacheDir)
    return null
  }
  discovery.entries[wanted] = { db: best.db, schemaVersion: best.schemaVersion, snapshotId: best.snapshotId, savedAt: Date.now() }
  writeDiscovery(discovery, drillCacheDir)
  return { db: best.db, schemaVersion: best.schemaVersion, snapshotId: best.snapshotId, cached: false }
}

/**
 * Run one read-only query and parse sqlite3's JSON output.
 *
 * @param db Database path.
 * @param sql SQL text; the caller owns escaping of any interpolated values.
 * @param sqliteBin sqlite3 executable.
 * @param timeoutMs Query timeout.
 * @returns Parsed rows; an empty array when the query returns nothing.
 */
export function query(db, sql, sqliteBin = 'sqlite3', timeoutMs = 30_000) {
  const out = execFileSync(sqliteBin, ['-readonly', '-json', db, sql], { encoding: 'utf8', timeout: timeoutMs, maxBuffer: 32 * 1024 * 1024 })
  const trimmed = out.trim()
  if (trimmed === '') return []
  return JSON.parse(trimmed)
}

const SYMBOL_COLUMNS = "name, replace(kind,'\"','') AS kind, file, json_extract(symbol,'$.line') AS line"

/** The scope tier's snapshot id, as a subquery fragment. */
const SCOPE = "(SELECT snapshot_id FROM active_snapshots WHERE resolver_tier='scope')"

/**
 * Stage 1a — resolve a symbol name to its definition site(s).
 *
 * @param db Database path.
 * @param symbol Symbol name.
 * @param options `file` narrows to one file (names repeat across crates), `limit` caps rows.
 * @param sqliteBin sqlite3 executable.
 * @returns Definition rows `{name, kind, file, line}`.
 */
export function locateByName(db, symbol, options = {}, sqliteBin = 'sqlite3') {
  const limit = options.limit ?? 10
  const fileClause = options.file ? ` AND file = ${sqlStr(options.file)}` : ''
  return query(db, `SELECT ${SYMBOL_COLUMNS} FROM graph_symbols WHERE snapshot_id=${SCOPE} AND name=${sqlStr(symbol)}${fileClause} ORDER BY file, line LIMIT ${Number(limit)}`, sqliteBin)
}

/**
 * Stage 1b — resolve a stack frame to the symbol that contains it.
 *
 * A file:line is authoritative where a bare name is ambiguous, so this picks the
 * nearest definition at or above the reported line.
 *
 * @param db Database path.
 * @param file Repository-relative file path.
 * @param line 1-based line number from the stack trace.
 * @param sqliteBin sqlite3 executable.
 * @returns The containing symbol row, or undefined.
 */
export function locateByFrame(db, file, line, sqliteBin = 'sqlite3') {
  const rows = query(db, `SELECT ${SYMBOL_COLUMNS} FROM graph_symbols WHERE snapshot_id=${SCOPE} AND file=${sqlStr(file)} AND json_extract(symbol,'$.line') <= ${Number(line)} ORDER BY json_extract(symbol,'$.line') DESC LIMIT 1`, sqliteBin)
  return rows[0]
}

/**
 * Stage 2 — call sites of a symbol.
 *
 * @param db Database path.
 * @param symbol Symbol name; the first definition row is used as the target.
 * @param options `file` disambiguates duplicate names, `limit` caps rows.
 * @param sqliteBin sqlite3 executable.
 * @returns Rows `{caller, caller_file, occurrence_file, occurrence_line}`.
 */
export function callers(db, symbol, options = {}, sqliteBin = 'sqlite3') {
  const target = targetOrdinal(db, symbol, options.file, sqliteBin)
  if (target === null) return []
  return query(db, `SELECT c.name AS caller, c.file AS caller_file, e.occurrence_file, e.occurrence_line FROM graph_edges e JOIN graph_symbols c ON c.snapshot_id=e.snapshot_id AND c.ordinal=e.from_ord WHERE e.snapshot_id=${SCOPE} AND e.role='"Call"' AND e.to_ord=${target} ORDER BY c.file, e.occurrence_line LIMIT ${Number(options.limit ?? 40)}`, sqliteBin)
}

/**
 * Stage 2 — symbols this symbol calls.
 *
 * @param db Database path.
 * @param symbol Symbol name.
 * @param options `file` disambiguates duplicate names, `limit` caps rows.
 * @param sqliteBin sqlite3 executable.
 * @returns Rows `{callee, callee_file, occurrence_file, occurrence_line}`.
 */
export function callees(db, symbol, options = {}, sqliteBin = 'sqlite3') {
  const target = targetOrdinal(db, symbol, options.file, sqliteBin)
  if (target === null) return []
  return query(db, `SELECT t.name AS callee, t.file AS callee_file, e.occurrence_file, e.occurrence_line FROM graph_edges e JOIN graph_symbols t ON t.snapshot_id=e.snapshot_id AND t.ordinal=e.to_ord WHERE e.snapshot_id=${SCOPE} AND e.role='"Call"' AND e.from_ord=${target} ORDER BY t.file, e.occurrence_line LIMIT ${Number(options.limit ?? 40)}`, sqliteBin)
}

/**
 * Stage 2 — transitive callers up to a depth, via a recursive CTE over call edges.
 *
 * @param db Database path.
 * @param symbol Symbol name.
 * @param options `file` disambiguates duplicate names, `depth` bounds the walk, `limit` caps rows.
 * @param sqliteBin sqlite3 executable.
 * @returns Rows `{depth, caller, caller_file, occurrence_line}` ordered by distance.
 */
export function impact(db, symbol, options = {}, sqliteBin = 'sqlite3') {
  const target = targetOrdinal(db, symbol, options.file, sqliteBin)
  if (target === null) return []
  const depth = Math.max(1, Number(options.depth ?? 3))
  return query(db, `WITH RECURSIVE up(ordinal, depth) AS (SELECT ${target}, 0 UNION SELECT e.from_ord, up.depth + 1 FROM graph_edges e JOIN up ON e.to_ord = up.ordinal WHERE e.snapshot_id=${SCOPE} AND e.role='"Call"' AND up.depth < ${depth}) SELECT DISTINCT up.depth, s.name AS caller, s.file AS caller_file, json_extract(s.symbol,'$.line') AS line FROM up JOIN graph_symbols s ON s.snapshot_id=${SCOPE} AND s.ordinal=up.ordinal WHERE up.depth > 0 ORDER BY up.depth, s.file LIMIT ${Number(options.limit ?? 60)}`, sqliteBin)
}

/**
 * Symbols defined in one file.
 *
 * @param db Database path.
 * @param file Repository-relative file path.
 * @param options `limit` caps rows.
 * @param sqliteBin sqlite3 executable.
 * @returns Definition rows `{name, kind, file, line}`.
 */
export function symbolsInFile(db, file, options = {}, sqliteBin = 'sqlite3') {
  return query(db, `SELECT ${SYMBOL_COLUMNS} FROM graph_symbols WHERE snapshot_id=${SCOPE} AND file=${sqlStr(file)} ORDER BY json_extract(symbol,'$.line') LIMIT ${Number(options.limit ?? 200)}`, sqliteBin)
}

/**
 * Files that depend on the symbols defined in one file, walked backwards over
 * call/read/type-reference edges.
 *
 * This is a graph-level ripple estimate for a changed file, not a test plan: it
 * answers "what else can see this", not "what must be retested".
 *
 * @param db Database path.
 * @param file Repository-relative file path.
 * @param options `depth` bounds the walk, `limit` caps rows.
 * @param sqliteBin sqlite3 executable.
 * @returns Rows `{file, depth}` ordered by distance from the changed file.
 */
export function dependentFiles(db, file, options = {}, sqliteBin = 'sqlite3') {
  const depth = Math.max(1, Number(options.depth ?? 2))
  return query(db, `WITH RECURSIVE up(ordinal, depth) AS (
      SELECT ordinal, 0 FROM graph_symbols WHERE snapshot_id=${SCOPE} AND file=${sqlStr(file)}
      UNION
      SELECT e.from_ord, up.depth + 1 FROM graph_edges e JOIN up ON e.to_ord = up.ordinal
      WHERE e.snapshot_id=${SCOPE} AND e.role IN ('"Call"','"Read"','"TypeRef"') AND up.depth < ${depth}
    )
    SELECT s.file AS file, MIN(up.depth) AS depth
    FROM up JOIN graph_symbols s ON s.snapshot_id=${SCOPE} AND s.ordinal=up.ordinal
    WHERE up.depth > 0 AND s.file <> ${sqlStr(file)}
    GROUP BY s.file ORDER BY depth, s.file LIMIT ${Number(options.limit ?? 80)}`, sqliteBin)
}

/**
 * The graph ordinal of a symbol's definition, preferring an exact file match.
 *
 * @param db Database path.
 * @param symbol Symbol name.
 * @param file Optional file that disambiguates duplicate names across crates.
 * @param sqliteBin sqlite3 executable.
 * @returns The ordinal, or null when the symbol is absent.
 */
export function targetOrdinal(db, symbol, file, sqliteBin = 'sqlite3') {
  const fileClause = file ? ` AND file = ${sqlStr(file)}` : ''
  const rows = query(db, `SELECT ordinal FROM graph_symbols WHERE snapshot_id=${SCOPE} AND name=${sqlStr(symbol)}${fileClause} ORDER BY CASE WHEN replace(kind,'"','')='Function' THEN 0 ELSE 1 END, file LIMIT 1`, sqliteBin)
  return rows[0]?.ordinal ?? null
}

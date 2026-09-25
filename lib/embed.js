import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

import { sqlStr } from './c2g.js'

/**
 * The merged c2g graph store under `~/Embed/c2g`.
 *
 * It is a different artifact from the per-project CLI cache: one SQLite file
 * holding `nodes(id, name, kind, file, repo, line)` and `links(source, target,
 * relation)`, merged from per-crate shards and rebuilt on import. Because it is
 * merged, one store answers for every worktree of the same repository — which is
 * exactly the gap the per-project cache leaves when it has no entry for a
 * worktree.
 *
 * Paths inside the store are shard-relative (`nd_src/control/sequence/registry.rs`)
 * rather than worktree-relative, so this module maps between the two and only
 * claims a mapping it can confirm on disk.
 */

/** Default store path. */
export const DEFAULT_EMBED_STORE = join(homedir(), 'Embed', 'c2g', 'graph_index.sqlite')

/** Shard label -> worktree-relative directory, verified against NodeDB worktrees. */
export const SHARD_PREFIXES = {
  nd_src: 'nodedb/src',
  nd_tests: 'nodedb/tests',
  nd_sql: 'nodedb-sql',
  nd_cluster: 'nodedb-cluster',
  nd_types: 'nodedb-types',
  nd_vector: 'nodedb-vector',
}

/** The shard holding everything not claimed by a specific one; its paths are already worktree-relative. */
export const REST_SHARD = 'nd_rest'

/**
 * Open the merged store when it exists and looks usable.
 *
 * @param path Store path.
 * @returns `{path, builtAt, count, manifest}` or null.
 */
export function openStore(path = DEFAULT_EMBED_STORE) {
  if (!existsSync(path) || !statSync(path).isFile()) return null
  let manifest = null
  const manifestPath = join(path, '..', 'manifest.json')
  try {
    if (existsSync(manifestPath)) manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  } catch {
    manifest = null
  }
  return {
    path,
    builtAt: typeof manifest?.built_at === 'string' ? manifest.built_at : null,
    count: Number.isInteger(manifest?.count) ? manifest.count : null,
    manifest,
  }
}

/**
 * Run one read-only query against the store.
 *
 * @param path Store path.
 * @param sql SQL text.
 * @param sqliteBin sqlite3 executable.
 * @param timeoutMs Query timeout.
 * @returns Parsed rows.
 */
export function query(path, sql, sqliteBin = 'sqlite3', timeoutMs = 30_000) {
  const out = execFileSync(sqliteBin, ['-readonly', '-json', path, sql], { encoding: 'utf8', timeout: timeoutMs, maxBuffer: 32 * 1024 * 1024 })
  const trimmed = out.trim()
  return trimmed === '' ? [] : JSON.parse(trimmed)
}

/**
 * Map a stored shard file to a worktree-relative path.
 *
 * @param worktree Worktree root.
 * @param storedFile `file` column value.
 * @param repo `repo` column value (shard label).
 * @param overrides Optional shard -> directory overrides from configuration.
 * @returns `{path, exists}`; `path` is the best candidate even when it does not exist.
 */
export function toWorktreePath(worktree, storedFile, repo, overrides = {}) {
  const prefixes = { ...SHARD_PREFIXES, ...overrides }
  if (repo === REST_SHARD) return { path: storedFile, exists: existsSync(join(worktree, storedFile)) }
  const prefix = prefixes[repo]
  if (prefix === undefined) return { path: storedFile, exists: existsSync(join(worktree, storedFile)) }
  const rest = storedFile.startsWith(`${repo}/`) ? storedFile.slice(repo.length + 1) : storedFile
  const candidate = `${prefix}/${rest}`
  return { path: candidate, exists: existsSync(join(worktree, candidate)) }
}

/**
 * Map a worktree-relative path to its stored shard file name.
 *
 * @param worktreeRelative Path relative to the worktree root.
 * @param overrides Optional shard -> directory overrides from configuration.
 * @returns The stored file name, or null when no shard claims the path.
 */
export function toStoredPath(worktreeRelative, overrides = {}) {
  const prefixes = { ...SHARD_PREFIXES, ...overrides }
  for (const [shard, prefix] of Object.entries(prefixes)) {
    if (worktreeRelative === prefix) return shard
    if (worktreeRelative.startsWith(`${prefix}/`)) return `${shard}/${worktreeRelative.slice(prefix.length + 1)}`
  }
  return `${REST_SHARD}/${worktreeRelative}`
}

const NODE_COLUMNS = 'id, name, kind, file, repo, line'

/**
 * Resolve symbol definitions in the merged store.
 *
 * @param path Store path.
 * @param name Symbol name.
 * @param options `worktree` for path mapping, `file` to narrow, `limit`.
 * @param sqliteBin sqlite3 executable.
 * @returns Rows `{name, kind, file, repo, line, path, exists}`.
 */
export function locate(path, name, options = {}, sqliteBin = 'sqlite3') {
  const limit = options.limit ?? 10
  const fileClause = options.file ? ` AND file LIKE ${sqlStr(`%${options.file}%`)}` : ''
  const rows = query(path, `SELECT ${NODE_COLUMNS} FROM nodes WHERE name = ${sqlStr(name)}${fileClause} ORDER BY repo, file, line LIMIT ${Number(limit)}`, sqliteBin)
  return rows.map(row => {
    const mapped = options.worktree === undefined ? { path: row.file, exists: false } : toWorktreePath(options.worktree, row.file, row.repo, options.overrides)
    return { ...row, path: mapped.path, exists: mapped.exists }
  })
}

/**
 * The symbol that contains a worktree file position — the merged store's answer
 * to a stack frame. The nearest definition at or above the line wins.
 *
 * @param path Store path.
 * @param worktree Worktree root.
 * @param worktreeRelative File path relative to the worktree.
 * @param line 1-based line from a stack trace.
 * @param options Shard overrides.
 * @param sqliteBin sqlite3 executable.
 * @returns `{name, kind, file, repo, line, path, exists}`, or null when nothing contains the position.
 */
export function symbolAtLine(path, worktree, worktreeRelative, line, options = {}, sqliteBin = 'sqlite3') {
  const stored = toStoredPath(worktreeRelative, options.overrides)
  const rows = query(path, `SELECT ${NODE_COLUMNS} FROM nodes WHERE file = ${sqlStr(stored)} AND line <= ${Number(line)} ORDER BY line DESC LIMIT 1`, sqliteBin)
  if (rows.length === 0) return null
  const row = rows[0]
  const mapped = toWorktreePath(worktree, row.file, row.repo, options.overrides)
  return { ...row, path: mapped.path, exists: mapped.exists }
}

/**
 * Call sites of a symbol, from `links` where the relation is a call.
 *
 * @param path Store path.
 * @param name Symbol name.
 * @param options `worktree`, `limit`, `relations`.
 * @param sqliteBin sqlite3 executable.
 * @returns Rows `{caller, caller_file, caller_repo, caller_line, relation, path, exists}`.
 */
export function callers(path, name, options = {}, sqliteBin = 'sqlite3') {
  const limit = options.limit ?? 40
  const relations = options.relations ?? ['CALL']
  const clause = relations.map(r => sqlStr(r)).join(', ')
  const rows = query(path, `SELECT n.name AS caller, n.kind AS caller_kind, n.file AS caller_file, n.repo AS caller_repo, n.line AS caller_line, l.relation
    FROM links l JOIN nodes n ON n.id = l.source
    WHERE l.target IN (SELECT id FROM nodes WHERE name = ${sqlStr(name)}) AND l.relation IN (${clause})
    ORDER BY n.repo, n.file, n.line LIMIT ${Number(limit)}`, sqliteBin)
  return rows.map(row => {
    const mapped = options.worktree === undefined ? { path: row.caller_file, exists: false } : toWorktreePath(options.worktree, row.caller_file, row.caller_repo, options.overrides)
    return { ...row, path: mapped.path, exists: mapped.exists }
  })
}

/**
 * Symbols a symbol calls.
 *
 * @param path Store path.
 * @param name Symbol name.
 * @param options `worktree`, `limit`, `relations`.
 * @param sqliteBin sqlite3 executable.
 * @returns Rows `{callee, callee_file, callee_repo, callee_line, relation, path, exists}`.
 */
export function callees(path, name, options = {}, sqliteBin = 'sqlite3') {
  const limit = options.limit ?? 40
  const relations = options.relations ?? ['CALL']
  const clause = relations.map(r => sqlStr(r)).join(', ')
  const rows = query(path, `SELECT n.name AS callee, n.kind AS callee_kind, n.file AS callee_file, n.repo AS callee_repo, n.line AS callee_line, l.relation
    FROM links l JOIN nodes n ON n.id = l.target
    WHERE l.source IN (SELECT id FROM nodes WHERE name = ${sqlStr(name)}) AND l.relation IN (${clause})
    ORDER BY n.repo, n.file, n.line LIMIT ${Number(limit)}`, sqliteBin)
  return rows.map(row => {
    const mapped = options.worktree === undefined ? { path: row.callee_file, exists: false } : toWorktreePath(options.worktree, row.callee_file, row.callee_repo, options.overrides)
    return { ...row, path: mapped.path, exists: mapped.exists }
  })
}

/**
 * Transitive callers of a symbol, bounded by depth.
 *
 * @param path Store path.
 * @param name Symbol name.
 * @param options `worktree`, `depth`, `limit`, `relations`.
 * @param sqliteBin sqlite3 executable.
 * @returns Rows `{depth, caller, caller_file, caller_repo, caller_line, path, exists}`.
 */
export function impact(path, name, options = {}, sqliteBin = 'sqlite3') {
  const depth = Math.max(1, Number(options.depth ?? 3))
  const limit = options.limit ?? 60
  const relations = options.relations ?? ['CALL']
  const clause = relations.map(r => sqlStr(r)).join(', ')
  const rows = query(path, `WITH RECURSIVE up(id, depth) AS (
      SELECT id, 0 FROM nodes WHERE name = ${sqlStr(name)}
      UNION
      SELECT l.source, up.depth + 1 FROM links l JOIN up ON l.target = up.id
      WHERE l.relation IN (${clause}) AND up.depth < ${depth}
    )
    SELECT MIN(up.depth) AS depth, n.name AS caller, n.file AS caller_file, n.repo AS caller_repo, n.line AS caller_line
    FROM up JOIN nodes n ON n.id = up.id
    WHERE up.depth > 0
    GROUP BY n.id ORDER BY depth, n.repo, n.file LIMIT ${Number(limit)}`, sqliteBin)
  return rows.map(row => {
    const mapped = options.worktree === undefined ? { path: row.caller_file, exists: false } : toWorktreePath(options.worktree, row.caller_file, row.caller_repo, options.overrides)
    return { ...row, path: mapped.path, exists: mapped.exists }
  })
}

/**
 * Files that depend on the symbols defined in one worktree file, walked
 * backwards over call links.
 *
 * @param path Store path.
 * @param worktree Worktree root.
 * @param worktreeRelative File path relative to the worktree.
 * @param options `depth`, `limit`, shard overrides.
 * @param sqliteBin sqlite3 executable.
 * @returns Rows `{file, repo, depth, path, exists}`.
 */
export function dependentFiles(path, worktree, worktreeRelative, options = {}, sqliteBin = 'sqlite3') {
  const stored = toStoredPath(worktreeRelative, options.overrides)
  const depth = Math.max(1, Number(options.depth ?? 2))
  const limit = options.limit ?? 80
  const rows = query(path, `WITH RECURSIVE up(id, depth) AS (
      SELECT id, 0 FROM nodes WHERE file = ${sqlStr(stored)}
      UNION
      SELECT l.source, up.depth + 1 FROM links l JOIN up ON l.target = up.id
      WHERE up.depth < ${depth}
    )
    SELECT MIN(up.depth) AS depth, n.file AS file, n.repo AS repo
    FROM up JOIN nodes n ON n.id = up.id
    WHERE up.depth > 0 AND n.file <> ${sqlStr(stored)}
    GROUP BY n.file ORDER BY depth, n.file LIMIT ${Number(limit)}`, sqliteBin)
  return rows.map(row => {
    const mapped = toWorktreePath(worktree, row.file, row.repo, options.overrides)
    return { ...row, path: mapped.path, exists: mapped.exists }
  })
}

/**
 * Is this store a merged c2g graph we can query?
 *
 * @param path Store path.
 * @param sqliteBin sqlite3 executable.
 * @returns True when `nodes` answers.
 */
export function isUsable(path, sqliteBin = 'sqlite3') {
  try {
    query(path, 'SELECT count(*) AS n FROM nodes LIMIT 1', sqliteBin, 15_000)
    return true
  } catch {
    return false
  }
}

/**
 * Resolve a row to `path:line` for display, preferring a confirmed worktree
 * mapping. Caller and callee rows carry their line under a role-specific column.
 */
export function displayPath(row) {
  const path = row.path ?? row.file ?? row.caller_file ?? row.callee_file
  const line = row.line ?? row.caller_line ?? row.callee_line
  return `${path}${line !== undefined && line !== null ? `:${line}` : ''}`
}

/** Absolute path of the store for a worktree's repository, for logging. */
export function storeLabel(store) {
  return `${resolve(store.path)}${store.builtAt !== null ? ` (built ${store.builtAt})` : ''}`
}

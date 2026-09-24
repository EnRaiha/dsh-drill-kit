import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

/**
 * Cache layer for the drill plugin.
 *
 * Everything the plugin can rebuild lives under one cache root — never `/tmp`,
 * which the host may wipe between sessions — and carries a time to live: an
 * entry that has not been used for a week is removed the next time the cache is
 * touched. Discovery results and search indexes are derived data, so expiring
 * them costs a rebuild, never evidence.
 */

/** Default cache root: `$XDG_CACHE_HOME/dsh-drill`, else `~/.cache/dsh-drill`. */
export const DEFAULT_CACHE_ROOT = join(process.env.XDG_CACHE_HOME ?? join(homedir(), '.cache'), 'dsh-drill')

/** Default time to live for cached derived data: one week. */
export const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000

/**
 * The cache root in use for one call.
 *
 * @param configured Value from the row config; an empty string means the default.
 * @returns Absolute cache root path.
 */
export function cacheRoot(configured) {
  return configured !== undefined && configured !== null && configured.length > 0 ? configured : DEFAULT_CACHE_ROOT
}

/** Ensure a directory exists. */
export function ensureDir(dir) {
  mkdirSync(dir, { recursive: true })
  return dir
}

/**
 * Read a JSON cache file, honouring its time to live.
 *
 * @param path Cache file.
 * @param ttlMs Maximum age in milliseconds; an older file reads as absent.
 * @returns Parsed value, or null when missing, expired or unreadable.
 */
export function readCache(path, ttlMs = DEFAULT_TTL_MS) {
  if (!existsSync(path)) return null
  try {
    const stat = statSync(path)
    if (ttlMs > 0 && Date.now() - stat.mtimeMs > ttlMs) return null
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return null
  }
}

/**
 * Write a JSON cache file atomically and mark it as just used.
 *
 * @param path Cache file.
 * @param value JSON-serializable value.
 * @returns The path written.
 */
export function writeCache(path, value) {
  ensureDir(dirname(path))
  const tmp = `${path}.tmp-${process.pid}`
  writeFileSync(tmp, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
  renameSync(tmp, path)
  touch(path)
  return path
}

/**
 * Mark a cache entry as used, so the TTL measures idleness rather than age.
 *
 * @param path File or directory to touch.
 */
export function touch(path) {
  try {
    const now = new Date()
    utimesSync(path, now, now)
  } catch {
    // A missing entry needs no touch; the caller rebuilds it.
  }
}

/**
 * Remove cache entries that have not been used within the time to live.
 *
 * @param dir Directory holding one entry per child.
 * @param options `ttlMs` idle limit, `keep` names never removed, `now` clock override for tests.
 * @returns `{ removed, kept, freedBytes }`.
 */
export function pruneDir(dir, options = {}) {
  const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS
  const keep = new Set(options.keep ?? [])
  const now = options.now ?? Date.now()
  if (!existsSync(dir)) return { removed: [], kept: [], freedBytes: 0 }

  const removed = []
  const kept = []
  let freedBytes = 0
  for (const entry of readdirSync(dir)) {
    if (keep.has(entry)) {
      kept.push(entry)
      continue
    }
    const path = join(dir, entry)
    let stat
    try {
      stat = statSync(path)
    } catch {
      continue
    }
    if (ttlMs > 0 && now - stat.mtimeMs > ttlMs) {
      freedBytes += sizeOf(path)
      try {
        rmSync(path, { recursive: true, force: true })
        removed.push(entry)
      } catch {
        // A concurrent removal already did the work.
      }
    } else {
      kept.push(entry)
    }
  }
  return { removed, kept, freedBytes }
}

/**
 * Recursive size of a file or directory.
 *
 * @param path Entry to measure.
 * @returns Size in bytes; unreadable entries count as zero.
 */
export function sizeOf(path) {
  let total = 0
  let stat
  try {
    stat = statSync(path)
  } catch {
    return 0
  }
  if (!stat.isDirectory()) return stat.size
  for (const entry of readdirSync(path)) total += sizeOf(join(path, entry))
  return total
}

/**
 * Remove a cache entry outright.
 *
 * @param path Entry to remove.
 * @returns True when something was removed.
 */
export function drop(path) {
  if (!existsSync(path)) return false
  rmSync(path, { recursive: true, force: true })
  return true
}

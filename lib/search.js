import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { delimiter, join } from 'node:path'

import { DEFAULT_TTL_MS, cacheRoot, pruneDir, sizeOf, touch } from './cache.js'

/**
 * Text-search engines for drill evidence.
 *
 * Stage 1–2 prefer the code2graph cache, which resolves symbols. When no cache
 * covers the repository — or the symbol is not in it — the drill still needs an
 * answer, so this module falls back to a text search and labels the result as
 * text-level rather than pretending it is a resolved call graph.
 *
 * `tgrep` is a trigram-indexed grep with a ripgrep-compatible `--json` stream;
 * `rg` is ripgrep itself. Both are parsed by the same reader.
 *
 * A tgrep index normally lives at `<root>/.tgrep`, which would add untracked
 * files to a drill worktree and show up in `git status`. `--index-path` moves it
 * out of the repository, so indexes are kept under a cache directory keyed by
 * the root path and the worktree stays clean.
 */

/** Extra directories searched for a bare binary name, in order after PATH. */
const EXTRA_BIN_DIRS = [join(homedir(), '.local', 'bin'), join(homedir(), '.cargo', 'bin'), '/usr/local/bin']

/** Default directory holding out-of-tree tgrep indexes, under the drill cache root. */
export const DEFAULT_INDEX_DIR = join(cacheRoot(), 'tgrep')

/** Legacy index location used before the cache root was unified. */
const LEGACY_INDEX_DIR = join(homedir(), '.cache', 'tgrep-index')

/**
 * Stable directory name for one indexed root.
 *
 * @param root Absolute root path.
 * @returns A filesystem-safe slug that is stable across runs.
 */
export function indexSlug(root) {
  return root.replace(/^\/+/, '').replaceAll(/[^A-Za-z0-9._-]+/g, '-')
}

/**
 * The out-of-tree index directory for a root.
 *
 * @param root Absolute root path.
 * @param baseDir Index base directory; defaults to {@link DEFAULT_INDEX_DIR}.
 * @returns Absolute index directory path.
 */
export function indexDirFor(root, baseDir = DEFAULT_INDEX_DIR) {
  return join(baseDir, indexSlug(root))
}

/**
 * Read a tgrep index's metadata.
 *
 * @param dir Index directory.
 * @returns `{rootPath, files, trigrams, updatedAt}` or null when the directory holds no index.
 */
export function readIndexMeta(dir) {
  const metaPath = join(dir, 'meta.json')
  if (!existsSync(metaPath)) return null
  try {
    const raw = JSON.parse(readFileSync(metaPath, 'utf8'))
    return {
      rootPath: typeof raw.root_path === 'string' ? raw.root_path : null,
      files: Number.isInteger(raw.num_files) ? raw.num_files : null,
      trigrams: Number.isInteger(raw.num_trigrams) ? raw.num_trigrams : null,
      updatedAt: Number.isInteger(raw.updated_at) ? raw.updated_at : null,
    }
  } catch {
    return null
  }
}

/**
 * Whether an out-of-tree index covers a root.
 *
 * @param root Root the search will run against.
 * @param baseDir Index base directory.
 * @returns The index directory when a matching index exists, else null.
 */
export function indexFor(root, baseDir = DEFAULT_INDEX_DIR, options = {}) {
  const dir = indexDirFor(root, baseDir)
  const meta = readIndexMeta(dir)
  if (meta === null || meta.rootPath === null) return null
  if (meta.rootPath !== root) return null
  // Touching on use makes the time to live measure idleness, so indexes for
  // worktrees still being drilled survive while abandoned ones expire.
  if (options.touch !== false) touch(dir)
  return dir
}

/**
 * Remove tgrep indexes that have not been used within the time to live.
 *
 * @param options `baseDir`, `ttlMs`, `keepRoots`.
 * @returns `{ removed, freedBytes, kept }`.
 */
export function pruneIndexes(options = {}) {
  const baseDir = options.baseDir ?? DEFAULT_INDEX_DIR
  const keep = (options.keepRoots ?? []).map(root => indexSlug(root))
  const result = pruneDir(baseDir, { ttlMs: options.ttlMs ?? DEFAULT_TTL_MS, keep, now: options.now })
  return { removed: result.removed, freedBytes: result.freedBytes, kept: result.kept }
}

/**
 * Total size of the index cache.
 *
 * @param baseDir Index base directory.
 * @returns Size in bytes.
 */
export function indexesSize(baseDir = DEFAULT_INDEX_DIR) {
  return existsSync(baseDir) ? sizeOf(baseDir) : 0
}

/**
 * Absolute path of the pre-unification index cache, when it still exists.
 *
 * @returns The legacy directory path or null.
 */
export function legacyIndexDir() {
  return existsSync(LEGACY_INDEX_DIR) ? LEGACY_INDEX_DIR : null
}

/**
 * Build or refresh the out-of-tree index for a root.
 *
 * The index directory is created outside the repository, so the worktree gains
 * no untracked files and `git status` stays clean for the drill's own checks.
 *
 * @param options `root`, `baseDir`, `tgrepBin`, `force`, `pathEnv`, `timeoutMs`.
 * @returns `{ok, dir, meta, error}`.
 */
export function indexRoot(options) {
  const root = options.root
  const dir = indexDirFor(root, options.baseDir ?? DEFAULT_INDEX_DIR)
  const bin = resolveBin(options.tgrepBin ?? 'tgrep', options.pathEnv)
  if (bin === null) return { ok: false, dir, meta: null, error: 'tgrep is not available' }
  mkdirSync(dir, { recursive: true })
  const args = ['index', '--index-path', dir]
  if (options.force) args.push('--force')
  args.push(root)
  try {
    const stdout = execFileSync(bin, args, { encoding: 'utf8', timeout: options.timeoutMs ?? 600_000, maxBuffer: 8 * 1024 * 1024 })
    return { ok: true, dir, meta: readIndexMeta(dir), error: null, stdout: stdout.trim() }
  } catch (error) {
    return { ok: false, dir, meta: readIndexMeta(dir), error: String(error?.stderr ?? error?.message ?? error).trim().slice(0, 400) }
  }
}

/**
 * Resolve a configured binary name to an executable path.
 *
 * @param name Bare name or absolute path.
 * @param pathEnv PATH-like string; defaults to `process.env.PATH`.
 * @returns The resolved path, or null when nothing executable exists.
 */
export function resolveBin(name, pathEnv = process.env.PATH ?? '') {
  if (name.includes('/')) return existsSync(name) && statSync(name).isFile() ? name : null
  const dirs = [...pathEnv.split(delimiter).filter(Boolean), ...EXTRA_BIN_DIRS]
  for (const dir of dirs) {
    const candidate = join(dir, name)
    try {
      if (statSync(candidate).isFile()) return candidate
    } catch {
      // Not in this directory; keep looking.
    }
  }
  return null
}

/**
 * Choose the text-search engine for a root.
 *
 * `auto` prefers tgrep only when an index actually covers that root — in-tree
 * (`<root>/.tgrep`) or out-of-tree (`<indexDir>/<slug>`) — because an unindexed
 * tgrep run scans every file, warns, and is slower than ripgrep.
 *
 * @param options `engine`, `root`, `rgBin`, `tgrepBin`, `indexDir`, optional PATH override.
 * @returns `{ engine, bin, indexDir }` or null when neither engine is available.
 */
export function resolveEngine(options = {}) {
  const requested = options.engine ?? 'auto'
  const rg = resolveBin(options.rgBin ?? 'rg', options.pathEnv)
  const tgrep = resolveBin(options.tgrepBin ?? 'tgrep', options.pathEnv)
  const root = options.root
  const external = root === undefined ? null : indexFor(root, options.indexDir ?? DEFAULT_INDEX_DIR)
  const inTree = root !== undefined && existsSync(join(root, '.tgrep')) ? join(root, '.tgrep') : null
  const indexDir = external ?? inTree

  if (requested === 'rg') return rg === null ? null : { engine: 'rg', bin: rg, indexDir: null }
  if (requested === 'tgrep') return tgrep === null ? null : { engine: 'tgrep', bin: tgrep, indexDir }
  if (tgrep !== null && indexDir !== null) return { engine: 'tgrep', bin: tgrep, indexDir }
  if (rg !== null) return { engine: 'rg', bin: rg, indexDir: null }
  return tgrep === null ? null : { engine: 'tgrep', bin: tgrep, indexDir: null }
}

/**
 * Parse one ripgrep-compatible JSON line into a hit, or null for other events.
 *
 * Both rg and tgrep emit `{type:'match', data:{path:{text}, line_number, lines:{text}, submatches:[{start}]}}`.
 *
 * @param line One JSON line.
 * @returns `{file, line, column, text}` or null.
 */
export function parseJsonLine(line) {
  const trimmed = line.trim()
  if (trimmed === '' || !trimmed.startsWith('{')) return null
  let event
  try {
    event = JSON.parse(trimmed)
  } catch {
    return null
  }
  if (event?.type !== 'match') return null
  const file = event.data?.path?.text
  if (typeof file !== 'string') return null
  const text = typeof event.data?.lines?.text === 'string' ? event.data.lines.text.replace(/\n$/, '') : ''
  const start = event.data?.submatches?.[0]?.start
  return {
    file,
    line: Number.isInteger(event.data?.line_number) ? event.data.line_number : null,
    column: Number.isInteger(start) ? start + 1 : null,
    text: text.split('\n')[0].slice(0, 400),
  }
}

/**
 * Run a text search and return labelled hits.
 *
 * @param options Search request.
 * @param options.pattern Regex or literal pattern.
 * @param options.root Directory to search.
 * @param options.glob Optional glob filter (repeatable in the underlying engine).
 * @param options.fixed Treat the pattern as a literal string.
 * @param options.word Whole-word matching.
 * @param options.ignoreCase Case-insensitive matching.
 * @param options.maxCount Cap on returned hits.
 * @param options.engine `auto` | `rg` | `tgrep`.
 * @param options.rgBin, options.tgrepBin Binary names or paths.
 * @param options.pathEnv PATH override used to resolve binaries.
 * @param options.timeoutMs Command timeout.
 * @returns `{ engine, bin, hits, truncated, error }`.
 */
export function searchText(options) {
  const root = options.root
  const resolved = resolveEngine({ engine: options.engine, root, rgBin: options.rgBin, tgrepBin: options.tgrepBin, indexDir: options.indexDir, pathEnv: options.pathEnv })
  if (resolved === null) return { engine: null, bin: null, hits: [], truncated: false, error: 'neither rg nor tgrep is available' }

  const args = ['--json', '--no-heading', '--with-filename']
  if (resolved.engine === 'tgrep' && resolved.indexDir !== null) args.push('--index-path', resolved.indexDir)
  if (options.fixed) args.push('--fixed-strings')
  if (options.word) args.push('--word-regexp')
  if (options.ignoreCase) args.push('--ignore-case')
  if (options.glob) args.push('--glob', options.glob)
  if (options.maxCount) args.push('--max-count', String(options.maxCount))
  args.push('--', options.pattern, root ?? '.')

  let raw = ''
  try {
    raw = execFileSync(resolved.bin, args, { encoding: 'utf8', timeout: options.timeoutMs ?? 30_000, maxBuffer: 32 * 1024 * 1024 })
  } catch (error) {
    // rg exits 1 when nothing matched; that is an empty result, not a failure.
    if (error?.status === 1 && typeof error.stdout === 'string') raw = error.stdout
    else if (error?.status === 2) return { engine: resolved.engine, bin: resolved.bin, indexDir: resolved.indexDir, hits: [], truncated: false, error: String(error.stderr ?? error.message).trim().slice(0, 300) }
    else if (typeof error?.stdout === 'string') raw = error.stdout
    else return { engine: resolved.engine, bin: resolved.bin, indexDir: resolved.indexDir, hits: [], truncated: false, error: String(error?.message ?? error).slice(0, 300) }
  }

  if (resolved.engine === 'tgrep' && resolved.indexDir !== null) touch(resolved.indexDir)

  const hits = []
  for (const line of raw.split('\n')) {
    const hit = parseJsonLine(line)
    if (hit) hits.push(hit)
  }
  const max = options.maxHits ?? 200
  const truncated = hits.length > max
  return { engine: resolved.engine, bin: resolved.bin, indexDir: resolved.indexDir, hits: truncated ? hits.slice(0, max) : hits, truncated, error: null }
}

/** Rust definition keywords used by the localization fallback. */
export const RUST_DEFINITION_KEYWORDS = ['fn', 'struct', 'enum', 'trait', 'union', 'impl', 'mod', 'type', 'const', 'static', 'macro_rules!']

/**
 * Build a definition-site pattern for a symbol name.
 *
 * This is deliberately loose: it is a text heuristic that produces candidates
 * for a human or the model to confirm, never a claim about the resolved symbol.
 *
 * @param symbol Symbol name.
 * @param language `rust` (default) or `generic`.
 * @returns A regex string.
 */
export function definitionPattern(symbol, language = 'rust') {
  const escaped = symbol.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&')
  if (language !== 'rust') return `\\b${escaped}\\b`
  const keywords = RUST_DEFINITION_KEYWORDS.map(keyword => keyword.replace('!', '\\!')).join('|')
  return `^\\s*(?:pub(?:\\([^)]*\\))?\\s+)?(?:async\\s+)?(?:unsafe\\s+)?(?:const\\s+)?(?:${keywords})\\s+${escaped}\\b`
}

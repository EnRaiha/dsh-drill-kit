import { execFileSync } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { delimiter, join } from 'node:path'

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
 */

/** Extra directories searched for a bare binary name, in order after PATH. */
const EXTRA_BIN_DIRS = [join(homedir(), '.local', 'bin'), join(homedir(), '.cargo', 'bin'), '/usr/local/bin']

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
 * `auto` prefers tgrep only when it has an index for that root: an unindexed
 * tgrep run scans every file and warns, which is slower than ripgrep and adds a
 * warning line to the evidence log.
 *
 * @param options `engine`, `root`, `rgBin`, `tgrepBin`, optional PATH override.
 * @returns `{ engine, bin }` or null when neither engine is available.
 */
export function resolveEngine(options = {}) {
  const requested = options.engine ?? 'auto'
  const rg = resolveBin(options.rgBin ?? 'rg', options.pathEnv)
  const tgrep = resolveBin(options.tgrepBin ?? 'tgrep', options.pathEnv)
  const indexed = options.root !== undefined && existsSync(join(options.root, '.tgrep'))

  if (requested === 'rg') return rg === null ? null : { engine: 'rg', bin: rg }
  if (requested === 'tgrep') return tgrep === null ? null : { engine: 'tgrep', bin: tgrep }
  if (tgrep !== null && indexed) return { engine: 'tgrep', bin: tgrep }
  if (rg !== null) return { engine: 'rg', bin: rg }
  return tgrep === null ? null : { engine: 'tgrep', bin: tgrep }
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
  const resolved = resolveEngine({ engine: options.engine, root, rgBin: options.rgBin, tgrepBin: options.tgrepBin, pathEnv: options.pathEnv })
  if (resolved === null) return { engine: null, bin: null, hits: [], truncated: false, error: 'neither rg nor tgrep is available' }

  const args = ['--json', '--no-heading', '--with-filename']
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
    else if (error?.status === 2) return { engine: resolved.engine, bin: resolved.bin, hits: [], truncated: false, error: String(error.stderr ?? error.message).trim().slice(0, 300) }
    else if (typeof error?.stdout === 'string') raw = error.stdout
    else return { engine: resolved.engine, bin: resolved.bin, hits: [], truncated: false, error: String(error?.message ?? error).slice(0, 300) }
  }

  const hits = []
  for (const line of raw.split('\n')) {
    const hit = parseJsonLine(line)
    if (hit) hits.push(hit)
  }
  const max = options.maxHits ?? 200
  const truncated = hits.length > max
  return { engine: resolved.engine, bin: resolved.bin, hits: truncated ? hits.slice(0, max) : hits, truncated, error: null }
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

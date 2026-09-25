/**
 * Turn a failure signal into drill frames.
 *
 * The pipeline's first stage starts from "the stack trace, error logs, input
 * payload, and the specific function throwing the error" — not from a symbol
 * name. This module parses the shapes a real failure arrives in (a Rust panic,
 * a numbered backtrace, a compiler diagnostic, a Python traceback, a plain
 * `file:line` mention) into frames a resolver can look up.
 *
 * Parsing is deliberately conservative: a frame is reported only when it carries
 * an explicit `file:line`, and standard-library or dependency frames are marked
 * `external` instead of being dropped, so a caller can show why a frame was not
 * resolved.
 */

/** Source extensions a bare `file:line` mention may carry. */
const SOURCE_EXT = 'rs|py|ts|tsx|js|jsx|mjs|cjs|go|java|kt|rb|c|cc|cpp|cxx|h|hpp|sql|toml|yaml|yml|json'

/** Frame cap, so a pathological log cannot flood the ledger. */
export const MAX_FRAMES = 40

/**
 * Paths that belong to a toolchain or dependency tree rather than the repository.
 *
 * The `library/...` roots are deliberately **not** here: as substrings they also
 * match a repository path such as `src/library/std/thing.rs`, which would mark a
 * real frame external. They are matched as prefixes instead — see below.
 */
const EXTERNAL_MARKERS = ['/rustc/', '/rustlib/', '/.cargo/registry/', '/node_modules/', '/usr/lib/', '/usr/local/lib/', '/site-packages/', '/.rustup/']

/**
 * The same trees, as they appear when printed *relative* rather than absolute.
 *
 * Rust reports a panic inside the standard library as
 * `panicked at library/std/src/panicking.rs:597:5:` — no leading slash — and a
 * dependency as `at /home/<user>/.cargo/registry/...` or, in some builds,
 * `node_modules/...`. Matching only the absolute forms counted those as
 * repository frames, which turned "the bug is inside std" into a
 * localization pointing at a file that does not exist in the worktree.
 *
 * These are matched as **prefixes**, so a repository that genuinely contains
 * `src/library/std/` keeps its own file.
 */
const EXTERNAL_PREFIXES = [
  'library/core/', 'library/std/', 'library/alloc/', 'library/panic_abort/', 'library/panic_unwind/',
  'library/profiler_builtins/', 'rustc/', 'rustlib/', '.cargo/registry/', '.rustup/',
  'node_modules/', 'site-packages/', 'usr/lib/', 'usr/local/lib/',
]

/**
 * True when a path belongs to a toolchain or dependency tree, not this repository.
 *
 * @param file Path as printed, with `./` and `file://` already stripped.
 */
export function isExternalPath(file) {
  if (EXTERNAL_MARKERS.some(marker => file.includes(marker))) return true
  return EXTERNAL_PREFIXES.some(prefix => file.startsWith(prefix))
}

/**
 * Normalize a path mentioned in a log into a repository-relative path.
 *
 * @param raw Path as printed.
 * @returns `{ file, external }` — `file` has `./`, `file://` and a leading slash removed.
 */
export function normalizeFramePath(raw) {
  let file = raw.trim().replace(/^file:\/\//, '').replace(/^\.\//, '')
  const external = isExternalPath(file)
  if (file.startsWith('/') && !external) {
    // An absolute path pointing into a repository is reduced to the tail a
    // worktree can match. An absolute path elsewhere is left absolute, so the
    // output never claims a relative path that does not exist.
    const markers = ['/nodedb/', '/nodedb-sql/', '/nodedb-cluster/', '/nodedb-types/', '/nodedb-vector/']
    const hit = markers.find(marker => file.includes(marker))
    if (hit !== undefined) file = file.slice(file.indexOf(hit) + 1)
  }
  return { file, external }
}

/**
 * Extract the panic or error message that accompanies the frames.
 *
 * @param text Raw log text.
 * @returns The message line, or null when the text carries none.
 */
export function extractMessage(text) {
  // `panicked at <path>:<line>:<col>: <message>` — anchor on the line/column so
  // the lazy prefix cannot stop at the colon inside the path.
  const panic = text.match(/panicked at [^\n]*?:(\d+)(?::(\d+))?:[ \t]*([^\n]*)/)
  if (panic) {
    if (panic[3].trim() !== '') return panic[3].trim()
    const after = text.slice((text.indexOf(panic[0]) + panic[0].length)).split('\n').map(line => line.trim()).filter(Boolean)
    if (after.length > 0) return after[0]
  }
  const header = text.match(/^\s*(?:error|fatal|thread '[^']+' panicked)[^\n]*:\s*([^\n]+)$/m)
  if (header && header[1].trim() !== '') return header[1].trim()
  const err = text.match(/^\s*(?:ERROR|FATAL|Error):\s*([^\n]+)$/m)
  return err ? err[1].trim() : null
}

/**
 * Parse a failure signal into frames.
 *
 * Recognised shapes, in the order they are tried per line:
 * 1. `panicked at path/file.rs:12:5:` — the panic header.
 * 2. `  3: crate::module::function` followed by `at ./path/file.rs:12:5` — a numbered backtrace, keeping the symbol as a hint.
 * 3. `--> path/file.rs:12:5` — a compiler diagnostic.
 * 4. `File "path/file.py", line 12` — a Python traceback.
 * 5. A bare `path/file.ext:12[:5]` mention.
 *
 * @param text Raw log text.
 * @returns `{ message, frames }` with frames deduplicated by file:line, ordered as they appear, capped at {@link MAX_FRAMES}.
 */
export function parseFrames(text) {
  const source = String(text ?? '').replaceAll('\r\n', '\n')
  const frames = []
  const seen = new Set()

  const push = (rawPath, line, column, symbolHint) => {
    const { file, external } = normalizeFramePath(rawPath)
    if (file === '' || !Number.isInteger(line) || line <= 0) return
    const key = `${file}:${line}`
    if (seen.has(key)) return
    seen.add(key)
    frames.push({
      file,
      line,
      column: Number.isInteger(column) && column > 0 ? column : null,
      ...(symbolHint !== undefined && symbolHint !== '' ? { symbolHint } : {}),
      external,
    })
  }

  const lines = source.split('\n')
  let pendingSymbol = null
  for (const rawLine of lines) {
    const line = rawLine.trimEnd()

    const numbered = line.match(/^\s*\d+:\s+(?:0x[0-9a-f]+ - )?([A-Za-z_][\w:<>$]*(?:::[A-Za-z_][\w:<>$]*)+)\s*$/)
    if (numbered) {
      pendingSymbol = numbered[1]
      continue
    }

    const panic = line.match(/panicked at (.+?):(\d+)(?::(\d+))?/)
    if (panic) {
      push(panic[1], Number(panic[2]), panic[3] === undefined ? null : Number(panic[3]), pendingSymbol ?? undefined)
      pendingSymbol = null
      continue
    }

    const at = line.match(/\bat\s+(?:\.\/)?([^\s()]+?):(\d+)(?::(\d+))?\s*$/)
    if (at) {
      push(at[1], Number(at[2]), at[3] === undefined ? null : Number(at[3]), pendingSymbol ?? undefined)
      pendingSymbol = null
      continue
    }

    const arrow = line.match(/-->\s+([^\s:]+):(\d+)(?::(\d+))?/)
    if (arrow) {
      push(arrow[1], Number(arrow[2]), arrow[3] === undefined ? null : Number(arrow[3]), undefined)
      pendingSymbol = null
      continue
    }

    const python = line.match(/File "([^"]+)", line (\d+)/)
    if (python) {
      push(python[1], Number(python[2]), null, undefined)
      pendingSymbol = null
      continue
    }

    const bare = line.match(new RegExp(`(?:^|[\\s("'\`])((?:[\\w.@+-]+/)*[\\w.@+-]+\\.(?:${SOURCE_EXT})):(\\d+)(?::(\\d+))?`, 'g'))
    if (bare) {
      for (const match of bare) {
        const parts = match.match(new RegExp(`((?:[\\w.@+-]+/)*[\\w.@+-]+\\.(?:${SOURCE_EXT})):(\\d+)(?::(\\d+))?`))
        if (parts) push(parts[1], Number(parts[2]), parts[3] === undefined ? null : Number(parts[3]), undefined)
      }
      pendingSymbol = null
    }
  }

  return { message: extractMessage(source), frames: frames.slice(0, MAX_FRAMES) }
}

/**
 * Summarize frames for a ledger note.
 *
 * @param frames Parsed frames.
 * @returns A single line naming the repository frames and how many were external.
 */
export function describeFrames(frames) {
  const internal = frames.filter(frame => !frame.external)
  const external = frames.length - internal.length
  const head = internal.slice(0, 5).map(frame => `${frame.file}:${frame.line}`).join(', ')
  return `${internal.length} repository frame(s)${external > 0 ? `, ${external} external` : ''}${head === '' ? '' : `: ${head}`}`
}

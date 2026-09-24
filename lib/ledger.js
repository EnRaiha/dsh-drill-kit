import { createHash } from 'node:crypto'
import { appendFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

/** Kinds of evidence a drill can record. */
export const KINDS = ['locate', 'blast', 'edge', 'test', 'hygiene', 'review', 'pr', 'note']

/** Ordered drill stages; a task advances only when its gates have evidence. */
export const STAGES = ['localize', 'blast', 'edge', 'patch', 'review', 'pr']

/** Ledger schema version written into every entry. */
export const LEDGER_VERSION = 1

const TASK_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/

/**
 * Validate a task id and reject anything that could escape the state root.
 * @param id Candidate task id.
 * @returns The same id when it is safe to use as a directory name.
 */
export function assertTaskId(id) {
  if (typeof id !== 'string' || !TASK_ID.test(id) || id.includes('..')) {
    throw new Error(`drill: invalid task id ${JSON.stringify(id)} — use [A-Za-z0-9._-], max 64 chars`)
  }
  return id
}

/**
 * Resolve the per-task directory layout under the state root.
 * @param root State root (usually `<workspace>/.drill`).
 * @param task Task id.
 * @returns Absolute-ish paths for the task's ledger, artifacts and report.
 */
export function taskPaths(root, task) {
  const dir = join(root, assertTaskId(task))
  return { dir, ledger: join(dir, 'ledger.jsonl'), artifacts: join(dir, 'artifacts'), report: join(dir, 'report.md') }
}

/**
 * Hash a file's bytes, or return undefined when the file cannot be read.
 *
 * An empty file hashes to the digest of the empty string on purpose: a command
 * that succeeds silently (`cargo fmt --check`) still produced a log, and the
 * proof is that the file exists and is bound to a digest.
 *
 * @param path File to hash.
 * @returns `sha256:<hex>` for an existing file, else undefined.
 */
export function hashFile(path) {
  try {
    if (!existsSync(path) || !statSync(path).isFile()) return undefined
    return `sha256:${createHash('sha256').update(readFileSync(path)).digest('hex')}`
  } catch {
    return undefined
  }
}

/**
 * Validate one evidence entry before it can reach the ledger.
 * @param entry Entry assembled by a tool call.
 * @param options `requireLog` — test entries must point at a non-empty log file.
 * @returns The normalized entry that will be written.
 */
export function normalizeEntry(entry, options = {}) {
  const requireLog = options.requireLog !== false
  if (!entry || typeof entry !== 'object') throw new Error('drill: entry must be an object')
  const { task, kind, stage } = entry
  assertTaskId(task)
  if (!KINDS.includes(kind)) throw new Error(`drill: kind must be one of ${KINDS.join(', ')}`)
  if (!STAGES.includes(stage)) throw new Error(`drill: stage must be one of ${STAGES.join(', ')}`)

  const normalized = { v: LEDGER_VERSION, ts: new Date().toISOString(), task, kind, stage }
  if (entry.arm !== undefined) {
    if (!['base', 'fix'].includes(entry.arm)) throw new Error('drill: arm must be "base" or "fix"')
    normalized.arm = entry.arm
  }
  if (entry.cmd !== undefined) normalized.cmd = String(entry.cmd)
  if (entry.exit !== undefined) {
    if (!Number.isInteger(entry.exit)) throw new Error('drill: exit must be an integer (a process exit code)')
    normalized.exit = entry.exit
  }
  if (entry.verdict !== undefined) {
    if (!['PASS', 'FAIL'].includes(entry.verdict)) throw new Error('drill: verdict must be PASS or FAIL')
    normalized.verdict = entry.verdict
  }
  if (entry.blockers !== undefined) {
    if (!Number.isInteger(entry.blockers) || entry.blockers < 0) throw new Error('drill: blockers must be a non-negative integer')
    normalized.blockers = entry.blockers
  }
  for (const field of ['note', 'text', 'bodyPath', 'base', 'repo', 'worktree', 'issue']) {
    if (entry[field] !== undefined) normalized[field] = String(entry[field])
  }
  for (const field of ['files', 'symbols']) {
    if (entry[field] !== undefined) {
      if (!Array.isArray(entry[field])) throw new Error(`drill: ${field} must be an array of strings`)
      normalized[field] = entry[field].map(String)
    }
  }

  if (entry.log !== undefined) {
    const path = String(entry.log)
    const sha256 = hashFile(path)
    if (requireLog && (kind === 'test' || kind === 'hygiene') && sha256 === undefined) {
      throw new Error(`drill: refused — no readable log at ${path}. Evidence without captured output is a claim, not a proof.`)
    }
    if (sha256 !== undefined) normalized.sha256 = sha256
    normalized.log = path
  } else if (requireLog && kind === 'test') {
    throw new Error('drill: refused — a test record must carry `log` (the captured output of the run)')
  }

  return normalized
}

/**
 * Append one validated entry to a task's ledger.
 * @param paths Result of {@link taskPaths}.
 * @param entry Entry to validate and append.
 * @param options Forwarded to {@link normalizeEntry}.
 * @returns The normalized entry as written.
 */
export function appendEntry(paths, entry, options = {}) {
  const normalized = normalizeEntry(entry, options)
  mkdirSync(paths.dir, { recursive: true })
  appendFileSync(paths.ledger, `${JSON.stringify(normalized)}\n`, 'utf8')
  return normalized
}

/**
 * Read a task's ledger.
 * @param paths Result of {@link taskPaths}.
 * @returns Parsed entries in write order; a missing ledger reads as empty.
 */
export function readLedger(paths) {
  if (!existsSync(paths.ledger)) return []
  const entries = []
  for (const [index, line] of readFileSync(paths.ledger, 'utf8').split('\n').entries()) {
    const trimmed = line.trim()
    if (!trimmed) continue
    try {
      entries.push(JSON.parse(trimmed))
    } catch {
      throw new Error(`drill: ledger line ${index + 1} is not valid JSON — refusing to evaluate a corrupted ledger`)
    }
  }
  return entries
}

/**
 * Write a task's markdown report to disk.
 * @param paths Result of {@link taskPaths}.
 * @param markdown Rendered report body.
 * @returns The report path.
 */
export function writeReport(paths, markdown) {
  mkdirSync(paths.dir, { recursive: true })
  writeFileSync(paths.report, markdown, 'utf8')
  return paths.report
}

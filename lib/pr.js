import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { evaluate, gateTable } from './gates.js'

/**
 * Assemble a pull-request body from a drill ledger, then score it with the
 * existing PR-craft core (`~/scripts/pr_craft.py`) instead of re-implementing
 * review rules here.
 *
 * The body is only as good as the evidence: every verification line comes from a
 * ledger record with an exit code and a hashed log, so a body cannot claim a test
 * that never ran.
 */

/**
 * Where the PR-craft core lives.
 *
 * Resolution order: the `PR_CRAFT_CORE` override, then the copy shipped inside
 * this package (`core/pr_craft.py`, which is what an npm install gets), then the
 * home-directory install the Kilo and Hermes frontends use. Without the middle
 * step a published package would silently lint nothing on a machine that never
 * had the core, and `drill_pr` would record a body nobody scored.
 */
const BUNDLED_PR_CORE = fileURLToPath(new URL('../core/pr_craft.py', import.meta.url))
export const DEFAULT_PR_CORE = process.env.PR_CRAFT_CORE
  ?? (existsSync(BUNDLED_PR_CORE) ? BUNDLED_PR_CORE : `${process.env.HOME ?? ''}/scripts/pr_craft.py`)

/**
 * Render the PR body.
 *
 * @param task Task id.
 * @param entries Ledger entries in write order.
 * @param options `title`, `why`, plus task metadata (issue, repo, base).
 * @returns Markdown body whose first line is the subject.
 */
export function renderPrBody(task, entries, options = {}) {
  const evaluation = evaluate(entries)
  const tests = entries.filter(e => e.kind === 'test')
  const red = tests.filter(t => t.arm === 'base').at(-1)
  const green = tests.filter(t => t.arm === 'fix' && t.exit === 0).at(-1)
  const hygiene = entries.filter(e => e.kind === 'hygiene').at(-1)
  const review = entries.filter(e => e.kind === 'review').at(-1)
  const blasts = entries.filter(e => e.kind === 'blast')
  const changed = [...new Set(blasts.flatMap(b => b.files ?? []))]
  const lines = []

  lines.push(options.title ?? `fix: ${task}`)
  lines.push('')
  lines.push('## Why')
  lines.push('')
  lines.push(options.why ?? (options.issue !== undefined && options.issue !== null ? `Fixes the defect tracked in #${options.issue}.` : 'Fixes the defect described in the linked issue.'))
  lines.push('')

  lines.push('## What changed')
  lines.push('')
  if (changed.length === 0) lines.push('- (no blast-radius evidence recorded)')
  else for (const file of changed.slice(0, 15)) lines.push(`- \`${file}\``)
  lines.push('')

  lines.push('## How it was verified')
  lines.push('')
  lines.push('| step | command | exit | log | commit |')
  lines.push('|---|---|---|---|---|')
  const row = (label, record) => {
    if (record === undefined) return `| ${label} | — | — | — | — |`
    const log = record.log === undefined ? '—' : `\`${logName(record.log)}\``
    return `| ${label} | \`${record.cmd ?? '—'}\` | ${record.exit ?? '—'} | ${log} | ${record.head === undefined ? '—' : record.head.slice(0, 12)} |`
  }
  lines.push(row('red (fails on base)', red))
  lines.push(row('green (passes with fix)', green))
  lines.push(row('preflight', hygiene))
  lines.push('')
  if (red === undefined) lines.push('> No red proof is recorded: the failing-on-base run is missing, so this claim is unverified.')
  if (green === undefined) lines.push('> No green proof is recorded.')
  lines.push('')

  lines.push('## Review')
  lines.push('')
  if (review === undefined) {
    lines.push('Review 2 has not run yet.')
  } else {
    lines.push(`Review 2 verdict: **${review.verdict}**${review.blockers === undefined ? '' : ` (${review.blockers} blockers)`}${review.role === undefined ? '' : ` · role \`${review.role}\``}${review.head === undefined ? '' : ` · commit \`${review.head.slice(0, 12)}\``}`)
    if (review.text !== undefined) lines.push('', review.text)
  }
  lines.push('')

  lines.push('## Gates')
  lines.push('')
  lines.push(gateTable(evaluation))
  lines.push('')

  if (options.issue !== undefined && options.issue !== null && options.issue !== '') {
    lines.push(`Closes #${options.issue}`)
    lines.push('')
  }
  return lines.join('\n')
}

/** Basename of a log path, for a table cell that stays readable. */
function logName(path) {
  const parts = String(path).split('/')
  return parts[parts.length - 1]
}

/**
 * Score a rendered body with the PR-craft core.
 *
 * @param text Rendered body.
 * @param options `core` path to `pr_craft.py`, `pythonBin`, `timeoutMs`.
 * @returns `{ available, ok, score, verdict, blockers, good, error }`.
 */
export function lintPrBody(text, options = {}) {
  const core = options.core ?? DEFAULT_PR_CORE
  const python = options.pythonBin ?? 'python3'
  if (core === '' || !existsSync(core)) {
    return { available: false, ok: null, score: null, verdict: 'pr-craft core not installed', blockers: [], good: [], error: null }
  }
  try {
    const stdout = execFileSync(python, [core, 'lint-desc', '--stdin'], {
      input: JSON.stringify({ text }),
      encoding: 'utf8',
      timeout: options.timeoutMs ?? 20_000,
    })
    const parsed = JSON.parse(stdout)
    const issues = Array.isArray(parsed.issues) ? parsed.issues : []
    return {
      available: true,
      ok: parsed.ok === true,
      score: typeof parsed.score === 'number' ? parsed.score : null,
      verdict: typeof parsed.verdict === 'string' ? parsed.verdict : '',
      blockers: issues.filter(issue => issue?.level === 'blocker').map(issue => `${issue.rule}: ${issue.msg}`),
      good: Array.isArray(parsed.good) ? parsed.good : [],
      error: null,
    }
  } catch (error) {
    return { available: true, ok: null, score: null, verdict: 'lint failed', blockers: [], good: [], error: String(error?.message ?? error).slice(0, 300) }
  }
}

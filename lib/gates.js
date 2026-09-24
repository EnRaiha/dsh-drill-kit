import { STAGES } from './ledger.js'

/**
 * One drill gate: deterministic predicate over the ledger, in stage order.
 * `requiredForDone` marks the gates that must hold before a task may be called finished.
 */
export const GATES = [
  {
    id: 'localize',
    stage: 'localize',
    label: 'Localized to file:line',
    requiredForDone: false,
    check: entries => {
      const hit = entries.filter(e => e.kind === 'locate')
      const anchored = hit.filter(e => (e.files?.length ?? 0) > 0 || Boolean(e.text))
      return { ok: anchored.length > 0, evidence: anchored.at(-1), detail: 'needs one `locate` record naming the file(s) or the exact code site' }
    },
  },
  {
    id: 'blast',
    stage: 'blast',
    label: 'Blast radius mapped',
    requiredForDone: false,
    check: entries => {
      const hit = entries.filter(e => e.kind === 'blast')
      const withSurface = hit.filter(e => (e.files?.length ?? 0) > 0 || (e.symbols?.length ?? 0) > 0 || Boolean(e.text))
      return { ok: withSurface.length > 0, evidence: withSurface.at(-1), detail: 'needs one `blast` record with callers/callees/affected files' }
    },
  },
  {
    id: 'edge',
    stage: 'edge',
    label: 'Edge cases enumerated',
    requiredForDone: false,
    check: entries => {
      const hit = entries.filter(e => e.kind === 'edge' && Boolean(e.text))
      return { ok: hit.length > 0, evidence: hit.at(-1), detail: 'needs one `edge` record stating the invariants/edge cases that must fail' }
    },
  },
  {
    id: 'red',
    stage: 'patch',
    label: 'Red proof — test fails on base',
    requiredForDone: true,
    check: entries => {
      const hit = entries.filter(e => e.kind === 'test' && e.arm === 'base')
      const red = hit.filter(e => Number.isInteger(e.exit) && e.exit !== 0 && e.sha256)
      return { ok: red.length > 0, evidence: red.at(-1), detail: 'needs a `test` record with arm=base, non-zero exit and a hashed log; a test that passes on base is a guard, not a proof' }
    },
  },
  {
    id: 'green',
    stage: 'patch',
    label: 'Green proof — test passes with fix',
    requiredForDone: true,
    check: entries => {
      const hit = entries.filter(e => e.kind === 'test' && e.arm === 'fix')
      const green = hit.filter(e => e.exit === 0 && e.sha256)
      return { ok: green.length > 0, evidence: green.at(-1), detail: 'needs a `test` record with arm=fix, exit 0 and a hashed log' }
    },
  },
  {
    id: 'hygiene',
    stage: 'patch',
    label: 'Repo preflight clean',
    requiredForDone: true,
    check: entries => {
      const hit = entries.filter(e => e.kind === 'hygiene')
      const clean = hit.filter(e => e.exit === 0 && e.sha256)
      return { ok: clean.length > 0, evidence: clean.at(-1), detail: 'needs a `hygiene` record with exit 0 (fmt/clippy/preflight) and a hashed log' }
    },
  },
  {
    id: 'review',
    stage: 'review',
    label: 'Review 2 PASS',
    requiredForDone: true,
    check: entries => {
      const hit = entries.filter(e => e.kind === 'review')
      const pass = hit.filter(e => e.verdict === 'PASS' && (e.blockers ?? 0) === 0)
      const last = hit.at(-1)
      return {
        ok: pass.length > 0 && last === pass.at(-1),
        evidence: last,
        detail: 'needs a `review` record with verdict=PASS and 0 blockers, and no later review record that failed',
      }
    },
  },
  {
    id: 'pr',
    stage: 'pr',
    label: 'PR body recorded',
    requiredForDone: false,
    check: entries => {
      const hit = entries.filter(e => e.kind === 'pr' && Boolean(e.bodyPath))
      return { ok: hit.length > 0, evidence: hit.at(-1), detail: 'needs a `pr` record pointing at the PR body file' }
    },
  },
]

/**
 * Evaluate every gate against a task's ledger.
 * @param entries Entries read from the ledger, in write order.
 * @returns Per-gate verdicts, the missing required gates, the current stage and done-readiness.
 */
export function evaluate(entries) {
  const results = GATES.map(gate => {
    const { ok, evidence, detail } = gate.check(entries)
    return {
      id: gate.id,
      stage: gate.stage,
      label: gate.label,
      requiredForDone: gate.requiredForDone,
      ok,
      detail,
      evidence: evidence
        ? { ts: evidence.ts, cmd: evidence.cmd, exit: evidence.exit, log: evidence.log, sha256: evidence.sha256, verdict: evidence.verdict, blockers: evidence.blockers }
        : null,
    }
  })

  const missingForDone = results.filter(r => r.requiredForDone && !r.ok).map(r => r.id)
  const firstOpen = results.find(r => !r.ok)
  const stage = firstOpen ? firstOpen.stage : 'pr'
  const completedStage = STAGES.indexOf(stage)

  return {
    gates: results,
    stage,
    stageIndex: completedStage,
    ready: missingForDone.length === 0,
    missingForDone,
    next: firstOpen ? `${firstOpen.id}: ${firstOpen.detail}` : 'all gates hold — the task may be declared finished',
  }
}

/**
 * Render the gate table as GitHub-flavoured markdown.
 * @param evaluation Result of {@link evaluate}.
 * @returns Markdown table with one row per gate.
 */
export function gateTable(evaluation) {
  const rows = evaluation.gates.map(g => `| ${g.ok ? '✅' : '⬜'} | ${g.id} | ${g.label} | ${g.evidence?.cmd ?? '—'} |`)
  return ['| | gate | meaning | evidence |', '|---|---|---|---|', ...rows].join('\n')
}

import { evaluate, gateTable } from './gates.js'

/**
 * Render a task's drill report as GitHub-flavoured markdown.
 * @param task Task id.
 * @param entries Ledger entries in write order.
 * @param meta Optional task metadata recorded at `drill_start` (repo, worktree, base, issue).
 * @returns Markdown report body.
 */
export function renderReport(task, entries, meta = {}) {
  const evaluation = evaluate(entries)
  const tests = entries.filter(e => e.kind === 'test')
  const lines = []

  lines.push(`# Drill report — ${task}`)
  lines.push('')
  const facts = [
    meta.repo ? `repo \`${meta.repo}\`` : null,
    meta.worktree ? `worktree \`${meta.worktree}\`` : null,
    meta.base ? `base \`${meta.base}\`` : null,
    meta.issue ? `issue \`${meta.issue}\`` : null,
  ].filter(Boolean)
  if (facts.length) lines.push(facts.join(' · '))
  const heads = [...new Set(entries.map(e => e.head).filter(Boolean))]
  if (heads.length === 1) lines.push(`Evidence bound to commit \`${heads[0]}\`.`)
  else if (heads.length > 1) lines.push(`Evidence spans ${heads.length} commits: ${heads.map(h => `\`${h.slice(0, 12)}\``).join(', ')}.`)
  lines.push(`**Verdict: ${evaluation.ready ? 'READY — every required gate holds' : `INCOMPLETE — ${evaluation.missingForDone.join(', ')}`}**`)
  lines.push('')
  lines.push('## Gates')
  lines.push('')
  lines.push(gateTable(evaluation))
  lines.push('')

  if (tests.length) {
    lines.push('## Test evidence')
    lines.push('')
    lines.push('| when | arm | exit | commit | command | log | sha256 |')
    lines.push('|---|---|---|---|---|---|---|')
    for (const t of tests) {
      lines.push(`| ${t.ts} | ${t.arm ?? '—'} | ${t.exit ?? '—'} | ${t.head ? t.head.slice(0, 12) : '—'} | \`${t.cmd ?? '—'}\` | ${t.log ? `\`${t.log}\`` : '—'} | ${t.sha256 ? `${t.sha256.slice(0, 19)}…` : '—'} |`)
    }
    lines.push('')
  }

  const others = entries.filter(e => !['test'].includes(e.kind))
  if (others.length) {
    lines.push('## Other evidence')
    lines.push('')
    lines.push('| when | stage | kind | detail | log |')
    lines.push('|---|---|---|---|---|')
    for (const e of others) {
      const detail = e.text ?? e.note ?? e.verdict ?? e.bodyPath ?? (e.files ?? []).join(', ') ?? '—'
      lines.push(`| ${e.ts} | ${e.stage} | ${e.kind}${e.arm ? `/${e.arm}` : ''} | ${String(detail).replaceAll('|', '\\|').slice(0, 160)} | ${e.log ? `\`${e.log}\`` : '—'} |`)
    }
    lines.push('')
  }

  lines.push('## Next')
  lines.push('')
  lines.push(evaluation.next)
  lines.push('')
  return lines.join('\n')
}

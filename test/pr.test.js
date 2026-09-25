import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'

import { DEFAULT_PR_CORE, lintPrBody, renderPrBody } from '../lib/pr.js'

const root = mkdtempSync(join(tmpdir(), 'drill-pr-'))
after(() => rmSync(root, { recursive: true, force: true }))

const entries = [
  { v: 1, ts: '2026-09-25T00:00:00Z', task: 'issue314', kind: 'note', stage: 'localize', text: 'drill-start', issue: '314' },
  { v: 1, ts: '2026-09-25T00:01:00Z', task: 'issue314', kind: 'locate', stage: 'localize', files: ['nodedb/src/control/sequence/registry.rs:227'] },
  { v: 1, ts: '2026-09-25T00:02:00Z', task: 'issue314', kind: 'blast', stage: 'blast', files: ['nodedb/src/control/sequence/types.rs'] },
  { v: 1, ts: '2026-09-25T00:03:00Z', task: 'issue314', kind: 'test', stage: 'patch', arm: 'base', exit: 101, cmd: 'nextest run -p nodedb', log: '/tmp/x/red.log', sha256: 'sha256:aa', head: 'a'.repeat(40) },
  { v: 1, ts: '2026-09-25T00:04:00Z', task: 'issue314', kind: 'test', stage: 'patch', arm: 'fix', exit: 0, cmd: 'nextest run -p nodedb', log: '/tmp/x/green.log', sha256: 'sha256:bb', head: 'b'.repeat(40) },
  { v: 1, ts: '2026-09-25T00:05:00Z', task: 'issue314', kind: 'hygiene', stage: 'patch', exit: 0, cmd: 'preflight', log: '/tmp/x/hyg.log', sha256: 'sha256:cc' },
  { v: 1, ts: '2026-09-25T00:06:00Z', task: 'issue314', kind: 'review', stage: 'review', verdict: 'PASS', blockers: 0, role: 'drill-auditor', head: 'b'.repeat(40), text: 'parity audit clean' },
]

test('the body leads with the subject and carries every proof row', () => {
  const body = renderPrBody('issue314', entries, { title: 'fix: guard the empty sequence registry', why: 'A missing sequence panicked the shard.', issue: '314' })
  const lines = body.split('\n')
  assert.equal(lines[0], 'fix: guard the empty sequence registry')
  assert.match(body, /## Why\n\nA missing sequence panicked the shard\./)
  assert.match(body, /nodedb\/src\/control\/sequence\/types\.rs/, 'changed files come from blast evidence')
  assert.match(body, /red \(fails on base\).*nextest run -p nodedb.*101.*red\.log.*a{12}/)
  assert.match(body, /green \(passes with fix\).*0.*green\.log.*b{12}/)
  assert.match(body, /preflight.*0.*hyg\.log/)
  assert.match(body, /Review 2 verdict: \*\*PASS\*\* \(0 blockers\) · role `drill-auditor`/)
  assert.match(body, /Evidence bound to commit|README|✅/)
  assert.match(body, /Closes #314/)
})

test('a body without a red proof says so instead of implying one', () => {
  const greenOnly = entries.filter(e => !(e.kind === 'test' && e.arm === 'base'))
  const body = renderPrBody('issue314', greenOnly, { title: 'fix: x', issue: '314' })
  assert.match(body, /No red proof is recorded/)
  assert.doesNotMatch(body, /No green proof is recorded/, 'the green run is still in the ledger')
  assert.match(body, /\| red \(fails on base\) \| — \| — \| — \| — \|/)
  assert.match(body, /\| green \(passes with fix\) \| `nextest run -p nodedb` \| 0 \|/)
})

test('lintPrBody reports an absent core instead of failing', () => {
  const result = lintPrBody('fix: x\n\nbody', { core: join(root, 'no-such-core.py') })
  assert.equal(result.available, false)
  assert.deepEqual(result.blockers, [])
})

test('lintPrBody surfaces blockers and good notes from a core', () => {
  const core = join(root, 'fake-core.py')
  writeFileSync(core, `import json,sys
payload = json.load(sys.stdin)
print(json.dumps({"ok": False, "score": 50, "subject": "fix: x", "verdict": "fix blockers first",
  "issues": [{"level": "blocker", "rule": "why-missing", "msg": "body does not explain why"},
             {"level": "nit", "rule": "typo", "msg": "minor"}],
  "good": ["subject length ok"]}))
`)
  const result = lintPrBody('fix: x', { core })
  assert.equal(result.available, true)
  assert.equal(result.ok, false)
  assert.equal(result.score, 50)
  assert.deepEqual(result.blockers, ['why-missing: body does not explain why'])
  assert.deepEqual(result.good, ['subject length ok'])
})

test('lintPrBody tolerates a core that crashes', () => {
  const core = join(root, 'crash-core.py')
  writeFileSync(core, 'import sys\nsys.exit(3)\n')
  const result = lintPrBody('fix: x', { core })
  assert.equal(result.available, true)
  assert.equal(result.ok, null)
  assert.match(result.error, /./)
})

test('the real pr-craft core scores a rendered body', { skip: !existsSync(DEFAULT_PR_CORE) }, () => {
  const body = renderPrBody('issue314', entries, { title: 'fix: guard the empty sequence registry', why: 'A missing sequence panicked the shard.', issue: '314' })
  const result = lintPrBody(body, { core: DEFAULT_PR_CORE })
  assert.equal(result.available, true)
  assert.equal(result.error, null)
  assert.equal(typeof result.score, 'number')
  assert.equal(typeof result.verdict, 'string')
  assert.ok(Array.isArray(result.blockers))
})

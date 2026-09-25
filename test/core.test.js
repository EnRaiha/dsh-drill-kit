import assert from 'node:assert/strict'
import { appendFileSync, mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'

import { appendEntry, assertTaskId, normalizeEntry, readLedger, taskPaths } from '../lib/ledger.js'
import { evaluate } from '../lib/gates.js'
import { renderReport } from '../lib/report.js'
import { runCapture } from '../lib/runner.js'

const root = mkdtempSync(join(tmpdir(), 'drill-test-'))
after(() => rmSync(root, { recursive: true, force: true }))

/**
 * Write a captured log where the drill itself would put it: under the task's
 * own logs directory. The ledger refuses a test/hygiene record whose log lives
 * anywhere else, because otherwise any readable file is a "proof".
 */
const logFor = (name, text = 'output\n', task = 'fixtures') => {
  const dir = join(root, task, 'logs')
  mkdirSync(dir, { recursive: true })
  const path = join(dir, name)
  writeFileSync(path, text)
  return path
}

test('task ids reject traversal and unsafe characters', () => {
  assert.equal(assertTaskId('issue296'), 'issue296')
  assert.throws(() => assertTaskId('../etc'), /invalid task id/)
  assert.throws(() => assertTaskId('a/b'), /invalid task id/)
  assert.throws(() => assertTaskId(''), /invalid task id/)
  assert.throws(() => assertTaskId('x'.repeat(65)), /invalid task id/)
})

test('test evidence without a readable log is refused', () => {
  assert.throws(
    () => normalizeEntry({ task: 't1', kind: 'test', stage: 'patch', arm: 'base', exit: 101 }),
    /must carry `log`/,
  )
  assert.throws(
    () => normalizeEntry({ task: 't1', kind: 'test', stage: 'patch', arm: 'base', exit: 101, log: join(root, 'nope.log') }),
    /no readable log/,
  )
  const empty = logFor('empty.log', '')
  const silent = normalizeEntry({ task: 't1', kind: 'test', stage: 'patch', arm: 'base', exit: 101, log: empty })
  assert.match(silent.sha256, /^sha256:[0-9a-f]{64}$/, 'a command that prints nothing still produced a log, and it is hashed')
})

test('normalizeEntry validates kind, stage, arm, exit and lists', () => {
  assert.throws(() => normalizeEntry({ task: 't1', kind: 'nope', stage: 'patch' }), /kind must be one of/)
  assert.throws(() => normalizeEntry({ task: 't1', kind: 'note', stage: 'nowhere' }), /stage must be one of/)
  assert.throws(() => normalizeEntry({ task: 't1', kind: 'test', stage: 'patch', arm: 'side', log: logFor('a.log') }), /arm must be/)
  assert.throws(() => normalizeEntry({ task: 't1', kind: 'note', stage: 'patch', exit: '1' }), /exit must be an integer/)
  assert.throws(() => normalizeEntry({ task: 't1', kind: 'locate', stage: 'localize', files: 'x.rs' }), /files must be an array/)
  const ok = normalizeEntry({ task: 't1', kind: 'locate', stage: 'localize', files: ['a.rs'] })
  assert.equal(ok.v, 1)
  assert.deepEqual(ok.files, ['a.rs'])
  assert.match(ok.ts, /^\d{4}-\d{2}-\d{2}T/)
})

test('ledger round-trips and hashes logs', () => {
  const paths = taskPaths(root, 'roundtrip')
  const log = logFor('round.log', 'red proof\n', 'roundtrip')
  appendEntry(paths, { task: 'roundtrip', kind: 'test', stage: 'patch', arm: 'base', exit: 101, cmd: 'cargo test', log })
  const entries = readLedger(paths)
  assert.equal(entries.length, 1)
  assert.equal(entries[0].exit, 101)
  assert.match(entries[0].sha256, /^sha256:[0-9a-f]{64}$/)
  assert.deepEqual(readLedger(taskPaths(root, 'missing')), [], 'a missing ledger reads as empty')
})

test('a torn final line is skipped, but a complete bad line is refused', () => {
  const paths = taskPaths(root, 'torn')
  appendEntry(paths, { task: 'torn', kind: 'note', stage: 'localize', text: 'first' })
  // A writer that died mid-append leaves no trailing newline.
  appendFileSync(paths.ledger, '{"v":1,"task":"torn","kind":"note"')
  const entries = readLedger(paths)
  assert.equal(entries.length, 1, 'the complete record survives the torn tail')
  assert.equal(entries[0].text, 'first')

  // A complete line that does not parse is corruption, not a torn write.
  appendFileSync(paths.ledger, '\n{not json}\n')
  assert.throws(() => readLedger(paths), /not valid JSON/)
})

test('a corrupted ledger refuses evaluation', () => {
  const paths = taskPaths(root, 'corrupt')
  appendEntry(paths, { task: 'corrupt', kind: 'note', stage: 'localize', text: 'ok' })
  writeFileSync(paths.ledger, '{not json}\n')
  assert.throws(() => readLedger(paths), /not valid JSON/)
})

test('gates require a real red proof, then green, hygiene and review', () => {
  const paths = taskPaths(root, 'gates')
  const red = logFor('gates-red.log', 'FAILED\n', 'gates')
  const green = logFor('gates-green.log', 'ok\n', 'gates')
  const hygiene = logFor('gates-hygiene.log', 'clean\n', 'gates')

  appendEntry(paths, { task: 'gates', kind: 'test', stage: 'patch', arm: 'fix', exit: 0, log: green })
  let evaluation = evaluate(readLedger(paths))
  assert.equal(evaluation.gates.find(g => g.id === 'red').ok, false)
  assert.equal(evaluation.ready, false)
  assert.ok(evaluation.missingForDone.includes('red'))

  appendEntry(paths, { task: 'gates', kind: 'test', stage: 'patch', arm: 'base', exit: 101, log: red })
  appendEntry(paths, { task: 'gates', kind: 'hygiene', stage: 'patch', exit: 0, log: hygiene })
  evaluation = evaluate(readLedger(paths))
  assert.equal(evaluation.gates.find(g => g.id === 'red').ok, true)
  assert.equal(evaluation.gates.find(g => g.id === 'green').ok, true)
  assert.equal(evaluation.ready, false, 'review still missing')

  appendEntry(paths, { task: 'gates', kind: 'review', stage: 'review', verdict: 'PASS', blockers: 0 })
  assert.equal(evaluate(readLedger(paths)).ready, true)

  appendEntry(paths, { task: 'gates', kind: 'review', stage: 'review', verdict: 'FAIL', blockers: 2 })
  const after = evaluate(readLedger(paths))
  assert.equal(after.gates.find(g => g.id === 'review').ok, false, 'a later failing review reopens the gate')
  assert.equal(after.ready, false)
})

test('a passing test on base is not a red proof', () => {
  const paths = taskPaths(root, 'guardnotproof')
  const log = logFor('guard.log', 'all tests passed\n', 'guardnotproof')
  appendEntry(paths, { task: 'guardnotproof', kind: 'test', stage: 'patch', arm: 'base', exit: 0, log })
  assert.equal(evaluate(readLedger(paths)).gates.find(g => g.id === 'red').ok, false)
})

test('report renders verdict, gate table and test evidence', () => {
  const paths = taskPaths(root, 'report')
  const log = logFor('report-red.log', 'boom\n', 'report')
  appendEntry(paths, { task: 'report', kind: 'test', stage: 'patch', arm: 'base', exit: 1, cmd: 'cargo nextest run', log })
  const md = renderReport('report', readLedger(paths), { repo: '/x/nodedb', base: 'origin/main' })
  assert.match(md, /# Drill report — report/)
  assert.match(md, /INCOMPLETE/)
  assert.match(md, /cargo nextest run/)
  assert.match(md, /repo `\/x\/nodedb`/)
})

test('runner captures exit codes, output and timeouts', async () => {
  const ok = await runCapture({ command: 'echo hello && exit 0', logPath: join(root, 'run-ok.log') })
  assert.equal(ok.exit, 0)
  assert.equal(ok.timedOut, false)

  const bad = await runCapture({ command: 'echo boom >&2; exit 7', logPath: join(root, 'run-bad.log') })
  assert.equal(bad.exit, 7)
  const { readFileSync } = await import('node:fs')
  assert.match(readFileSync(bad.logPath, 'utf8'), /boom/)

  const slow = await runCapture({ command: 'sleep 30', logPath: join(root, 'run-slow.log'), timeoutMs: 300 })
  assert.equal(slow.timedOut, true)
  assert.equal(slow.exit, 124)
})

test('the review gate reopens when the reviewed commit is not the green commit', () => {
  const paths = taskPaths(root, 'headbind')
  appendEntry(paths, { task: 'headbind', kind: 'test', stage: 'patch', arm: 'base', exit: 101, log: logFor('headbind-red.log', 'boom\n', 'headbind') })
  const green = logFor('headbind-green.log', 'ok\n', 'headbind')
  appendEntry(paths, { task: 'headbind', kind: 'test', stage: 'patch', arm: 'fix', exit: 0, log: green, head: 'a'.repeat(40) })
  appendEntry(paths, { task: 'headbind', kind: 'hygiene', stage: 'patch', exit: 0, log: logFor('headbind-hyg.log', 'clean\n', 'headbind') })

  appendEntry(paths, { task: 'headbind', kind: 'review', stage: 'review', verdict: 'PASS', blockers: 0, head: 'b'.repeat(40) })
  let evaluation = evaluate(readLedger(paths))
  const review = evaluation.gates.find(g => g.id === 'review')
  assert.equal(review.ok, false, 'a review of another commit cannot close the gate')
  assert.match(review.detail, /re-run the review/)
  assert.equal(evaluation.ready, false)

  appendEntry(paths, { task: 'headbind', kind: 'review', stage: 'review', verdict: 'PASS', blockers: 0, head: 'a'.repeat(40) })
  evaluation = evaluate(readLedger(paths))
  assert.equal(evaluation.gates.find(g => g.id === 'review').ok, true, 'the matching commit closes it')
  assert.equal(evaluation.ready, true)
})

test('reports name the commit evidence is bound to', () => {
  const paths = taskPaths(root, 'headreport')
  appendEntry(paths, { task: 'headreport', kind: 'test', stage: 'patch', arm: 'base', exit: 1, cmd: 'cargo test', log: logFor('headreport-red.log', 'boom\n', 'headreport'), head: 'c'.repeat(40) })
  const md = renderReport('headreport', readLedger(paths), {})
  assert.match(md, /Evidence bound to commit `c{40}`/)
  assert.match(md, /cccccccccccc/)
})

test('the pr gate reopens when the body describes another commit', () => {
  const paths = taskPaths(root, 'prhead')
  appendEntry(paths, { task: 'prhead', kind: 'test', stage: 'patch', arm: 'fix', exit: 0, log: logFor('prhead-green.log', 'ok\n', 'prhead'), head: 'a'.repeat(40) })
  appendEntry(paths, { task: 'prhead', kind: 'pr', stage: 'pr', bodyPath: '/tmp/x/PR_BODY.md', head: 'a'.repeat(40) })
  assert.equal(evaluate(readLedger(paths)).gates.find(g => g.id === 'pr').ok, true)

  // New commits land: the same body now describes a stale commit.
  appendEntry(paths, { task: 'prhead', kind: 'test', stage: 'patch', arm: 'fix', exit: 0, log: logFor('prhead-green2.log', 'ok again\n', 'prhead'), head: 'b'.repeat(40) })
  const reopened = evaluate(readLedger(paths)).gates.find(g => g.id === 'pr')
  assert.equal(reopened.ok, false, 'a body for an older commit cannot describe the new one')
  assert.match(reopened.detail, /re-render it on the commit you are pushing/)
})

test('a review record that names no commit cannot close the review gate', () => {
  // Rule 4: review evidence is bound to a commit. A hand-written `review` record
  // passed through drill_record without a `head` used to slip past the
  // "reviewed the green proof" check, because a missing head read as "not stale".
  const green = { kind: 'test', stage: 'patch', arm: 'fix', exit: 0, sha256: 'sha256:aa', head: 'a'.repeat(40) }
  const unbound = evaluate([green, { kind: 'review', stage: 'review', verdict: 'PASS', blockers: 0 }])
  assert.equal(unbound.gates.find(g => g.id === 'review').ok, false, 'no commit named, no gate closed')
  assert.match(unbound.gates.find(g => g.id === 'review').detail, /names no commit/)

  const wrong = evaluate([green, { kind: 'review', stage: 'review', verdict: 'PASS', blockers: 0, head: 'b'.repeat(40) }])
  assert.equal(wrong.gates.find(g => g.id === 'review').ok, false, 'a review of another commit stays open')

  const bound = evaluate([green, { kind: 'review', stage: 'review', verdict: 'PASS', blockers: 0, head: 'a'.repeat(40) }])
  assert.equal(bound.gates.find(g => g.id === 'review').ok, true, 'the same commit closes it')

  // Without a green proof there is no commit to bind to: behaviour is unchanged.
  const noGreen = evaluate([{ kind: 'review', stage: 'review', verdict: 'PASS', blockers: 0 }])
  assert.equal(noGreen.gates.find(g => g.id === 'review').ok, true)
})

test('the ledger refuses an unarmed test, a logless hygiene run, and a foreign log', () => {
  // An unarmed test record closes neither red nor green, so it is noise that
  // looks like proof.
  assert.throws(
    () => normalizeEntry({ task: 't1', kind: 'test', stage: 'patch', exit: 0, log: logFor('unarmed.log', 'ok\n', 't1') }, { logsDir: join(root, 't1', 'logs') }),
    /must carry `arm`/,
  )
  // `hygiene` needs a log too, not only `test`.
  assert.throws(
    () => normalizeEntry({ task: 't1', kind: 'hygiene', stage: 'patch', exit: 0 }, { logsDir: join(root, 't1', 'logs') }),
    /must carry `log`/,
  )

  // Rule 3: only the executor produces a proof. A readable file elsewhere is
  // not a run's captured output.
  const paths = taskPaths(root, 'provenance')
  const foreign = logFor('elsewhere.log', 'all green\n', 'somewhere-else')
  assert.throws(
    () => appendEntry(paths, { task: 'provenance', kind: 'test', stage: 'patch', arm: 'fix', exit: 0, log: foreign }),
    /must be captured by the drill/,
  )

  // The same record with the log where drill_run writes it is accepted.
  const own = logFor('own.log', 'all green\n', 'provenance')
  const ok = appendEntry(paths, { task: 'provenance', kind: 'test', stage: 'patch', arm: 'fix', exit: 0, log: own })
  assert.match(ok.sha256, /^sha256:[0-9a-f]{64}$/)
})

test('a test killed by a signal is still recordable as a red proof', async () => {
  // The canonical red proof can be a segfault: the child reports code null and
  // a signal name, and the ledger needs an integer exit code.
  const killed = await runCapture({ command: 'kill -SEGV $$', logPath: join(root, 'sigsegv.log') })
  assert.equal(killed.signal, 'SIGSEGV')
  assert.equal(killed.exit, 139, '128 + SIGSEGV(11), the code a shell reports')

  const paths = taskPaths(root, 'signal-red')
  const log = logFor('signal-red.log', 'Segmentation fault\n', 'signal-red')
  const normalized = appendEntry(paths, {
    task: 'signal-red',
    kind: 'test',
    stage: 'patch',
    arm: 'base',
    exit: killed.exit,
    cmd: 'cargo test',
    log,
    note: `killed by ${killed.signal}`,
  })
  assert.equal(normalized.exit, 139)
  assert.equal(evaluate(readLedger(paths)).gates.find(g => g.id === 'red').ok, true, 'a signal-killed run is a valid red proof')
})

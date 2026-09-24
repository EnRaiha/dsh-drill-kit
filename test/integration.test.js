/**
 * Integration test: load the real plugin against the real DSH tool runtime and
 * drive every tool through its execute() path.
 *
 * It needs the host packages reachable from this checkout. When they are not
 * (a consumer running the suite standalone), the test skips instead of failing,
 * because the tool schemas are only meaningful against the real DSL compiler.
 */

import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'

const skip = (() => {
  try {
    // eslint-disable-next-line no-undef
    return import.meta.resolve('@deepseek-ai/dsh-tools') === undefined
  } catch {
    return true
  }
})()

const workspace = mkdtempSync(join(tmpdir(), 'drill-int-'))
after(() => rmSync(workspace, { recursive: true, force: true }))

/** Minimal Cordis-like context that records tool registrations. */
function fakeContext() {
  const tools = new Map()
  const listeners = new Map()
  return {
    tools: {
      register(definition) {
        tools.set(definition.name, definition)
        return () => tools.delete(definition.name)
      },
    },
    on(event, handler) {
      listeners.set(event, handler)
      return () => listeners.delete(event)
    },
    get() {
      return undefined
    },
    logger: { info() {} },
    tools_registered: tools,
    listeners,
  }
}

const session = { id: 's1', header: { cwd: workspace } }
const exec = { signal: new AbortController().signal, agent: { session } }

test('the module implements the host contract and compiles every tool schema', { skip }, async () => {
  const mod = await import('../index.js')
  assert.equal(mod.name, 'dsh-drill')
  assert.deepEqual(mod.inject, ['tools'])
  assert.equal(typeof mod.apply, 'function')

  const ctx = fakeContext()
  mod.apply(ctx, mod.Config({}))

  const expected = ['drill_start', 'drill_locate', 'drill_blast', 'drill_record', 'drill_run', 'drill_gate', 'drill_status', 'drill_report', 'drill_review', 'drill_setup']
  assert.deepEqual([...ctx.tools_registered.keys()].sort(), expected.sort())
  for (const [name, definition] of ctx.tools_registered) {
    assert.equal(typeof definition.output.render, 'function', `${name} must render`)
    assert.equal(typeof definition.execute, 'function', `${name} must execute`)
  }
  assert.ok(ctx.listeners.has('agent/turn-stopping'), 'the reminder hook registers')
})

test('a full red→green→review drill drives the gates to READY', { skip }, async () => {
  const mod = await import('../index.js')
  const ctx = fakeContext()
  const config = mod.Config({ reminder: false })
  mod.apply(ctx, config)
  const call = (name, args) => ctx.tools_registered.get(name).execute(args, exec)

  const start = await call('drill_start', { task: 'issue999', repo: workspace, base: 'origin/main', issue: '999' })
  assert.equal(start.task, 'issue999')

  await call('drill_record', { kind: 'locate', stage: 'localize', files: ['src/a.rs:10'], text: 'target_fn' })
  await call('drill_record', { kind: 'blast', stage: 'blast', symbols: ['target_fn'], files: ['src/b.rs'] })
  await call('drill_record', { kind: 'edge', stage: 'edge', text: 'empty input; duplicate keys' })

  // Red proof: a test that fails on base. The plugin runs it, so the exit code is real.
  const red = await call('drill_run', { stage: 'patch', arm: 'base', cmd: 'echo "assertion failed" >&2; exit 101', label: 'red' })
  assert.equal(red.exit, 101)
  assert.match(readFileSync(red.log, 'utf8'), /assertion failed/)

  let gate = await call('drill_gate', {})
  assert.equal(gate.ready, false)
  assert.ok(gate.missing.includes('green'), 'green is still open after the red proof')

  const green = await call('drill_run', { stage: 'patch', arm: 'fix', cmd: 'echo ok; exit 0', label: 'green' })
  assert.equal(green.exit, 0)

  const hygiene = await call('drill_run', { stage: 'patch', kind: 'hygiene', cmd: 'exit 0', label: 'preflight' })
  assert.equal(hygiene.exit, 0)

  gate = await call('drill_gate', {})
  assert.deepEqual(gate.missing, ['review'], 'only the review gate is left')

  const review = await call('drill_record', { kind: 'review', stage: 'review', verdict: 'PASS', blockers: 0, text: 'parity audit clean' })
  assert.ok(review.gates.includes('pass:review'))

  const final = await call('drill_gate', {})
  assert.equal(final.ready, true, 'every required gate holds')

  const report = await call('drill_report', {})
  assert.match(report.verdict, /READY/)
  assert.match(readFileSync(report.path, 'utf8'), /Red proof/)
  assert.match(readFileSync(report.path, 'utf8'), /exit 101/)
})

test('a claim without a run is refused', { skip }, async () => {
  const mod = await import('../index.js')
  const ctx = fakeContext()
  mod.apply(ctx, mod.Config({ reminder: false }))
  const call = (name, args) => ctx.tools_registered.get(name).execute(args, exec)

  await call('drill_start', { task: 'issue-refuse', repo: workspace })
  await assert.rejects(
    () => call('drill_record', { kind: 'test', stage: 'patch', arm: 'base', exit: 1 }),
    /must carry `log`/,
  )
  const fake = join(workspace, 'missing.log')
  await assert.rejects(
    () => call('drill_record', { kind: 'test', stage: 'patch', arm: 'base', exit: 1, log: fake }),
    /no readable log/,
  )
})

test('drill_setup installs the skill and the auditor role', { skip }, async () => {
  const mod = await import('../index.js')
  const ctx = fakeContext()
  mod.apply(ctx, mod.Config({ reminder: false }))
  const home = join(workspace, 'fakedsh')
  const result = await ctx.tools_registered.get('drill_setup').execute({ dshHome: home }, exec)
  assert.match(readFileSync(result.skill, 'utf8'), /name: drill/)
  assert.match(readFileSync(result.role, 'utf8'), /name: drill-auditor/)
})

test('the turn-stopping reminder names the open gates', { skip }, async () => {
  const mod = await import('../index.js')
  const ctx = fakeContext()
  mod.apply(ctx, mod.Config({}))
  const call = (name, args) => ctx.tools_registered.get(name).execute(args, exec)
  await call('drill_start', { task: 'issue-remind', repo: workspace })

  let injected = null
  const agent = { session, inject(message) { injected = message } }
  await ctx.listeners.get('agent/turn-stopping')({ agent })
  const text = injected.content[0].text
  assert.match(text, /issue-remind/)
  assert.match(text, /red,green,hygiene,review/)

  injected = null
  await ctx.listeners.get('agent/turn-stopping')({ agent })
  assert.equal(injected, null, 'the same signature is not repeated')
})

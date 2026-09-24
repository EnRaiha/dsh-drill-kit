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

/** Minimal Cordis-like context that records tool registrations and serves fake services. */
function fakeContext(services = {}) {
  const tools = new Map()
  const listeners = new Map()
  return {
    tools: {
      register(definition) {
        tools.set(definition.name, definition)
        return () => tools.delete(definition.name)
      },
      schemas() {
        return ['read', 'grep', 'glob', 'bash', 'write', 'edit'].map(name => ({ name }))
      },
    },
    on(event, handler) {
      listeners.set(event, handler)
      return () => listeners.delete(event)
    },
    get(key) {
      return services[key]
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
  mod.apply(ctx, mod.Config({ cacheDir: join(workspace, 'cache') }))

  const expected = ['drill_start', 'drill_locate', 'drill_blast', 'drill_diff', 'drill_search', 'drill_index', 'drill_cache', 'drill_record', 'drill_run', 'drill_gate', 'drill_status', 'drill_report', 'drill_review', 'drill_setup']
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
  mod.apply(ctx, mod.Config({ reminder: false, cacheDir: join(workspace, 'cache') }))
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
  mod.apply(ctx, mod.Config({ reminder: false, cacheDir: join(workspace, 'cache') }))
  const home = join(workspace, 'fakedsh')
  const result = await ctx.tools_registered.get('drill_setup').execute({ dshHome: home }, exec)
  assert.match(readFileSync(result.skill, 'utf8'), /name: drill/)
  assert.match(readFileSync(result.role, 'utf8'), /name: drill-auditor/)
})

test('the turn-stopping reminder names the open gates', { skip }, async () => {
  const mod = await import('../index.js')
  const ctx = fakeContext()
  mod.apply(ctx, mod.Config({ cacheDir: join(workspace, 'cache') }))
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

test('drill_diff turns a branch diff into blast evidence with a proposed checklist', { skip }, async () => {
  const { execFileSync } = await import('node:child_process')
  const { mkdirSync, writeFileSync } = await import('node:fs')
  const repo = join(workspace, 'gitrepo')
  mkdirSync(repo, { recursive: true })
  const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' }).trim()
  git('init', '-q', '-b', 'main')
  git('config', 'user.email', 'drill@test')
  git('config', 'user.name', 'drill test')
  writeFileSync(join(repo, 'a.rs'), 'fn a() {}\n')
  git('add', '.')
  git('commit', '-q', '-m', 'base')
  const base = git('rev-parse', 'HEAD')
  writeFileSync(join(repo, 'a.rs'), 'fn a() { let x = 1; }\n')
  writeFileSync(join(repo, 'b.rs'), 'fn b() {}\n')
  git('add', '.')
  git('commit', '-q', '-m', 'fix')

  const mod = await import('../index.js')
  const ctx = fakeContext()
  mod.apply(ctx, mod.Config({ reminder: false, cacheDir: join(workspace, 'cache') }))
  const call = (name, args) => ctx.tools_registered.get(name).execute(args, { signal: new AbortController().signal, agent: { session: { id: 's-git', header: { cwd: repo } } } })

  await call('drill_start', { task: 'git-drill', repo, base, issue: '1' })
  const diff = await call('drill_diff', {})
  assert.equal(diff.base, base)
  assert.deepEqual(diff.changed.sort(), ['a.rs', 'b.rs'])
  assert.equal(diff.recorded, true)
  assert.ok(diff.checklist.length >= 4, 'a checklist line per changed file per concern')

  const ledger = readFileSync(join(repo, '.drill', 'git-drill', 'ledger.jsonl'), 'utf8').trim().split('\n').map(JSON.parse)
  const blast = ledger.find(e => e.kind === 'blast')
  assert.ok(blast, 'the diff is recorded as blast evidence')
  assert.deepEqual(blast.files.sort(), ['a.rs', 'b.rs'])
  assert.match(blast.cmd, /--diff-filter=ACMR/)
})

test('drill_review drives the role file and binds the verdict to HEAD', { skip }, async () => {
  const { execFileSync } = await import('node:child_process')
  const { mkdirSync } = await import('node:fs')
  const repo = join(workspace, 'reviewrepo')
  mkdirSync(repo, { recursive: true })
  const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' }).trim()
  git('init', '-q', '-b', 'main')
  git('config', 'user.email', 'drill@test')
  git('config', 'user.name', 'drill test')
  writeFileSync(join(repo, 'a.rs'), 'fn a() {}\n')
  git('add', '.')
  git('commit', '-q', '-m', 'base')
  const head = git('rev-parse', 'HEAD')

  let captured = null
  const subagents = {
    async start(provider, request) {
      captured = { provider, request }
      return {
        id: 'child-1',
        result: Promise.resolve({ stopReason: 'completed', structured: { verdict: 'PASS', blockers: [], unverified: [], summary: 'parity audit clean' } }),
        async dispose() {},
      }
    },
  }

  const mod = await import('../index.js')
  const ctx = fakeContext({ subagents })
  mod.apply(ctx, mod.Config({ reminder: false, cacheDir: join(workspace, 'cache') }))
  const exec = { signal: new AbortController().signal, agent: { session: { id: 's-rev', header: { cwd: repo } } } }
  const call = (name, args) => ctx.tools_registered.get(name).execute(args, exec)

  await call('drill_start', { task: 'review-drill', repo, base: 'HEAD', issue: '2' })
  const review = await call('drill_review', {})

  assert.equal(review.verdict, 'PASS')
  assert.equal(review.role, 'drill-auditor')
  assert.equal(review.roleSource, 'bundled')
  assert.equal(review.head, head)
  assert.equal(captured.provider, 'spawn')
  assert.match(captured.request.persona, /Read-only/, 'persona comes from the bundled role body')
  assert.match(captured.request.persona, /drill-auditor|Review 2/)
  assert.deepEqual(captured.request.toolFilter.allow, ['read', 'grep', 'glob', 'bash'], 'role tools minus nothing: all are visible')
  assert.match(captured.request.prompt[0].text, new RegExp(head))
  assert.equal(captured.request.outputSchema.properties.verdict.enum.join(','), 'PASS,FAIL')

  const ledger = readFileSync(join(repo, '.drill', 'review-drill', 'ledger.jsonl'), 'utf8').trim().split('\n').map(JSON.parse)
  const recorded = ledger.find(e => e.kind === 'review')
  assert.equal(recorded.head, head)
  assert.equal(recorded.role, 'drill-auditor')
  assert.match(readFileSync(recorded.log, 'utf8'), /role: drill-auditor \(bundled\)/)
})

test('drill_review refuses to invent a verdict when the subagent service is absent', { skip }, async () => {
  const mod = await import('../index.js')
  const ctx = fakeContext()
  mod.apply(ctx, mod.Config({ reminder: false, cacheDir: join(workspace, 'cache') }))
  await assert.rejects(
    () => ctx.tools_registered.get('drill_review').execute({ task: 'x' }, exec),
    /subagents service is not mounted/,
  )
})

test('stage 1–2 fall back to a labelled text search when no code graph covers the repo', { skip }, async () => {
  const { execFileSync } = await import('node:child_process')
  const { mkdirSync } = await import('node:fs')
  const repo = join(workspace, 'nosearch-graph')
  mkdirSync(join(repo, 'src'), { recursive: true })
  const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' }).trim()
  git('init', '-q', '-b', 'main')
  git('config', 'user.email', 'drill@test')
  git('config', 'user.name', 'drill test')
  writeFileSync(join(repo, 'src', 'a.rs'), 'pub fn target_fn(x: u32) -> u32 {\n    x + 1\n}\n')
  writeFileSync(join(repo, 'src', 'b.rs'), 'use crate::a::target_fn;\n\nfn caller() { let _ = target_fn(1); }\n')
  git('add', '.')
  git('commit', '-q', '-m', 'base')

  const mod = await import('../index.js')
  const ctx = fakeContext()
  mod.apply(ctx, mod.Config({ reminder: false, cacheDir: join(workspace, 'cache') }))
  const exec = { signal: new AbortController().signal, agent: { session: { id: 's-fb', header: { cwd: repo } } } }
  const call = (name, args) => ctx.tools_registered.get(name).execute(args, exec)

  await call('drill_start', { task: 'fallback', repo, base: 'HEAD' })

  const located = await call('drill_locate', { symbol: 'target_fn' })
  assert.equal(located.found, true, 'the text fallback must still answer')
  assert.match(located.source, /text-level/)
  assert.match(located.results[0], /target_fn/)
  assert.match(located.results[0], /src\/a\.rs:1/)

  let ledger = readFileSync(join(repo, '.drill', 'fallback', 'ledger.jsonl'), 'utf8').trim().split('\n').map(JSON.parse)
  const locate = ledger.find(e => e.kind === 'locate')
  assert.match(locate.note, /text-level/)
  assert.equal(locate.files.length > 0, true)

  const blast = await call('drill_blast', { symbol: 'target_fn' })
  assert.ok(blast.callers.length >= 3, 'definition, import and call site show up as occurrences')
  assert.ok(blast.fileCount >= 2)
  assert.equal(blast.impact.length, 0, 'no resolved transitive callers without a graph')

  ledger = readFileSync(join(repo, '.drill', 'fallback', 'ledger.jsonl'), 'utf8').trim().split('\n').map(JSON.parse)
  const blastRecord = ledger.filter(e => e.kind === 'blast').at(-1)
  assert.match(blastRecord.note, /text-level: occurrences, not resolved call sites/)

  const searched = await call('drill_search', { pattern: 'caller', kind: 'edge', fixed: true })
  assert.equal(searched.engine, 'rg')
  assert.equal(searched.recorded, 'edge@edge')
  assert.ok(searched.hits.length >= 1)
})

test('drill_index builds an out-of-tree index that drill_search then uses', { skip }, async () => {
  const { resolveBin } = await import('../lib/search.js')
  if (resolveBin('tgrep') === null) return // tgrep is optional; the rg path is covered elsewhere
  const { execFileSync } = await import('node:child_process')
  const { mkdirSync, existsSync } = await import('node:fs')
  const repo = join(workspace, 'indexrepo')
  const indexBase = join(workspace, 'tgrep-cache')
  mkdirSync(join(repo, 'src'), { recursive: true })
  const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' }).trim()
  git('init', '-q', '-b', 'main')
  git('config', 'user.email', 'drill@test')
  git('config', 'user.name', 'drill test')
  writeFileSync(join(repo, 'src', 'a.rs'), 'pub fn indexed_fn() -> u32 { 7 }\n')
  git('add', '.')
  git('commit', '-q', '-m', 'base')

  const mod = await import('../index.js')
  const ctx = fakeContext()
  mod.apply(ctx, mod.Config({ reminder: false, cacheDir: indexBase, searchEngine: 'auto' }))
  const exec = { signal: new AbortController().signal, agent: { session: { id: 's-idx', header: { cwd: repo } } } }
  const call = (name, args) => ctx.tools_registered.get(name).execute(args, exec)

  await call('drill_start', { task: 'index-drill', repo, base: 'HEAD' })
  const built = await call('drill_index', {})
  assert.equal(built.ok, true, built.error ?? '')
  assert.ok(built.dir.startsWith(indexBase), 'the index is written to the configured cache, not the repo')
  assert.equal(existsSync(join(repo, '.tgrep')), false, 'the worktree gains no untracked files')
  assert.ok(built.files >= 1)
  assert.equal(built.engine, 'tgrep', 'search now runs on the trigram index')
  // Coverage depends on the host's c2g caches (a cache indexed at a parent
  // directory legitimately covers its subdirectories), so only its type is fixed.
  assert.equal(typeof built.c2gCovered, 'boolean')

  const searched = await call('drill_search', { pattern: 'indexed_fn', fixed: true })
  assert.equal(searched.engine, 'tgrep')
  assert.ok(searched.hits.length >= 1)

  const found = await call('drill_locate', { symbol: 'indexed_fn' })
  assert.equal(found.found, true)
  assert.match(found.source, /tgrep/)
  assert.match(found.source, /text-level/)
})

/**
 * Integration test: load the real plugin against the real DSH tool runtime and
 * drive every tool through its execute() path.
 *
 * It needs the host packages reachable from this checkout. When they are not
 * (a consumer running the suite standalone), the test skips instead of failing,
 * because the tool schemas are only meaningful against the real DSL compiler.
 */

import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
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

  const expected = ['drill_start', 'drill_locate', 'drill_blast', 'drill_diff', 'drill_search', 'drill_index', 'drill_cache', 'drill_error', 'drill_pr', 'drill_record', 'drill_run', 'drill_gate', 'drill_status', 'drill_report', 'drill_review', 'drill_setup']
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

test('the merged c2g store answers before any text search', { skip }, async () => {
  const { execFileSync } = await import('node:child_process')
  const { mkdirSync } = await import('node:fs')
  const worktree = join(workspace, 'merged-worktree')
  const store = join(workspace, 'Embed', 'c2g', 'graph_index.sqlite')
  mkdirSync(join(workspace, 'Embed', 'c2g'), { recursive: true })
  mkdirSync(join(worktree, 'nodedb', 'src', 'control'), { recursive: true })
  writeFileSync(join(worktree, 'nodedb', 'src', 'control', 'a.rs'), 'pub fn target_fn() {}\n')
  writeFileSync(join(worktree, 'nodedb', 'src', 'control', 'c.rs'), 'fn caller_fn() { target_fn(); }\n')
  writeFileSync(join(workspace, 'Embed', 'c2g', 'manifest.json'), JSON.stringify({ built_at: '2026-09-24T05:24:54+0800', count: 2 }))
  execFileSync('sqlite3', [store], { input: `
    CREATE TABLE nodes(id TEXT PRIMARY KEY, name TEXT, kind TEXT, file TEXT, repo TEXT, line INTEGER);
    CREATE TABLE links(source TEXT, target TEXT, relation TEXT);
    INSERT INTO nodes VALUES ('n1','target_fn','Function','nd_src/control/a.rs','nd_src',1),('n2','caller_fn','Function','nd_src/control/c.rs','nd_src',12);
    INSERT INTO links VALUES ('n2','n1','CALL');
  ` })

  const mod = await import('../index.js')
  const ctx = fakeContext()
  mod.apply(ctx, mod.Config({ reminder: false, cacheDir: join(workspace, 'cache'), embedStore: store }))
  const exec = { signal: new AbortController().signal, agent: { session: { id: 's-embed', header: { cwd: workspace } } } }
  const call = (name, args) => ctx.tools_registered.get(name).execute(args, exec)

  await call('drill_start', { task: 'embed-drill', repo: worktree, base: 'HEAD' })
  const located = await call('drill_locate', { symbol: 'target_fn' })
  assert.equal(located.found, true)
  assert.match(located.source, /c2g-embed/)
  assert.match(located.source, /built 2026-09-24/)
  assert.match(located.results[0], /nodedb\/src\/control\/a\.rs:1/, 'the shard path is mapped into the worktree')

  const ledger = readFileSync(join(workspace, '.drill', 'embed-drill', 'ledger.jsonl'), 'utf8').trim().split('\n').map(JSON.parse)
  const locate = ledger.find(e => e.kind === 'locate')
  assert.match(locate.note, /merged c2g store/)
  assert.deepEqual(locate.files, ['nodedb/src/control/a.rs:1'])

  const blast = await call('drill_blast', { symbol: 'target_fn' })
  assert.equal(blast.callers.length, 1, 'the resolved call link is reported')
  assert.match(blast.callers[0], /caller_fn nodedb\/src\/control\/c\.rs:12/)
  const blastRecord = readFileSync(join(workspace, '.drill', 'embed-drill', 'ledger.jsonl'), 'utf8').trim().split('\n').map(JSON.parse).filter(e => e.kind === 'blast').at(-1)
  assert.match(blastRecord.note, /resolved links, snapshot not per-worktree HEAD/)
})

test('drill_error resolves a panic through the c2g cache and records it as locate evidence', { skip }, async () => {
  const { execFileSync } = await import('node:child_process')
  const { mkdirSync } = await import('node:fs')
  const repo = join(workspace, 'panic-repo')
  const c2gDir = join(workspace, 'c2g-projects', 'proj')
  mkdirSync(repo, { recursive: true })
  mkdirSync(c2gDir, { recursive: true })
  const db = join(c2gDir, 'cache.sqlite3')
  execFileSync('sqlite3', [db], { input: `
    CREATE TABLE meta (singleton INTEGER PRIMARY KEY, application_identity TEXT NOT NULL, canonical_root BLOB NOT NULL, project_key BLOB NOT NULL);
    CREATE TABLE graph_snapshots (snapshot_id INTEGER PRIMARY KEY, resolver_tier TEXT NOT NULL, created_at_ns INTEGER NOT NULL);
    CREATE TABLE active_snapshots (resolver_tier TEXT NOT NULL, completeness INTEGER NOT NULL, snapshot_id INTEGER NOT NULL, PRIMARY KEY (resolver_tier, completeness));
    CREATE TABLE graph_symbols (snapshot_id INTEGER NOT NULL, ordinal INTEGER NOT NULL, id BLOB NOT NULL, scip TEXT NOT NULL, name TEXT NOT NULL, file TEXT NOT NULL, span_start INTEGER NOT NULL, span_end INTEGER NOT NULL, kind TEXT NOT NULL, symbol BLOB NOT NULL, PRIMARY KEY (snapshot_id, ordinal));
    CREATE TABLE graph_edges (snapshot_id INTEGER NOT NULL, from_ord INTEGER NOT NULL, to_ord INTEGER NOT NULL, role TEXT NOT NULL, occurrence_file TEXT NOT NULL, occurrence_line INTEGER NOT NULL, confidence REAL NOT NULL);
    INSERT INTO meta VALUES (1, 'code2graph-cache', '${repo}', x'00');
    INSERT INTO graph_snapshots VALUES (1, 'scope', 0);
    INSERT INTO active_snapshots VALUES ('scope', 1, 1);
    INSERT INTO graph_symbols VALUES
      (1, 1, x'01', 'a', 'nextval_batch', 'nodedb/src/control/sequence/registry.rs', 200, 260, '"Function"', '{"line":227}');
    PRAGMA user_version = 3;
  ` })
  const panic = `thread 'main' panicked at nodedb/src/control/sequence/registry.rs:227:5:
called \`Option::unwrap()\` on a \`None\` value
   0: nodedb::control::sequence::registry::nextval_batch
             at ./nodedb/src/control/sequence/registry.rs:231:5
   1: rust_begin_unwind
             at /rustc/abc/library/std/src/panicking.rs:597:5`

  const mod = await import('../index.js')
  const ctx = fakeContext()
  mod.apply(ctx, mod.Config({ reminder: false, cacheDir: join(workspace, 'cache'), c2gCacheDir: join(workspace, 'c2g-projects'), embedEnabled: false, prLint: false }))
  const exec = { signal: new AbortController().signal, agent: { session: { id: 's-panic', header: { cwd: repo } } } }
  const call = (name, args) => ctx.tools_registered.get(name).execute(args, exec)

  await call('drill_start', { task: 'panic-drill', repo, base: 'HEAD', issue: '314' })
  const result = await call('drill_error', { error: panic })
  assert.equal(result.message, 'called `Option::unwrap()` on a `None` value')
  assert.equal(result.external, 1, 'the rustc frame is marked external')
  assert.equal(result.resolved, 2, 'the panic header and the backtrace frame both resolve to the containing symbol')
  assert.match(result.sources, /c2g/)
  assert.match(result.frames.join('\n'), /registry\.rs:227:5 → nextval_batch \[Function\] \(c2g\)/, 'the panic header resolves through the c2g cache')
  assert.match(result.frames.join('\n'), /registry\.rs:231:5 → nextval_batch \[Function\] \(c2g\)/, 'the backtrace frame resolves to the containing symbol')
  assert.match(result.frames.join('\n'), /rustc\/abc.*\(external\)/)

  const ledger = readFileSync(join(repo, '.drill', 'panic-drill', 'ledger.jsonl'), 'utf8').trim().split('\n').map(JSON.parse)
  const locate = ledger.filter(e => e.kind === 'locate').at(-1)
  assert.deepEqual(locate.files, ['nodedb/src/control/sequence/registry.rs:227', 'nodedb/src/control/sequence/registry.rs:231'])
  assert.match(locate.note, /repository frame\(s\)/)
  const { evaluate } = await import('../lib/gates.js')
  assert.ok(evaluate(ledger).gates.some(g => g.id === 'localize' && g.ok), 'the frames close the localize gate')

  // The c2g-backed locate records which cache schema answered: layer 1 is the
  // upstream CLI's format, so a version bump must be visible in the evidence.
  const located = await call('drill_locate', { symbol: 'nextval_batch' })
  assert.match(located.source, /c2g/)
  const c2gLocate = readFileSync(join(repo, '.drill', 'panic-drill', 'ledger.jsonl'), 'utf8').trim().split('\n').map(JSON.parse).filter(e => e.kind === 'locate').at(-1)
  assert.match(c2gLocate.note, /c2g cache schema v3/, 'the note names the cache schema version')
})

test('drill_pr writes the body, lints it, and only records a clean one', { skip }, async () => {
  const { mkdirSync } = await import('node:fs')
  const repo = join(workspace, 'pr-repo')
  mkdirSync(repo, { recursive: true })
  const core = join(workspace, 'pr-core.py')
  const mod = await import('../index.js')
  const ctx = fakeContext()
  mod.apply(ctx, mod.Config({ reminder: false, cacheDir: join(workspace, 'cache'), embedEnabled: false, prCore: core, prLint: true }))
  const exec = { signal: new AbortController().signal, agent: { session: { id: 's-pr', header: { cwd: repo } } } }
  const call = (name, args) => ctx.tools_registered.get(name).execute(args, exec)

  await call('drill_start', { task: 'pr-drill', repo, base: 'HEAD', issue: '314' })
  await call('drill_run', { stage: 'patch', arm: 'base', cmd: 'exit 101', label: 'red' })
  await call('drill_run', { stage: 'patch', arm: 'fix', cmd: 'exit 0', label: 'green' })
  await call('drill_record', { kind: 'review', stage: 'review', verdict: 'PASS', blockers: 0 })

  // A core that blocks: the body is written but must not close the pr gate.
  writeFileSync(core, 'import json,sys\njson.load(sys.stdin)\nprint(json.dumps({"ok": False, "score": 40, "verdict": "fix blockers first", "issues": [{"level": "blocker", "rule": "why-missing", "msg": "say why"}], "good": []}))\n')
  const blocked = await call('drill_pr', { title: 'fix: guard the empty registry' })
  assert.equal(blocked.recorded, false)
  assert.deepEqual(blocked.blockers, ['why-missing: say why'])
  assert.equal(existsSync(blocked.bodyPath), true, 'the body file is still written for the author to fix')
  assert.match(readFileSync(blocked.bodyPath, 'utf8'), /## How it was verified/)
  assert.ok(!blocked.gates.includes('pass:pr'), 'the pr gate stays open while the lint blocks')

  writeFileSync(core, 'import json,sys\njson.load(sys.stdin)\nprint(json.dumps({"ok": True, "score": 95, "verdict": "ok", "issues": [], "good": ["subject length ok"]}))\n')
  const clean = await call('drill_pr', { title: 'fix: guard the empty sequence registry', why: 'The registry panicked on an empty sequence.' })
  assert.equal(clean.recorded, true)
  assert.equal(clean.lintOk, true)
  assert.ok(clean.gates.includes('pass:pr'))
  assert.equal(clean.gates.includes('pass:review'), true)

  const ledger = readFileSync(join(repo, '.drill', 'pr-drill', 'ledger.jsonl'), 'utf8').trim().split('\n').map(JSON.parse)
  const pr = ledger.filter(e => e.kind === 'pr').at(-1)
  assert.equal(pr.bodyPath, clean.bodyPath)
  assert.match(pr.note, /lint score 95/)
})

test('a lookup that finds nothing does not close the gate it belongs to', { skip }, async () => {
  const { mkdirSync } = await import('node:fs')
  const { evaluate } = await import('../lib/gates.js')
  const repo = join(workspace, 'miss-repo')
  mkdirSync(repo, { recursive: true })
  const mod = await import('../index.js')
  const ctx = fakeContext()
  mod.apply(ctx, mod.Config({ reminder: false, cacheDir: join(workspace, 'cache'), embedEnabled: false, searchEngine: 'rg' }))
  const exec = { signal: new AbortController().signal, agent: { session: { id: 's-miss', header: { cwd: repo } } } }
  const call = (name, args) => ctx.tools_registered.get(name).execute(args, exec)

  await call('drill_start', { task: 'miss-drill', repo, base: 'HEAD' })
  const located = await call('drill_locate', { symbol: 'no_such_symbol_anywhere' })
  assert.equal(located.found, false)

  const ledger = readFileSync(join(repo, '.drill', 'miss-drill', 'ledger.jsonl'), 'utf8').trim().split('\n').map(JSON.parse)
  const locate = ledger.filter(e => e.kind === 'locate').at(-1)
  assert.ok(locate, 'the attempt is recorded for the audit trail')
  assert.equal(locate.text, undefined, 'a miss carries no evidence text')
  assert.match(locate.note, /localize gate stays open/)
  assert.equal(evaluate(ledger).gates.find(g => g.id === 'localize').ok, false, 'nothing was localized')

  const blasted = await call('drill_blast', { symbol: 'no_such_symbol_anywhere' })
  assert.equal(blasted.callers.length, 0)
  const ledger2 = readFileSync(join(repo, '.drill', 'miss-drill', 'ledger.jsonl'), 'utf8').trim().split('\n').map(JSON.parse)
  const blast = ledger2.filter(e => e.kind === 'blast').at(-1)
  assert.match(blast.note, /blast gate stays open/)
  assert.equal(evaluate(ledger2).gates.find(g => g.id === 'blast').ok, false)
})

test('a text-search miss is a note, not evidence — even when it is recorded as locate/blast', { skip }, async () => {
  const { mkdirSync } = await import('node:fs')
  const { evaluate } = await import('../lib/gates.js')
  const repo = join(workspace, 'search-miss-repo')
  mkdirSync(repo, { recursive: true })
  writeFileSync(join(repo, 'a.txt'), 'nothing interesting here\n')
  const mod = await import('../index.js')
  const ctx = fakeContext()
  mod.apply(ctx, mod.Config({ reminder: false, cacheDir: join(workspace, 'cache'), embedEnabled: false, searchEngine: 'rg' }))
  const exec = { signal: new AbortController().signal, agent: { session: { id: 's-search-miss', header: { cwd: repo } } } }
  const call = (name, args) => ctx.tools_registered.get(name).execute(args, exec)

  await call('drill_start', { task: 'search-miss', repo, base: 'HEAD' })
  const searched = await call('drill_search', { pattern: 'zzz_absent_zzz', fixed: true, kind: 'locate' })
  assert.equal(searched.hits.length, 0)
  assert.equal(searched.recorded, 'locate@localize', 'the attempt is still recorded, for the audit trail')

  const ledger = readFileSync(join(repo, '.drill', 'search-miss', 'ledger.jsonl'), 'utf8').trim().split('\n').map(JSON.parse)
  const entry = ledger.filter(e => e.kind === 'locate').at(-1)
  assert.ok(entry, 'the miss appears in the ledger')
  assert.equal(entry.text, undefined, 'a text-search miss carries no evidence text')
  assert.equal(entry.files, undefined, 'and names no files')
  assert.match(entry.note, /localize gate stays open/)
  assert.equal(evaluate(ledger).gates.find(g => g.id === 'localize').ok, false, 'a miss never closes the gate it was searching for')

  // The other half of the rule: a search that *does* hit still closes it, so
  // "never closes" cannot pass this test either.
  writeFileSync(join(repo, 'b.txt'), 'the zzz_absent_zzz token lives here\n')
  const second = await call('drill_search', { pattern: 'zzz_absent_zzz', fixed: true, kind: 'locate' })
  assert.equal(second.hits.length, 1)
  const ledger2 = readFileSync(join(repo, '.drill', 'search-miss', 'ledger.jsonl'), 'utf8').trim().split('\n').map(JSON.parse)
  const hit = ledger2.filter(e => e.kind === 'locate').at(-1)
  assert.match(hit.text ?? '', /b\.txt/, 'a hit records its evidence text')
  assert.deepEqual(hit.files, [join(repo, 'b.txt')])
  assert.equal(evaluate(ledger2).gates.find(g => g.id === 'localize').ok, true, 'a hit closes the gate')
})

test('a backtrace with no repository frame is a note, not localization', { skip }, async () => {
  const { mkdirSync } = await import('node:fs')
  const { evaluate } = await import('../lib/gates.js')
  const repo = join(workspace, 'external-only-repo')
  mkdirSync(repo, { recursive: true })
  const mod = await import('../index.js')
  const ctx = fakeContext()
  mod.apply(ctx, mod.Config({ reminder: false, cacheDir: join(workspace, 'cache'), embedEnabled: false, searchEngine: 'rg' }))
  const exec = { signal: new AbortController().signal, agent: { session: { id: 's-external', header: { cwd: repo } } } }
  const call = (name, args) => ctx.tools_registered.get(name).execute(args, exec)

  await call('drill_start', { task: 'external-only', repo, base: 'HEAD' })
  // A panic that only ever shows dependency and toolchain frames: the drill has
  // learned nothing about where in *this* repository the bug lives.
  const failure = [
    'thread "main" panicked at library/std/src/panicking.rs:597:5:',
    'attempt to divide by zero',
    'stack backtrace:',
    '   0: std::panicking::begin_panic_handler',
    '             at /rustc/9c3b1a1b1b1b1b1b1b1b1b1b1b1b1b1b/library/std/src/panicking.rs:597:5',
    '   1: core::panicking::panic_fmt',
    '             at /rustc/9c3b1a1b1b1b1b1b1b1b1b1b1b1b1b1b/library/core/src/panicking.rs:72:14',
    '   2: rand::rngs::thread_rng',
    '             at /home/maya/.cargo/registry/src/index.crates.io-6f17d22bba15001f/rand-0.8.5/src/rngs/thread.rs:64:9',
  ].join('\n')

  const parsed = await call('drill_error', { error: failure })
  assert.equal(parsed.external, parsed.frames.length, 'every frame is external')
  assert.equal(parsed.resolved, 0)

  const ledger = readFileSync(join(repo, '.drill', 'external-only', 'ledger.jsonl'), 'utf8').trim().split('\n').map(JSON.parse)
  const entry = ledger.filter(e => e.kind === 'locate').at(-1)
  assert.ok(entry, 'the attempt is still recorded, for the audit trail')
  assert.equal(entry.text, undefined, 'a backtrace with no repository frame carries no evidence text')
  assert.equal(entry.files, undefined, 'and names no repository file')
  assert.match(entry.note, /localize gate stays open/)
  assert.equal(evaluate(ledger).gates.find(g => g.id === 'localize').ok, false, 'nothing in this repository was localized')
})

test('a hand-written review closes its gate only when it names the green commit', { skip }, async () => {
  const { execFileSync } = await import('node:child_process')
  const { mkdirSync } = await import('node:fs')
  const { evaluate } = await import('../lib/gates.js')
  const repo = join(workspace, 'hand-review-repo')
  mkdirSync(repo, { recursive: true })
  const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' }).trim()
  git('init', '-q', '-b', 'main')
  git('config', 'user.email', 'drill@test')
  git('config', 'user.name', 'drill test')
  writeFileSync(join(repo, 'a.rs'), 'fn a() {}\n')
  git('add', '.')
  git('commit', '-q', '-m', 'base')
  const head = git('rev-parse', 'HEAD')
  const ledgerPath = join(repo, '.drill', 'hand-review', 'ledger.jsonl')
  const readLedgerLines = () => readFileSync(ledgerPath, 'utf8').trim().split('\n').map(JSON.parse)
  const gate = id => evaluate(readLedgerLines()).gates.find(g => g.id === id)

  const mod = await import('../index.js')
  const ctx = fakeContext()
  mod.apply(ctx, mod.Config({ reminder: false, cacheDir: join(workspace, 'cache'), embedEnabled: false, searchEngine: 'rg' }))
  const exec = { signal: new AbortController().signal, agent: { session: { id: 's-hand-review', header: { cwd: repo } } } }
  const call = (name, args) => ctx.tools_registered.get(name).execute(args, exec)

  await call('drill_start', { task: 'hand-review', repo, base: 'HEAD' })
  const green = await call('drill_run', { cmd: 'true', stage: 'patch', kind: 'test', arm: 'fix' })
  assert.equal(green.exit, 0)

  // `head` is a real parameter now, and it is not filled in for the caller:
  // a review that names no commit cannot close the gate.
  await call('drill_record', { kind: 'review', stage: 'review', verdict: 'PASS', blockers: 0, text: 'looked at it' })
  assert.equal(gate('review').ok, false, 'an unbound review record cannot close the gate')
  assert.match(gate('review').detail, /names no commit/)

  await call('drill_record', { kind: 'review', stage: 'review', verdict: 'PASS', blockers: 0, text: 'looked at it', head })
  assert.equal(gate('review').ok, true, 'naming the green commit closes it')

  const recorded = readLedgerLines().filter(e => e.kind === 'review').at(-1)
  assert.equal(recorded.head, head)
})

test('a store hit that resolves to no file in this worktree is not localization', { skip }, async () => {
  const { execFileSync } = await import('node:child_process')
  const { mkdirSync } = await import('node:fs')
  const { evaluate } = await import('../lib/gates.js')
  const worktree = join(workspace, 'foreign-worktree')
  const store = join(workspace, 'Embed2', 'c2g', 'graph_index.sqlite')
  mkdirSync(join(workspace, 'Embed2', 'c2g'), { recursive: true })
  mkdirSync(join(worktree, 'nodedb', 'src'), { recursive: true })
  execFileSync('sqlite3', [store], { input: `
    CREATE TABLE nodes(id TEXT PRIMARY KEY, name TEXT, kind TEXT, file TEXT, repo TEXT, line INTEGER);
    CREATE TABLE links(source TEXT, target TEXT, relation TEXT);
    INSERT INTO nodes VALUES ('n1','ghost_fn','Function','nd_src/control/ghost.rs','nd_src',7);
  ` })

  const mod = await import('../index.js')
  const ctx = fakeContext()
  mod.apply(ctx, mod.Config({ reminder: false, cacheDir: join(workspace, 'cache'), embedStore: store }))
  const exec = { signal: new AbortController().signal, agent: { session: { id: 's-foreign', header: { cwd: worktree } } } }
  const call = (name, args) => ctx.tools_registered.get(name).execute(args, exec)

  await call('drill_start', { task: 'foreign-drill', repo: worktree, base: 'HEAD' })
  const located = await call('drill_locate', { symbol: 'ghost_fn' })
  assert.match(located.source, /c2g-embed/, 'the store still answered')

  const ledger = readFileSync(join(worktree, '.drill', 'foreign-drill', 'ledger.jsonl'), 'utf8').trim().split('\n').map(JSON.parse)
  const entry = ledger.filter(e => e.kind === 'locate').at(-1)
  assert.equal(entry.text, undefined, 'nothing in this worktree was localized, so there is no evidence text')
  assert.equal(entry.files, undefined)
  assert.match(entry.note, /none resolves to a file in this worktree/)
  assert.equal(evaluate(ledger).gates.find(g => g.id === 'localize').ok, false, 'the gate stays open')
})

test('drill_diff says so when the base ref could not be compared', { skip }, async () => {
  const { execFileSync } = await import('node:child_process')
  const { mkdirSync } = await import('node:fs')
  const repo = join(workspace, 'fallback-diff-repo')
  mkdirSync(repo, { recursive: true })
  const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' }).trim()
  git('init', '-q', '-b', 'main')
  git('config', 'user.email', 'drill@test')
  git('config', 'user.name', 'drill test')
  writeFileSync(join(repo, 'a.rs'), 'fn a() {}\n')
  git('add', '.')
  git('commit', '-q', '-m', 'base')
  // Uncommitted work, and a base ref that does not exist in this repo.
  writeFileSync(join(repo, 'a.rs'), 'fn a() { let _ = 1; }\n')

  const mod = await import('../index.js')
  const ctx = fakeContext()
  mod.apply(ctx, mod.Config({ reminder: false, cacheDir: join(workspace, 'cache'), c2gEnabled: false, embedEnabled: false }))
  const exec = { signal: new AbortController().signal, agent: { session: { id: 's-fallback', header: { cwd: repo } } } }
  const call = (name, args) => ctx.tools_registered.get(name).execute(args, exec)

  await call('drill_start', { task: 'fallback-diff', repo, base: 'origin/main' })
  const diff = await call('drill_diff', {})
  assert.deepEqual(diff.changed, ['a.rs'], 'the worktree diff still answers')

  const ledger = readFileSync(join(repo, '.drill', 'fallback-diff', 'ledger.jsonl'), 'utf8').trim().split('\n').map(JSON.parse)
  const blast = ledger.filter(e => e.kind === 'blast').at(-1)
  assert.equal(blast.base, undefined, 'a base that was never compared is not recorded')
  assert.equal(blast.cmd, 'git diff --name-only --diff-filter=ACMR HEAD')
  assert.match(blast.note, /working-tree diff against HEAD/)
})

test('drill_pr falls back to the session cwd when no task metadata names a repo', { skip }, async () => {
  const { execFileSync } = await import('node:child_process')
  const { mkdirSync, rmSync } = await import('node:fs')
  const repo = join(workspace, 'pr-no-active-repo')
  mkdirSync(repo, { recursive: true })
  const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' }).trim()
  git('init', '-q', '-b', 'main')
  git('config', 'user.email', 'drill@test')
  git('config', 'user.name', 'drill test')
  writeFileSync(join(repo, 'a.rs'), 'fn a() {}\n')
  git('add', '.')
  git('commit', '-q', '-m', 'base')

  const mod = await import('../index.js')
  const ctx = fakeContext()
  mod.apply(ctx, mod.Config({ reminder: false, cacheDir: join(workspace, 'cache'), embedEnabled: false, searchEngine: 'rg', prLint: false }))
  const exec = { signal: new AbortController().signal, agent: { session: { id: 's-pr-cwd', header: { cwd: repo } } } }
  const call = (name, args) => ctx.tools_registered.get(name).execute(args, exec)

  await call('drill_start', { task: 'pr-cwd', repo, base: 'HEAD' })
  // The bug only fires on the fallback: `active.repo` undefined, so the tool
  // reaches for the session cwd — which the tool never destructured.
  rmSync(join(repo, '.drill', 'active.json'), { force: true })

  const pr = await call('drill_pr', { task: 'pr-cwd', title: 'fix(seq): keep the batch ordered' })
  assert.equal(pr.recorded, true, 'the body is rendered and recorded')
  assert.ok(existsSync(pr.bodyPath), 'the body file exists')
  assert.match(readFileSync(pr.bodyPath, 'utf8'), /keep the batch ordered/)
})

test('drill_review removes its session listener on every exit path', { skip }, async () => {
  const { execFileSync } = await import('node:child_process')
  const { mkdirSync } = await import('node:fs')
  const repo = join(workspace, 'review-listener-repo')
  mkdirSync(repo, { recursive: true })
  const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' }).trim()
  git('init', '-q', '-b', 'main')
  git('config', 'user.email', 'drill@test')
  git('config', 'user.name', 'drill test')
  writeFileSync(join(repo, 'a.rs'), 'fn a() {}\n')
  git('add', '.')
  git('commit', '-q', '-m', 'base')

  let listeningDuringRun = null
  const subagents = {
    async start() {
      listeningDuringRun = ctx.listeners.has('session/event')
      return {
        id: 'child-listener',
        result: Promise.resolve({ stopReason: 'completed', structured: { verdict: 'PASS', blockers: [], unverified: [], summary: 'clean' } }),
        async dispose() {},
      }
    },
  }
  const mod = await import('../index.js')
  const ctx = fakeContext({ subagents })
  mod.apply(ctx, mod.Config({ reminder: false, cacheDir: join(workspace, 'cache'), embedEnabled: false }))
  const exec = { signal: new AbortController().signal, agent: { session: { id: 's-listener', header: { cwd: repo } } } }
  const call = (name, args) => ctx.tools_registered.get(name).execute(args, exec)

  await call('drill_start', { task: 'listener-drill', repo, base: 'HEAD' })
  await call('drill_review', { task: 'listener-drill' })
  assert.equal(listeningDuringRun, true, 'the budget listener is registered while the reviewer runs')
  assert.equal(ctx.listeners.has('session/event'), false, 'and disposed when the review returns')

  await call('drill_review', { task: 'listener-drill' })
  assert.equal(ctx.listeners.has('session/event'), false, 'a second review does not accumulate listeners')
})
test('a role that says maxToolCalls: 0 means no cap, not the row default', { skip }, async () => {
  const { execFileSync } = await import('node:child_process')
  const { mkdirSync } = await import('node:fs')
  const { evaluate } = await import('../lib/gates.js')
  const repo = join(workspace, 'review-budget-repo')
  mkdirSync(join(repo, '.dsh', 'roles'), { recursive: true })
  const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' }).trim()
  git('init', '-q', '-b', 'main')
  git('config', 'user.email', 'drill@test')
  git('config', 'user.name', 'drill test')
  writeFileSync(join(repo, 'a.rs'), 'fn a() {}\n')
  git('add', '.')
  git('commit', '-q', '-m', 'base')
  writeFileSync(join(repo, '.dsh', 'roles', 'uncapped-auditor.md'), '---\nname: uncapped-auditor\ntools: [read]\nmaxToolCalls: 0\n---\n\nRead-only, no tool cap.\n')
  writeFileSync(join(repo, '.dsh', 'roles', 'rolesselected-auditor.md'), '---\nname: rollesselected-auditor\ntools: [read]\n---\n\nRead-only, no budget key at all.\n')

  // The fake reviewer reports PASS unless the plugin's own budget listener
  // aborted its signal — so this test exercises the real predicate, not just
  // the string the artifact prints.
  const subagents = {
    async start(provider, request) {
      const id = 'child-budget'
      const signal = request.signal
      const result = new Promise(resolve => {
        setTimeout(() => {
          const onEvent = ctx.listeners.get('session/event')
          for (let i = 0; i < 50; i += 1) onEvent?.({ id }, { type: 'tool/call' })
          const aborted = signal.aborted
          resolve({
            stopReason: aborted ? 'aborted' : 'completed',
            structured: {
              verdict: aborted ? 'FAIL' : 'PASS',
              blockers: aborted ? ['the review hit its tool budget'] : [],
              unverified: [],
              summary: aborted ? 'aborted at the cap' : 'survived 50 tool calls',
            },
          })
        }, 5)
      })
      return { id, result, async dispose() {} }
    },
  }
  const mod = await import('../index.js')
  const ctx = fakeContext({ subagents })
  mod.apply(ctx, mod.Config({ reminder: false, cacheDir: join(workspace, 'cache'), embedEnabled: false, maxReviewToolCalls: 7 }))
  const exec = { signal: new AbortController().signal, agent: { session: { id: 's-budget', header: { cwd: repo } } } }
  const call = (name, args) => ctx.tools_registered.get(name).execute(args, exec)
  const lastReview = () => {
    const ledger = readFileSync(join(repo, '.drill', 'budget-drill', 'ledger.jsonl'), 'utf8').trim().split('\n').map(JSON.parse)
    return ledger.filter(e => e.kind === 'review').at(-1)
  }

  await call('drill_start', { task: 'budget-drill', repo, base: 'HEAD' })

  // 0 is the documented "no cap": 50 tool calls must not trip anything.
  const uncapped = await call('drill_review', { task: 'budget-drill', role: 'uncapped-auditor' })
  assert.equal(uncapped.verdict, 'PASS', 'a role saying maxToolCalls: 0 is not capped')
  const uncappedLog = readFileSync(lastReview().log, 'utf8')
  assert.match(uncappedLog, /role: uncapped-auditor \(project\)/)
  assert.match(uncappedLog, /toolCalls: 50\/unlimited/, '0 renders as unlimited, and all 50 calls were counted')

  // A role with no budget key still falls back to the row default, and 50 calls
  // blow through it — the abort has to reach the reviewer.
  const capped = await call('drill_review', { task: 'budget-drill', role: 'rolesselected-auditor' })
  assert.equal(capped.verdict, 'FAIL', 'the row default still caps the review')
  assert.match(readFileSync(lastReview().log, 'utf8'), /toolCalls: 50\/7/)
  assert.equal(evaluate(readFileSync(join(repo, '.drill', 'budget-drill', 'ledger.jsonl'), 'utf8').trim().split('\n').map(JSON.parse)).gates.find(g => g.id === 'review').ok, false, 'a capped FAIL leaves the gate open')
})

test('a cache with only a partial scope snapshot answers, and the record says so', { skip }, async () => {
  const { execFileSync } = await import('node:child_process')
  const { mkdirSync } = await import('node:fs')
  const repo = join(workspace, 'partial-snapshot-repo')
  const c2gDir = join(workspace, 'c2g-partial', 'proj')
  mkdirSync(repo, { recursive: true })
  mkdirSync(c2gDir, { recursive: true })
  const db = join(c2gDir, 'cache.sqlite3')
  execFileSync('sqlite3', [db], { input: `
    CREATE TABLE meta (singleton INTEGER PRIMARY KEY, application_identity TEXT NOT NULL, canonical_root BLOB NOT NULL, project_key BLOB NOT NULL);
    CREATE TABLE graph_snapshots (snapshot_id INTEGER PRIMARY KEY, resolver_tier TEXT NOT NULL, created_at_ns INTEGER NOT NULL);
    CREATE TABLE active_snapshots (resolver_tier TEXT NOT NULL, completeness INTEGER NOT NULL, snapshot_id INTEGER NOT NULL, PRIMARY KEY (resolver_tier, completeness));
    CREATE TABLE graph_symbols (snapshot_id INTEGER NOT NULL, ordinal INTEGER NOT NULL, id BLOB NOT NULL, scip TEXT NOT NULL, name TEXT NOT NULL, file TEXT NOT NULL, span_start INTEGER NOT NULL, span_end INTEGER NOT NULL, kind TEXT NOT NULL, symbol BLOB NOT NULL, PRIMARY KEY (snapshot_id, ordinal));
    CREATE TABLE graph_edges (snapshot_id INTEGER NOT NULL, from_ord INTEGER NOT NULL, to_ord INTEGER NOT NULL, role TEXT NOT NULL, occurrence_file TEXT NOT NULL, occurrence_line INTEGER NOT NULL, confidence REAL NOT NULL);
    INSERT INTO meta VALUES (1, 'code2graph-cache', '${repo}', x'00');
    INSERT INTO graph_snapshots VALUES (4, 'scope', 0);
    INSERT INTO active_snapshots VALUES ('scope', 0, 4);
    INSERT INTO graph_symbols VALUES
      (4, 1, x'41', 'a', 'half_indexed_fn', 'src/half.rs', 10, 40, '"Function"', '{"line":12}');
    PRAGMA user_version = 3;
  ` })

  const mod = await import('../index.js')
  const ctx = fakeContext()
  mod.apply(ctx, mod.Config({ reminder: false, cacheDir: join(workspace, 'cache'), c2gCacheDir: join(workspace, 'c2g-partial'), embedEnabled: false, prLint: false }))
  const exec = { signal: new AbortController().signal, agent: { session: { id: 's-partial', header: { cwd: repo } } } }
  const call = (name, args) => ctx.tools_registered.get(name).execute(args, exec)

  await call('drill_start', { task: 'partial-drill', repo, base: 'HEAD' })
  const located = await call('drill_locate', { symbol: 'half_indexed_fn' })
  assert.equal(located.found, true, 'a partial snapshot still answers')

  const ledger = readFileSync(join(repo, '.drill', 'partial-drill', 'ledger.jsonl'), 'utf8').trim().split('\n').map(JSON.parse)
  const entry = ledger.filter(e => e.kind === 'locate').at(-1)
  assert.deepEqual(entry.files, ['src/half.rs:12'], 'the hit is recorded as evidence')
  assert.match(entry.note, /c2g cache schema v3 — partial scope snapshot, callers may be under-reported/, 'and the reader is told the graph is partial')
})

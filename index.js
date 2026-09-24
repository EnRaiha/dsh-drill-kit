/**
 * dsh-drill — evidence-gated bug-fix drill for DeepSeek Harness.
 *
 * One issue, one worktree, one evidence chain. Every stage leaves a record in a
 * per-task ledger; `drill_gate` refuses a completion claim that has no proof.
 * Red and green proofs are produced by running the test command here, never by
 * an assertion written into a file.
 *
 * @module dsh-drill
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineTool } from '@deepseek-ai/dsh-tools'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import z from '@deepseek-ai/schemastery'

import { STAGES, appendEntry, readLedger, taskPaths, writeReport } from './lib/ledger.js'
import { evaluate, gateTable } from './lib/gates.js'
import { renderReport } from './lib/report.js'
import { runCapture } from './lib/runner.js'
import { callees as c2gCallees, callers as c2gCallers, dependentFiles, discoverDb, impact as c2gImpact, locateByFrame, locateByName } from './lib/c2g.js'
import { branchName, diffFiles, headSha } from './lib/git.js'
import { resolveRole, roleBudget, roleToolFilter } from './lib/role.js'
import { DEFAULT_INDEX_DIR, definitionPattern, indexFor, indexRoot, indexesSize, legacyIndexDir, pruneIndexes, resolveBin, resolveEngine, searchText } from './lib/search.js'
import { cacheRoot, drop, readCache, sizeOf } from './lib/cache.js'

export const name = 'dsh-drill'
export const inject = ['tools']

const HERE = dirname(fileURLToPath(import.meta.url))
const KINDS = ['locate', 'blast', 'edge', 'test', 'hygiene', 'review', 'pr', 'note']

/** Row configuration; every field is changeable from the profile patch. */
export const Config = z.object({
  stateRoot: z.string().default('.drill'),
  reminder: z.boolean().default(true),
  provider: z.string().default('spawn'),
  model: z.string().default(''),
  defaultRole: z.string().default('drill-auditor'),
  maxReviewToolCalls: z.number().min(0).step(1).default(40),
  runTimeoutMs: z.number().min(0).step(1000).default(900_000),
  c2gEnabled: z.boolean().default(true),
  c2gCacheDir: z.string().default(''),
  sqliteBin: z.string().default('sqlite3'),
  c2gDepth: z.number().min(1).max(10).step(1).default(3),
  rippleDepth: z.number().min(1).max(5).step(1).default(2),
  searchEngine: z.union(['auto', 'rg', 'tgrep']).default('auto'),
  tgrepIndexDir: z.string().default(''),
  autoIndex: z.boolean().default(false),
  cacheDir: z.string().default(''),
  cacheTtlDays: z.number().min(0).step(1).default(7),
  rgBin: z.string().default('rg'),
  tgrepBin: z.string().default('tgrep'),
  searchMaxHits: z.number().min(1).step(1).default(200),
})

const REVIEW_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    verdict: { type: 'string', enum: ['PASS', 'FAIL'] },
    blockers: { type: 'array', items: { type: 'string' } },
    unverified: { type: 'array', items: { type: 'string' } },
    summary: { type: 'string' },
  },
}

/** Persona used when no role file is installed, so the tool still works out of the box. */
const FALLBACK_PERSONA = [
  'You are Review 2: a fresh-session, read-only structural auditor for one drill branch.',
  'You did not write this code, so never trust the branch narrative — count things, run read-only commands, and report evidence.',
  'Read-only: no edits, no commits, no pushes, no branch changes.',
  'Every verdict needs the command and its output; anything you cannot verify goes in `unverified` with the reason.',
  'Follow /home/maya/.hermes/skills/devops/nodedb-parity-audit/SKILL.md when it exists; otherwise apply the same seven checks: test inventory parity, caller closure, producer/consumer enumeration, invariant chokepoints, module contracts, repo norms (bash /home/maya/scripts/nodedb-preflight.sh <repo> <base>), PR format.',
  'Any blocker means verdict FAIL. Do not soften a FAIL into a warning, and do not report style nits as blockers.',
].join(' ')

/** Read-only tool allowlist used when the role file names no tools. */
const FALLBACK_TOOLS = ['read', 'glob', 'grep']

/** Resolve the workspace root for a tool call, then the drill state root inside it. */
function roots(exec, config) {
  const cwd = exec?.agent?.session?.header?.cwd ?? process.cwd()
  const stateRoot = resolve(cwd, config.stateRoot)
  return { cwd, stateRoot }
}

/** Discover the c2g cache database for a repository, or null when unavailable. */
function c2gDb(repo, config) {
  if (!config.c2gEnabled) return null
  try {
    const options = { cacheDir: drillCacheDir(config), ttlMs: cacheTtlMs(config) }
    const found = config.c2gCacheDir && config.c2gCacheDir.length > 0
      ? discoverDb(repo, config.c2gCacheDir, config.sqliteBin, options)
      : discoverDb(repo, undefined, config.sqliteBin, options)
    return found?.db ?? null
  } catch {
    return null
  }
}

/** The drill cache root in use: `cacheDir` config, else the default cache root. */
function drillCacheDir(config) {
  return cacheRoot(config.cacheDir && config.cacheDir.length > 0 ? config.cacheDir : undefined)
}

/** Cache time to live in milliseconds; `cacheTtlDays: 0` disables expiry. */
function cacheTtlMs(config) {
  return config.cacheTtlDays > 0 ? config.cacheTtlDays * 24 * 60 * 60 * 1000 : 0
}

/** Index base directory: `tgrepIndexDir` config, else `<cacheDir>/tgrep`. */
function indexBase(config) {
  if (config.tgrepIndexDir && config.tgrepIndexDir.length > 0) return config.tgrepIndexDir
  return config.cacheDir && config.cacheDir.length > 0 ? join(config.cacheDir, 'tgrep') : DEFAULT_INDEX_DIR
}

/**
 * Common text-search options: engine choice, binaries, and the out-of-tree
 * tgrep index location (empty config means the cache directory).
 */
function searchArgs(config, extra = {}) {
  return {
    engine: config.searchEngine,
    rgBin: config.rgBin,
    tgrepBin: config.tgrepBin,
    indexDir: indexBase(config),
    maxHits: config.searchMaxHits,
    ...extra,
  }
}

/**
 * Run a text search, optionally building the out-of-tree tgrep index first.
 *
 * With `autoIndex` off this never writes: the search simply runs on ripgrep.
 * With it on, a missing index is built once into the cache directory, so the
 * worktree stays clean and later searches take the trigram path.
 */
function maybeIndex(root, config, run) {
  if (!config.autoIndex) return run()
  const baseDir = indexBase(config)
  if (indexFor(root, baseDir) !== null) return run()
  if (resolveBin(config.tgrepBin) === null) return run()
  const built = indexRoot({ root, baseDir, tgrepBin: config.tgrepBin })
  const result = run()
  if (built.ok) result.indexed = built.dir
  return result
}

/** List a directory's entry names, or an empty list when it does not exist. */
function readdirSyncSafe(dir) {
  try {
    return readdirSync(dir)
  } catch {
    return []
  }
}

/** Read the active drill task recorded by `drill_start`, if any. */
function readActive(stateRoot) {
  const path = join(stateRoot, 'active.json')
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return null
  }
}

/** Load a task's ledger and gate evaluation. */
function loadTask(stateRoot, task) {
  const paths = taskPaths(stateRoot, task)
  const entries = readLedger(paths)
  const meta = entries.find(e => e.kind === 'note' && e.text === 'drill-start') ?? {}
  return { paths, entries, meta, evaluation: evaluate(entries) }
}

/** Compact gate summary shared by every tool's return value. */
function summarize(evaluation) {
  return {
    ready: evaluation.ready,
    stage: evaluation.stage,
    missing: evaluation.missingForDone,
    gates: evaluation.gates.map(g => `${g.ok ? 'pass' : 'open'}:${g.id}`),
    next: evaluation.next,
  }
}

/** Resolve the task named by the caller, falling back to the active task. */
function resolveTask(args, stateRoot) {
  if (typeof args.task === 'string' && args.task.length > 0) return args.task
  const active = readActive(stateRoot)
  if (active?.task) return active.task
  throw new Error('drill: no task given and no active task — call drill_start first')
}

/**
 * Host half of the drill plugin: seven tools plus the turn-closing reminder.
 *
 * @param ctx Cordis context with the `tools` service.
 * @param config Resolved row configuration.
 */
export function apply(ctx, config) {
  const tool = definition => ctx.tools.register(defineTool(definition))
  const reminded = new Map()

  tool({
    name: 'drill_start',
    description: 'Open a drill task: one issue, one worktree, one evidence chain. Creates the ledger, records the task metadata, and reports which gates are still open. Call this before any drill work on an issue.',
    parameters: {
      task: { type: 'string', required: true, description: 'Short task id, e.g. issue296 (letters, digits, dot, dash, underscore).' },
      repo: { type: 'string', description: 'Repository or worktree path the drill runs in.' },
      base: { type: 'string', description: 'Base ref the branch will be compared against, e.g. origin/main.' },
      issue: { type: 'string', description: 'Issue number the PR will close.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          task: { type: 'string', required: true },
          dir: { type: 'string', required: true },
          gates: { type: 'array', required: true, items: { type: 'string' } },
          next: { type: 'string', required: true },
        },
      },
      render: (_args, value) => [{ type: 'text', text: `drill ${value.task} opened at ${value.dir}\ngates: ${value.gates.join(' ')}\nnext: ${value.next}` }],
    },
    async execute(args, exec) {
      const { cwd, stateRoot } = roots(exec, config)
      const paths = taskPaths(stateRoot, args.task)
      mkdirSync(paths.artifacts, { recursive: true })
      appendEntry(paths, {
        task: args.task,
        kind: 'note',
        stage: 'localize',
        text: 'drill-start',
        note: `cwd=${cwd}`,
        repo: args.repo ?? cwd,
        base: args.base ?? 'origin/main',
        ...(args.issue !== undefined ? { issue: String(args.issue) } : {}),
      })
      writeFileSync(join(stateRoot, 'active.json'), `${JSON.stringify({ task: args.task, repo: args.repo ?? cwd, base: args.base ?? 'origin/main', issue: args.issue ?? null, startedAt: new Date().toISOString() }, null, 2)}\n`, 'utf8')
      const { evaluation } = loadTask(stateRoot, args.task)
      const summary = summarize(evaluation)
      // Advise which stage 1–2 engine will answer, without writing anything.
      const repoRoot = args.repo !== undefined ? resolve(cwd, args.repo) : cwd
      const c2gReady = c2gDb(repoRoot, config) !== null
      const tgrepReady = indexFor(repoRoot, indexBase(config)) !== null
      const coverage = c2gReady
        ? 'stage 1–2: c2g cache covers this repo'
        : tgrepReady
          ? 'stage 1–2: no c2g cache, tgrep index ready (text-level)'
          : 'stage 1–2: no c2g cache and no tgrep index — run drill_index to build one, otherwise searches scan with rg'
      return { task: args.task, dir: paths.dir, gates: summary.gates, next: `${summary.next} · ${coverage}` }
    },
  })

  tool({
    name: 'drill_locate',
    description: 'Stage 1 — resolve a stack frame or symbol name to its exact definition site using the local code2graph cache (read-only SQL, no reindex). Records the finding as `locate` evidence.',
    parameters: {
      symbol: { type: 'string', description: 'Symbol name to resolve.' },
      file: { type: 'string', description: 'Repository-relative file for a stack frame, or to disambiguate duplicate symbol names.' },
      line: { type: 'integer', description: 'Line number from the stack trace; needs `file`.' },
      task: { type: 'string', description: 'Task id; defaults to the active drill task.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          found: { type: 'boolean', required: true },
          results: { type: 'array', required: true, items: { type: 'string' } },
          source: { type: 'string', required: true },
          gates: { type: 'array', required: true, items: { type: 'string' } },
          next: { type: 'string', required: true },
        },
      },
      render: (_args, value) => [{ type: 'text', text: value.found ? `${value.source}\n${value.results.join('\n')}\ngates: ${value.gates.join(' ')}\nnext: ${value.next}` : `${value.source}\nno match — ${value.next}` }],
    },
    async execute(args, exec) {
      const { cwd, stateRoot } = roots(exec, config)
      const task = resolveTask(args, stateRoot)
      const paths = taskPaths(stateRoot, task)
      const active = readActive(stateRoot) ?? {}
      const repo = active.repo ?? cwd
      const db = c2gDb(repo, config)

      let rows = []
      if (db !== null) {
        if (typeof args.symbol === 'string' && args.symbol.length > 0) {
          rows = locateByName(db, args.symbol, { file: args.file })
        } else if (typeof args.file === 'string' && Number.isInteger(args.line)) {
          const hit = locateByFrame(db, args.file, args.line)
          rows = hit ? [hit] : []
        }
      }
      if (db === null && !(typeof args.symbol === 'string' && args.symbol.length > 0) && !(typeof args.file === 'string' && Number.isInteger(args.line))) {
        throw new Error('drill: pass `symbol`, or `file` plus `line`')
      }

      // Text-level fallback: the graph has no answer (no cache, or the symbol is
      // not indexed), so search for definition-shaped lines and say so.
      if (rows.length === 0 && typeof args.symbol === 'string' && args.symbol.length > 0) {
        const found = maybeIndex(repo, config, () => searchText(searchArgs(config, { pattern: definitionPattern(args.symbol), root: repo })))
        if (found.engine === null) throw new Error(`drill: no code2graph cache matches ${repo} and no text-search engine is available (${found.error})`)
        const hits = found.hits.map(h => `${h.file}:${h.line ?? '?'}`)
        const results = found.hits.map(h => `${args.symbol} [text] ${h.file}:${h.line ?? '?'} ${h.text.trim().slice(0, 90)}`)
        appendEntry(paths, {
          task,
          kind: 'locate',
          stage: 'localize',
          cmd: `${found.engine} -n '${definitionPattern(args.symbol)}' ${repo}`,
          ...(hits.length > 0 ? { files: hits } : {}),
          text: hits.length > 0 ? `text-level candidates: ${hits.slice(0, 10).join(', ')}`.slice(0, 500) : `no definition-shaped line for ${args.symbol}`,
          note: 'text-level (no code2graph answer) — confirm the site before treating it as the definition',
        })
        const { evaluation } = loadTask(stateRoot, task)
        const summary = summarize(evaluation)
        return { found: hits.length > 0, results, source: `${found.engine} ${found.bin} (text-level)`, gates: summary.gates, next: summary.next }
      }

      const results = rows.map(r => `${r.name} [${r.kind}] ${r.file}:${r.line}`)
      appendEntry(paths, {
        task,
        kind: 'locate',
        stage: 'localize',
        cmd: typeof args.symbol === 'string' && args.symbol.length > 0 ? `c2g locate name=${args.symbol}` : `c2g locate frame=${args.file}:${args.line}`,
        files: rows.map(r => `${r.file}:${r.line}`),
        text: results.join('; ').slice(0, 500),
      })
      const { evaluation } = loadTask(stateRoot, task)
      const summary = summarize(evaluation)
      return { found: rows.length > 0, results, source: `c2g ${db}`, gates: summary.gates, next: summary.next }
    },
  })

  tool({
    name: 'drill_blast',
    description: 'Stage 2 — map the blast radius of a symbol: direct call sites, transitive callers to a bounded depth, and the callees it uses, from the local code2graph cache. Records the result as `blast` evidence.',
    parameters: {
      symbol: { type: 'string', required: true, description: 'Symbol whose blast radius to map.' },
      file: { type: 'string', description: 'Disambiguate duplicate symbol names across crates.' },
      depth: { type: 'integer', description: 'Transitive caller depth; defaults to the row configuration.' },
      task: { type: 'string', description: 'Task id; defaults to the active drill task.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          symbol: { type: 'string', required: true },
          callers: { type: 'array', required: true, items: { type: 'string' } },
          impact: { type: 'array', required: true, items: { type: 'string' } },
          callees: { type: 'array', required: true, items: { type: 'string' } },
          fileCount: { type: 'integer', required: true },
          gates: { type: 'array', required: true, items: { type: 'string' } },
          next: { type: 'string', required: true },
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: `${value.symbol} — ${value.callers.length} call sites, ${value.impact.length} transitive callers in ${value.fileCount} files, ${value.callees.length} callees\ncallers:\n${value.callers.join('\n') || '- none'}\nimpact:\n${value.impact.join('\n') || '- none'}\ngates: ${value.gates.join(' ')}\nnext: ${value.next}`,
      }],
    },
    async execute(args, exec) {
      const { cwd, stateRoot } = roots(exec, config)
      const task = resolveTask(args, stateRoot)
      const paths = taskPaths(stateRoot, task)
      const active = readActive(stateRoot) ?? {}
      const repo = active.repo ?? cwd
      const db = c2gDb(repo, config)

      const opts = { file: args.file, limit: 40 }
      let callSites = []
      let transitive = []
      let called = []
      if (db !== null) {
        callSites = c2gCallers(db, args.symbol, opts)
        transitive = c2gImpact(db, args.symbol, { ...opts, depth: args.depth ?? config.c2gDepth, limit: 60 })
        called = c2gCallees(db, args.symbol, opts)
      }

      // Text-level fallback: occurrence sites, explicitly not a resolved graph.
      if (db === null || callSites.length + transitive.length + called.length === 0) {
        const found = maybeIndex(repo, config, () => searchText(searchArgs(config, { pattern: args.symbol, root: repo, word: true, fixed: true })))
        if (found.engine === null) throw new Error(`drill: no code2graph answer for ${args.symbol} in ${repo} and no text-search engine is available (${found.error})`)
        const sites = found.hits.map(h => `${h.file}:${h.line ?? '?'}`)
        const files = [...new Set(found.hits.map(h => h.file))]
        appendEntry(paths, {
          task,
          kind: 'blast',
          stage: 'blast',
          cmd: `${found.engine} -w -F '${args.symbol}' ${repo}`,
          symbols: [args.symbol],
          files,
          text: `${sites.length} text occurrences in ${files.length} files`.slice(0, 500),
          note: 'text-level: occurrences, not resolved call sites — a caller/callee claim still needs the graph or a read of the code',
        })
        const { evaluation } = loadTask(stateRoot, task)
        const summary = summarize(evaluation)
        return { symbol: args.symbol, callers: sites, impact: [], callees: [], fileCount: files.length, gates: summary.gates, next: summary.next }
      }

      const callerLines = callSites.map(r => `${r.caller} ${r.occurrence_file}:${r.occurrence_line}`)
      const impactLines = transitive.map(r => `d${r.depth} ${r.caller} ${r.caller_file}:${r.line}`)
      const calleeLines = called.map(r => `${r.callee} ${r.callee_file}`)
      const files = [...new Set([...callSites.map(r => r.occurrence_file), ...transitive.map(r => r.caller_file), ...called.map(r => r.callee_file)])].filter(Boolean)

      appendEntry(paths, {
        task,
        kind: 'blast',
        stage: 'blast',
        cmd: `c2g blast ${args.symbol}${args.file ? ` file=${args.file}` : ''} depth=${args.depth ?? config.c2gDepth}`,
        symbols: [args.symbol],
        files,
        text: `${callerLines.length} call sites, ${transitive.length} transitive, ${calleeLines.length} callees`.slice(0, 500),
      })
      const { evaluation } = loadTask(stateRoot, task)
      const summary = summarize(evaluation)
      return { symbol: args.symbol, callers: callerLines, impact: impactLines, callees: calleeLines, fileCount: files.length, gates: summary.gates, next: summary.next }
    },
  })

  tool({
    name: 'drill_search',
    description: 'Text search over the drill repository with ripgrep or tgrep (trigram index), used when the code graph has no answer or when the question is not about a symbol — a config key, an error string, a SQL fragment, a doc claim. Records the hits as `locate` or `blast` evidence when asked, always labelled text-level.',
    parameters: {
      pattern: { type: 'string', required: true, description: 'Regex pattern, or a literal when `fixed` is true.' },
      glob: { type: 'string', description: 'Glob filter, e.g. "*.rs" or "nodedb-sql/**".' },
      fixed: { type: 'boolean', description: 'Treat the pattern as a literal string.' },
      word: { type: 'boolean', description: 'Match whole words only.' },
      ignoreCase: { type: 'boolean', description: 'Case-insensitive matching.' },
      kind: { type: 'string', enum: ['none', 'locate', 'blast', 'edge'], description: 'Record the hits as this evidence kind; default none (search only).' },
      stage: { type: 'string', enum: STAGES, description: 'Stage for the recorded evidence; derived from `kind` when omitted.' },
      task: { type: 'string', description: 'Task id; defaults to the active drill task.' },
      maxHits: { type: 'integer', description: 'Cap on returned hits; defaults to the row configuration.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          engine: { type: 'string', required: true },
          bin: { type: 'string', required: true },
          hits: { type: 'array', items: { type: 'string' } },
          files: { type: 'array', items: { type: 'string' } },
          truncated: { type: 'boolean' },
          recorded: { type: 'string' },
          note: { type: 'string' },
          gates: { type: 'array', items: { type: 'string' } },
          next: { type: 'string' },
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: `${value.engine} (${value.bin}) — ${value.hits.length} hits in ${value.files.length} files${value.truncated ? ' (truncated)' : ''}\n${value.hits.slice(0, 40).join('\n') || '- none'}${value.recorded ? `\nrecorded as: ${value.recorded}` : ''}${value.note ? `\nnote: ${value.note}` : ''}\ngates: ${value.gates.join(' ')}\nnext: ${value.next}`,
      }],
    },
    async execute(args, exec) {
      const { cwd, stateRoot } = roots(exec, config)
      const task = resolveTask(args, stateRoot)
      const paths = taskPaths(stateRoot, task)
      const active = readActive(stateRoot) ?? {}
      const repo = active.repo !== undefined ? resolve(String(active.repo)) : cwd

      const found = maybeIndex(repo, config, () => searchText(searchArgs(config, {
        pattern: args.pattern,
        root: repo,
        glob: args.glob,
        fixed: args.fixed,
        word: args.word,
        ignoreCase: args.ignoreCase,
        ...(args.maxHits !== undefined ? { maxHits: args.maxHits } : {}),
      })))
      if (found.engine === null) throw new Error(`drill: no text-search engine available (${found.error})`)

      const hits = found.hits.map(h => `${h.file}${h.line !== null ? `:${h.line}` : ''}${h.column !== null ? `:${h.column}` : ''} ${h.text.trim().slice(0, 160)}`)
      const files = [...new Set(found.hits.map(h => h.file))]
      const kind = args.kind ?? 'none'
      const stage = args.stage ?? (kind === 'locate' ? 'localize' : kind === 'blast' ? 'blast' : kind === 'edge' ? 'edge' : 'localize')

      let recorded = ''
      if (kind !== 'none') {
        appendEntry(paths, {
          task,
          kind,
          stage,
          cmd: `${found.engine} ${args.fixed ? '-F ' : ''}${args.word ? '-w ' : ''}'${args.pattern}'${args.glob ? ` --glob '${args.glob}'` : ''} ${repo}`,
          ...(files.length > 0 ? { files } : {}),
          text: hits.slice(0, 8).join(' | ').slice(0, 500) || `no hits for ${args.pattern}`,
          note: 'text-level search evidence',
        })
        recorded = `${kind}@${stage}`
      }

      const { evaluation } = loadTask(stateRoot, task)
      const summary = summarize(evaluation)
      return {
        engine: found.engine,
        bin: found.bin,
        hits,
        files,
        truncated: found.truncated,
        recorded,
        note: found.error ?? (found.hits.length === 0 ? 'no hits' : ''),
        gates: summary.gates,
        next: summary.next,
      }
    },
  })

  tool({
    name: 'drill_index',
    description: 'Build or refresh the out-of-tree tgrep index for the drill repository (or a given root), so stage 1–2 text search runs on the trigram index instead of scanning. The index lives in a cache directory, never inside the worktree, so `git status` stays clean.',
    parameters: {
      root: { type: 'string', description: 'Root to index; defaults to the task repository.' },
      force: { type: 'boolean', description: 'Rebuild from scratch instead of an incremental refresh.' },
      task: { type: 'string', description: 'Task id; defaults to the active drill task.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          ok: { type: 'boolean', required: true },
          root: { type: 'string', required: true },
          dir: { type: 'string', required: true },
          files: { type: 'integer' },
          trigrams: { type: 'integer' },
          engine: { type: 'string' },
          c2gCovered: { type: 'boolean' },
          pruned: { type: 'integer' },
          freedBytes: { type: 'integer' },
          error: { type: 'string' },
          gates: { type: 'array', items: { type: 'string' } },
          next: { type: 'string' },
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: value.ok
          ? `tgrep index ready: ${value.files ?? '?'} files, ${value.trigrams ?? '?'} trigrams\nroot: ${value.root}\ndir:  ${value.dir}\nengine now: ${value.engine} (c2g covered: ${value.c2gCovered})${value.pruned > 0 ? `\npruned ${value.pruned} idle index(es), freed ${Math.round((value.freedBytes ?? 0) / 1048576)} MB` : ''}${value.next ? `\nnext: ${value.next}` : ''}`
          : `index failed: ${value.error}`,
      }],
    },
    async execute(args, exec) {
      const { cwd, stateRoot } = roots(exec, config)
      const task = resolveTask(args, stateRoot)
      const paths = taskPaths(stateRoot, task)
      const active = readActive(stateRoot) ?? {}
      const repo = args.root !== undefined ? resolve(cwd, args.root) : (active.repo !== undefined ? resolve(String(active.repo)) : cwd)
      const baseDir = indexBase(config)

      const built = indexRoot({ root: repo, baseDir, tgrepBin: config.tgrepBin, force: args.force === true })
      const pruned = pruneIndexes({ baseDir, ttlMs: cacheTtlMs(config), keepRoots: [repo] })
      const c2gCovered = c2gDb(repo, config) !== null
      const engine = resolveEngine({ engine: config.searchEngine, root: repo, rgBin: config.rgBin, tgrepBin: config.tgrepBin, indexDir: baseDir })?.engine ?? null

      appendEntry(paths, {
        task,
        kind: 'note',
        stage: 'localize',
        text: built.ok ? `tgrep index ${built.dir}` : `tgrep index failed: ${built.error}`,
        note: built.ok ? `${built.meta?.files ?? '?'} files, ${built.meta?.trigrams ?? '?'} trigrams, engine=${engine}, c2g=${c2gCovered}${pruned.removed.length > 0 ? `, pruned ${pruned.removed.length}` : ''}` : 'index build failed',
        repo,
      })
      const { evaluation } = loadTask(stateRoot, task)
      const summary = summarize(evaluation)
      return {
        ok: built.ok,
        root: repo,
        dir: built.dir,
        ...(built.meta?.files !== null && built.meta?.files !== undefined ? { files: built.meta.files } : {}),
        ...(built.meta?.trigrams !== null && built.meta?.trigrams !== undefined ? { trigrams: built.meta.trigrams } : {}),
        ...(engine !== null ? { engine } : {}),
        c2gCovered,
        pruned: pruned.removed.length,
        freedBytes: pruned.freedBytes,
        ...(built.error !== null ? { error: built.error } : {}),
        gates: summary.gates,
        next: summary.next,
      }
    },
  })

  tool({
    name: 'drill_cache',
    description: 'Inspect or clean the drill cache: discovery results and tgrep indexes under the cache root (never /tmp). `status` reports size, entry count and the idle time to live; `prune` removes entries unused for longer than the TTL; `clear` removes all derived cache data (everything is rebuildable).',
    parameters: {
      action: { type: 'string', enum: ['status', 'prune', 'clear'], required: true, description: 'status | prune | clear' },
      task: { type: 'string', description: 'Task id; defaults to the active drill task.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          cacheDir: { type: 'string', required: true },
          ttlDays: { type: 'integer', required: true },
          indexDir: { type: 'string', required: true },
          indexBytes: { type: 'integer' },
          indexEntries: { type: 'array', items: { type: 'string' } },
          discoveryBytes: { type: 'integer' },
          discoveryEntries: { type: 'integer' },
          removed: { type: 'array', items: { type: 'string' } },
          freedBytes: { type: 'integer' },
          legacyDir: { type: 'string' },
          note: { type: 'string' },
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: [
          `cache: ${value.cacheDir} (idle TTL ${value.ttlDays}d)`,
          `indexes: ${value.indexEntries.length} entries, ${(value.indexBytes / 1048576).toFixed(1)} MB at ${value.indexDir}`,
          `discovery: ${value.discoveryEntries} repos, ${(value.discoveryBytes / 1024).toFixed(1)} KB`,
          value.removed.length > 0 ? `removed: ${value.removed.join(', ')} (freed ${(value.freedBytes / 1048576).toFixed(1)} MB)` : null,
          value.legacyDir ? `legacy index cache still present at ${value.legacyDir}` : null,
          value.note ?? null,
        ].filter(Boolean).join('\n'),
      }],
    },
    async execute(args, exec) {
      const { stateRoot } = roots(exec, config)
      const task = resolveTask(args, stateRoot)
      const paths = taskPaths(stateRoot, task)
      const cacheDir = drillCacheDir(config)
      const baseDir = indexBase(config)
      const ttlMs = cacheTtlMs(config)
      const ttlDays = config.cacheTtlDays

      const discoveryPath = join(cacheDir, 'c2g-discovery.json')
      let removed = []
      let freedBytes = 0
      let note = null

      if (args.action === 'prune') {
        const pruned = pruneIndexes({ baseDir, ttlMs, keepRoots: [readActive(stateRoot)?.repo].filter(Boolean).map(String) })
        removed = pruned.removed
        freedBytes = pruned.freedBytes
        // Discovery entries expire on read; drop the file when nothing is left.
        const discovery = readCache(discoveryPath, ttlMs)
        if (discovery === null) drop(discoveryPath)
        note = `pruned ${removed.length} idle index(es)`
      } else if (args.action === 'clear') {
        freedBytes = indexesSize(baseDir) + sizeOf(discoveryPath)
        drop(baseDir)
        drop(discoveryPath)
        note = 'cleared derived cache data; the next search rebuilds what it needs'
      }

      const entries = (() => {
        try {
          return readdirSyncSafe(baseDir)
        } catch {
          return []
        }
      })()
      const discovery = readCache(discoveryPath, ttlMs)
      const result = {
        cacheDir,
        ttlDays,
        indexDir: baseDir,
        indexBytes: indexesSize(baseDir),
        indexEntries: entries,
        discoveryBytes: sizeOf(discoveryPath),
        discoveryEntries: discovery === null ? 0 : Object.keys(discovery.entries ?? {}).length,
        removed,
        freedBytes,
        ...(legacyIndexDir() !== null ? { legacyDir: legacyIndexDir() } : {}),
        ...(note !== null ? { note } : {}),
      }
      appendEntry(paths, { task, kind: 'note', stage: 'localize', text: `drill_cache ${args.action}`, note: `${result.indexEntries.length} indexes, ${(result.indexBytes / 1048576).toFixed(1)} MB${removed.length > 0 ? `, removed ${removed.length}` : ''}` })
      return result
    },
  })

  tool({
    name: 'drill_record',
    description: 'Append one evidence record to a drill task ledger. Use for stage evidence that is not a command run: localization findings, blast-radius findings, enumerated edge cases, a review verdict, or the PR body path. Test and hygiene records are refused without a readable, non-empty log file.',
    parameters: {
      kind: { type: 'string', required: true, enum: KINDS, description: 'locate | blast | edge | test | hygiene | review | pr | note' },
      stage: { type: 'string', required: true, enum: STAGES, description: 'Drill stage this evidence belongs to.' },
      task: { type: 'string', description: 'Task id; defaults to the active drill task.' },
      arm: { type: 'string', enum: ['base', 'fix'], description: 'For test records: base = pre-fix arm, fix = post-fix arm.' },
      cmd: { type: 'string', description: 'The command that produced this evidence.' },
      exit: { type: 'integer', description: 'Process exit code.' },
      log: { type: 'string', description: 'Path to the captured output; hashed into the ledger.' },
      verdict: { type: 'string', enum: ['PASS', 'FAIL'], description: 'For review records.' },
      blockers: { type: 'integer', description: 'Number of blockers a review found; PASS requires 0.' },
      text: { type: 'string', description: 'Free-text evidence: the finding, the invariants, the review summary.' },
      note: { type: 'string', description: 'Short annotation.' },
      files: { type: 'array', items: { type: 'string' }, description: 'Files or file:line anchors this evidence names.' },
      symbols: { type: 'array', items: { type: 'string' }, description: 'Symbols this evidence names.' },
      bodyPath: { type: 'string', description: 'For pr records: path to the PR body file.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          recorded: { type: 'string', required: true },
          gates: { type: 'array', required: true, items: { type: 'string' } },
          next: { type: 'string', required: true },
        },
      },
      render: (_args, value) => [{ type: 'text', text: `recorded ${value.recorded}\ngates: ${value.gates.join(' ')}\nnext: ${value.next}` }],
    },
    async execute(args, exec) {
      const { stateRoot } = roots(exec, config)
      const task = resolveTask(args, stateRoot)
      const paths = taskPaths(stateRoot, task)
      const { task: _task, ...rest } = args
      appendEntry(paths, { ...rest, task }, { requireLog: config.requireLog })
      const { evaluation } = loadTask(stateRoot, task)
      const summary = summarize(evaluation)
      return { recorded: `${args.kind}@${args.stage}`, gates: summary.gates, next: summary.next }
    },
  })

  tool({
    name: 'drill_run',
    description: 'Run a command as drill evidence: the plugin executes it, captures combined output into the task log directory, hashes the log, and records the exit code. This is the only way to produce a red or green test proof — a hand-written log is not evidence.',
    parameters: {
      cmd: { type: 'string', required: true, description: 'Shell command line to run.' },
      stage: { type: 'string', required: true, enum: STAGES, description: 'Drill stage this run belongs to.' },
      kind: { type: 'string', enum: ['test', 'hygiene'], description: 'test (default) or hygiene for fmt/clippy/preflight runs.' },
      arm: { type: 'string', enum: ['base', 'fix'], description: 'For test runs: base before the fix, fix after it.' },
      task: { type: 'string', description: 'Task id; defaults to the active drill task.' },
      label: { type: 'string', description: 'Short label used in the log file name.' },
      timeoutMs: { type: 'integer', description: 'Hard timeout; defaults to the row configuration.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          exit: { type: 'integer', required: true },
          log: { type: 'string', required: true },
          timedOut: { type: 'boolean', required: true },
          durationMs: { type: 'integer', required: true },
          gates: { type: 'array', required: true, items: { type: 'string' } },
          next: { type: 'string', required: true },
        },
      },
      render: (_args, value) => [{ type: 'text', text: `exit ${value.exit}${value.timedOut ? ' (timed out)' : ''} in ${value.durationMs}ms\nlog: ${value.log}\ngates: ${value.gates.join(' ')}\nnext: ${value.next}` }],
    },
    async execute(args, exec) {
      const { cwd, stateRoot } = roots(exec, config)
      const task = resolveTask(args, stateRoot)
      const paths = taskPaths(stateRoot, task)
      const active = readActive(stateRoot) ?? {}
      const kind = args.kind ?? 'test'
      const stamp = new Date().toISOString().replaceAll(':', '').replaceAll('-', '').slice(0, 15)
      const label = (args.label ?? kind).replaceAll(/[^A-Za-z0-9._-]/g, '-')
      const logPath = join(paths.dir, 'logs', `${stamp}-${label}${args.arm ? `-${args.arm}` : ''}.log`)

      const repoDir = active.repo !== undefined ? resolve(String(active.repo)) : cwd
      const run = await runCapture({
        command: args.cmd,
        logPath,
        cwd: repoDir,
        timeoutMs: args.timeoutMs ?? config.runTimeoutMs,
        signal: exec.signal,
      })

      const head = headSha(repoDir)
      const branch = branchName(repoDir)
      appendEntry(
        paths,
        {
          task,
          kind,
          stage: args.stage,
          cmd: args.cmd,
          exit: run.exit,
          log: run.logPath,
          ...(args.arm !== undefined ? { arm: args.arm } : {}),
          ...(head !== null ? { head } : {}),
          ...(branch !== null ? { branch } : {}),
          note: run.timedOut ? 'timed out' : undefined,
        },
        { requireLog: config.requireLog },
      )
      const { evaluation } = loadTask(stateRoot, task)
      const summary = summarize(evaluation)
      return { exit: run.exit, log: run.logPath, timedOut: run.timedOut, durationMs: run.durationMs, gates: summary.gates, next: summary.next }
    },
  })

  tool({
    name: 'drill_diff',
    description: 'Stage 2b — turn the branch diff into a blast-radius evidence record: changed files against the base ref, the files that depend on them (c2g reverse edges, bounded depth), and a proposed manual-test checklist. Records `blast`; the edge-case gate still needs your own invariants.',
    parameters: {
      base: { type: 'string', description: 'Base ref; defaults to the task base (usually origin/main).' },
      depth: { type: 'integer', description: 'Ripple depth; defaults to the row configuration.' },
      task: { type: 'string', description: 'Task id; defaults to the active drill task.' },
      record: { type: 'boolean', description: 'Record the result as `blast` evidence (default true).' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          base: { type: 'string' },
          changed: { type: 'array', items: { type: 'string' } },
          deleted: { type: 'array', items: { type: 'string' } },
          ripple: { type: 'array', items: { type: 'string' } },
          checklist: { type: 'array', items: { type: 'string' } },
          recorded: { type: 'boolean' },
          note: { type: 'string' },
          gates: { type: 'array', items: { type: 'string' } },
          next: { type: 'string' },
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: `diff vs ${value.base}: ${value.changed.length} changed, ${value.deleted.length} deleted, ${value.ripple.length} dependent files\nchanged:\n${value.changed.join('\n') || '- none'}\ndependents:\n${value.ripple.join('\n') || '- none'}\nproposed checklist:\n${value.checklist.map(line => `- ${line}`).join('\n') || '- none'}${value.note ? `\nnote: ${value.note}` : ''}\ngates: ${value.gates.join(' ')}\nnext: ${value.next}`,
      }],
    },
    async execute(args, exec) {
      const { cwd, stateRoot } = roots(exec, config)
      const task = resolveTask(args, stateRoot)
      const paths = taskPaths(stateRoot, task)
      const active = readActive(stateRoot) ?? {}
      const repo = active.repo !== undefined ? resolve(String(active.repo)) : cwd
      const base = args.base ?? active.base ?? 'origin/main'
      const depth = args.depth ?? config.rippleDepth

      const { changed, deleted, error } = diffFiles(repo, base)
      const db = c2gDb(repo, config)
      const ripple = new Set()
      if (db !== null) {
        for (const file of changed.slice(0, 200)) {
          try {
            for (const row of dependentFiles(db, file, { depth })) {
              if (row.file && !changed.includes(row.file)) ripple.add(row.file)
            }
          } catch {
            // A file c2g never indexed simply contributes no dependents.
          }
        }
      }

      const checklist = [
        ...changed.slice(0, 20).map(file => `${file} — happy path still returns the documented result`),
        ...changed.slice(0, 10).map(file => `${file} — refusing/error path unchanged`),
        ...[...ripple].slice(0, 20).map(file => `${file} (dependent) — call site still compiles and behaves`),
      ]

      const shouldRecord = args.record !== false && error === null && changed.length > 0
      if (shouldRecord) {
        appendEntry(paths, {
          task,
          kind: 'blast',
          stage: 'blast',
          cmd: `git diff --name-only --diff-filter=ACMR ${base}...HEAD`,
          base,
          files: [...changed, ...ripple],
          text: `${changed.length} changed, ${ripple.size} dependent (depth ${depth})`.slice(0, 500),
        })
      }

      const { evaluation } = loadTask(stateRoot, task)
      const summary = summarize(evaluation)
      return {
        base,
        changed,
        deleted,
        ripple: [...ripple],
        checklist,
        recorded: shouldRecord,
        note: error ?? (changed.length === 0 ? 'no changed files against this base' : (db === null ? 'c2g cache unavailable: ripple not computed' : '')),
        gates: summary.gates,
        next: summary.next,
      }
    },
  })

  tool({
    name: 'drill_gate',
    description: 'Report which drill gates hold and which are still open. Call this before telling anyone the task is done: if ready is false, the required gates are named in `missing`.',
    parameters: { task: { type: 'string', description: 'Task id; defaults to the active drill task.' } },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          task: { type: 'string', required: true },
          ready: { type: 'boolean', required: true },
          stage: { type: 'string', required: true },
          missing: { type: 'array', required: true, items: { type: 'string' } },
          gates: { type: 'array', required: true, items: { type: 'string' } },
          next: { type: 'string', required: true },
        },
      },
      render: (_args, value) => [{ type: 'text', text: `${value.ready ? 'READY' : 'INCOMPLETE'} — stage ${value.stage}\n${value.gates.join('\n')}\nnext: ${value.next}` }],
    },
    async execute(args, exec) {
      const { stateRoot } = roots(exec, config)
      const task = resolveTask(args, stateRoot)
      const { evaluation } = loadTask(stateRoot, task)
      const summary = summarize(evaluation)
      return { task, ready: summary.ready, stage: summary.stage, missing: summary.missing, gates: summary.gates, next: summary.next }
    },
  })

  tool({
    name: 'drill_status',
    description: 'Show the active drill task, its gate state, and the last few evidence records. Use at the start of a drill session to recover where the work stopped.',
    parameters: { task: { type: 'string', description: 'Task id; defaults to the active drill task.' } },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          task: { type: 'string', required: true },
          records: { type: 'integer', required: true },
          recent: { type: 'array', required: true, items: { type: 'string' } },
          gates: { type: 'array', required: true, items: { type: 'string' } },
          next: { type: 'string', required: true },
        },
      },
      render: (_args, value) => [{ type: 'text', text: `${value.task}: ${value.records} records\ngates: ${value.gates.join(' ')}\nrecent:\n${value.recent.join('\n')}\nnext: ${value.next}` }],
    },
    async execute(args, exec) {
      const { stateRoot } = roots(exec, config)
      const task = resolveTask(args, stateRoot)
      const { entries, evaluation } = loadTask(stateRoot, task)
      const summary = summarize(evaluation)
      const recent = entries.slice(-6).map(e => `${e.ts} ${e.kind}${e.arm ? `/${e.arm}` : ''}${e.exit !== undefined ? ` exit=${e.exit}` : ''}${e.verdict ? ` ${e.verdict}` : ''}${e.cmd ? ` ${e.cmd.slice(0, 80)}` : ''}`)
      return { task, records: entries.length, recent, gates: summary.gates, next: summary.next }
    },
  })

  tool({
    name: 'drill_report',
    description: 'Render the drill report (gate table, test evidence with exit codes and log hashes, next step) and write it to <stateRoot>/<task>/report.md. Paste the result into the wiki test-phase report, or attach it to the PR.',
    parameters: { task: { type: 'string', description: 'Task id; defaults to the active drill task.' } },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          task: { type: 'string', required: true },
          path: { type: 'string', required: true },
          verdict: { type: 'string', required: true },
          markdown: { type: 'string', required: true },
        },
      },
      render: (_args, value) => [{ type: 'text', text: value.markdown }],
    },
    async execute(args, exec) {
      const { stateRoot } = roots(exec, config)
      const task = resolveTask(args, stateRoot)
      const { paths, entries, evaluation } = loadTask(stateRoot, task)
      const markdown = renderReport(task, entries, readActive(stateRoot) ?? {})
      writeReport(paths, markdown)
      return { task, path: paths.report, verdict: evaluation.ready ? 'READY' : `INCOMPLETE (${evaluation.missingForDone.join(', ')})`, markdown }
    },
  })

  tool({
    name: 'drill_review',
    description: 'Run Review 2: spawn a fresh-context, read-only reviewer subagent with a hard tool-call budget, record its verdict in the ledger bound to the reviewed commit, and report PASS/FAIL with blockers. The persona, tool policy and budget come from a role file (default `drill-auditor`: project .dsh/roles, then ~/.dsh/roles, then the bundled copy).',
    parameters: {
      task: { type: 'string', description: 'Task id; defaults to the active drill task.' },
      prompt: { type: 'string', description: 'What to audit: branch/worktree, base ref, and the scope of the change.' },
      role: { type: 'string', description: 'Role id to audit with; defaults to the row configuration (drill-auditor).' },
      model: { type: 'string', description: 'Optional reviewer model override.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          task: { type: 'string', required: true },
          verdict: { type: 'string', required: true },
          blockers: { type: 'array', items: { type: 'string' } },
          unverified: { type: 'array', items: { type: 'string' } },
          summary: { type: 'string', required: true },
          role: { type: 'string', required: true },
          roleSource: { type: 'string', required: true },
          head: { type: 'string' },
          gates: { type: 'array', items: { type: 'string' } },
          next: { type: 'string', required: true },
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: `Review 2 — ${value.verdict}${value.blockers.length ? ` (${value.blockers.length} blockers)` : ''} · role ${value.role} (${value.roleSource})${value.head ? ` · commit ${value.head.slice(0, 12)}` : ''}\n${value.summary}${value.blockers.length ? `\nblockers:\n- ${value.blockers.join('\n- ')}` : ''}${value.unverified.length ? `\nunverified:\n- ${value.unverified.join('\n- ')}` : ''}\ngates: ${value.gates.join(' ')}\nnext: ${value.next}`,
      }],
    },
    async execute(args, exec) {
      const { cwd, stateRoot } = roots(exec, config)
      const task = resolveTask(args, stateRoot)
      const paths = taskPaths(stateRoot, task)
      const subagents = ctx.get('subagents')
      if (subagents === undefined) throw new Error('drill: the subagents service is not mounted in this profile; record the review with drill_record instead')

      const roleId = args.role ?? config.defaultRole
      const role = resolveRole(roleId, { cwd, dshHome: process.env.DSH_HOME, bundledDir: join(HERE, 'roles') })
      const persona = role && role.body.length > 0 ? role.body : FALLBACK_PERSONA
      const roleSource = role?.source ?? 'builtin'

      const visibleNames = typeof ctx.tools?.schemas === 'function'
        ? ctx.tools.schemas(exec.agent).map(schema => schema.name)
        : FALLBACK_TOOLS
      const toolFilter = (role ? roleToolFilter(role, visibleNames) : undefined) ?? roleToolFilter({ data: { tools: FALLBACK_TOOLS } }, visibleNames)

      const roleModel = typeof role?.data.model === 'string' && role.data.model.length > 0 ? role.data.model : null
      const model = args.model ?? roleModel ?? config.model
      const roleProvider = typeof role?.data.provider === 'string' && role.data.provider.length > 0 ? role.data.provider : null
      const provider = roleProvider ?? config.provider
      const roleMax = role ? roleBudget(role) : null
      const budget = roleMax !== null && roleMax > 0 ? roleMax : config.maxReviewToolCalls

      const controller = new AbortController()
      const onAbort = () => controller.abort(exec.signal.reason)
      if (exec.signal.aborted) controller.abort('upstream')
      else exec.signal.addEventListener('abort', onAbort, { once: true })

      const active = readActive(stateRoot) ?? {}
      const repo = active.repo !== undefined ? resolve(String(active.repo)) : cwd
      const head = headSha(repo)
      const task_text = args.prompt ?? `Audit the drill branch for task ${task}. repo=${repo} base=${active.base ?? 'origin/main'}${head ? ` head=${head}` : ''}. Report the verdict table, blockers and unverified items.`
      let run
      let used = 0

      const onEvent = (session, event) => {
        if (run === undefined || session.id !== run.id) return
        if (event.type !== 'tool/call') return
        used += 1
        if (budget > 0 && used > budget) controller.abort('review-tool-budget')
      }
      ctx.on('session/event', onEvent, { global: true })

      try {
        try {
          run = await subagents.start(provider, {
            label: `drill-review-${task}`,
            prompt: [{ type: 'text', text: task_text }],
            parent: exec.agent,
            signal: controller.signal,
            persona,
            ...(toolFilter ? { toolFilter } : {}),
            outputSchema: REVIEW_SCHEMA,
            ...(model ? { agentOptions: { model } } : {}),
          })
        } catch (error) {
          throw new Error(`drill: could not start the reviewer subagent (provider "${provider}"): ${error instanceof Error ? error.message : String(error)}`)
        }

        const result = await run.result
        const structured = result.structured
        const verdict = structured?.verdict === 'PASS' ? 'PASS' : 'FAIL'
        const blockers = Array.isArray(structured?.blockers) ? structured.blockers.map(String) : []
        const unverified = Array.isArray(structured?.unverified) ? structured.unverified.map(String) : []
        const summary = String(structured?.summary ?? `stopReason=${result.stopReason} tools=${used}${budget > 0 && used > budget ? ' (budget exceeded)' : ''}`)

        const artifact = join(paths.artifacts, `review-${new Date().toISOString().replaceAll(':', '').slice(0, 15)}.md`)
        mkdirSync(paths.artifacts, { recursive: true })
        writeFileSync(artifact, `# Review 2 — ${task}\n\nverdict: ${verdict}\nrole: ${roleId} (${roleSource}) · ${role?.path ?? 'builtin persona'}\nprovider: ${provider}${model ? ` · model: ${model}` : ''}\ntools: ${toolFilter ? toolFilter.allow.join(', ') : 'unrestricted'}\nstopReason: ${result.stopReason}\ntoolCalls: ${used}/${budget || 'unlimited'}${head ? `\nhead: ${head}` : ''}\n\n## Summary\n\n${summary}\n\n## Blockers\n\n${blockers.length ? blockers.map(b => `- ${b}`).join('\n') : '- none'}\n\n## Unverified\n\n${unverified.length ? unverified.map(u => `- ${u}`).join('\n') : '- none'}\n`, 'utf8')

        appendEntry(paths, {
          task,
          kind: 'review',
          stage: 'review',
          verdict,
          blockers: blockers.length,
          text: summary,
          log: artifact,
          cmd: `subagent:${provider}${model ? `/${model}` : ''} role=${roleId}`,
          role: roleId,
          ...(head !== null ? { head } : {}),
        }, { requireLog: config.requireLog })

        const { evaluation } = loadTask(stateRoot, task)
        const gateSummary = summarize(evaluation)
        return {
          task,
          verdict,
          blockers,
          unverified,
          summary,
          role: roleId,
          roleSource,
          ...(head !== null ? { head } : {}),
          gates: gateSummary.gates,
          next: gateSummary.next,
        }
      } finally {
        exec.signal.removeEventListener('abort', onAbort)
        if (run !== undefined) {
          try {
            await run.dispose()
          } catch {
            // Disposal is best effort: a failed dispose must not replace the verdict.
          }
        }
      }
    },
  })

  tool({
    name: 'drill_setup',
    description: 'Install the drill skill and the Review 2 auditor role into the DSH home so agents and role catalogs can see them: ~/.dsh/skills/drill/SKILL.md and ~/.dsh/roles/drill-auditor.md. Idempotent; reports the paths it wrote.',
    parameters: { dshHome: { type: 'string', description: 'Override the DSH home (defaults to $DSH_HOME or ~/.dsh).' } },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          skill: { type: 'string', required: true },
          role: { type: 'string', required: true },
        },
      },
      render: (_args, value) => [{ type: 'text', text: `skill: ${value.skill}\nrole:  ${value.role}` }],
    },
    async execute(args) {
      const home = args.dshHome ?? process.env.DSH_HOME ?? join(homedir(), '.dsh')
      const skillDir = join(home, 'skills', 'drill')
      const roleDir = join(home, 'roles')
      mkdirSync(skillDir, { recursive: true })
      mkdirSync(roleDir, { recursive: true })
      const skill = join(skillDir, 'SKILL.md')
      const role = join(roleDir, 'drill-auditor.md')
      copyFileSync(join(HERE, 'skills', 'drill', 'SKILL.md'), skill)
      copyFileSync(join(HERE, 'roles', 'drill-auditor.md'), role)
      return { skill, role }
    },
  })

  if (config.reminder) {
    ctx.on('agent/turn-stopping', async ({ agent }) => {
      try {
        const cwd = agent?.session?.header?.cwd
        if (cwd === undefined) return
        const stateRoot = resolve(cwd, config.stateRoot)
        const active = readActive(stateRoot)
        if (active?.task === undefined) return
        const { evaluation } = loadTask(stateRoot, active.task)
        if (evaluation.ready) return
        const signature = evaluation.missingForDone.join(',')
        const key = agent.session.id
        if (reminded.get(key) === signature) return
        reminded.set(key, signature)
        const text = [
          `[dsh-drill] task ${active.task} still has open gates: ${signature}.`,
          `Open gate detail: ${evaluation.next}`,
          'Do not report the work as finished until `drill_gate` returns ready. Required evidence: red proof (test fails on base), green proof (test passes with the fix), a clean preflight run, and a Review 2 verdict of PASS with 0 blockers.',
        ].join(' ')
        agent.inject(createUserMessage({ content: [{ type: 'text', text }], source: { kind: 'plugin', plugin: 'dsh-drill', form: 'notice', summary: 'drill gates open' } }))
      } catch {
        // The reminder is advisory: a failure here must never break the turn close.
      }
    })
  }

  ctx.logger?.info?.(`dsh-drill: ${KINDS.length} evidence kinds, ${STAGES.length} stages, reminder=${config.reminder}`)
}

export { gateTable }

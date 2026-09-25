import type { Plugin, PluginInput } from "@kilocode/plugin"
import { tool } from "@kilocode/plugin/tool"
import { spawnSync } from "node:child_process"
import { appendFileSync } from "node:fs"

/**
 * c2g — straight code2graph access for Kilo, bypassing Maya cortex.
 *
 * DB-less: shells out to the c2g binary through the shared stdlib core
 * /home/maya/scripts/c2g_tools.py (same core the Hermes plugin uses). No
 * NodeDB, no PG. The same questions can also be asked through
 * cortex_codegraph_* (NodeDB code graph) and knowledge-graph_* (PG store)
 * when those are warm — this plugin is the direct path.
 *
 *   tools: c2g_status, c2g_index, c2g_symbols, c2g_def, c2g_blast_radius,
 *          c2g_diff_impact, c2g_query, c2g_raw
 */

const CORE = process.env.C2G_CORE ?? "/home/maya/scripts/c2g_tools.py"
const LOG = "/home/maya/logs/c2g.log"
const MAX_RENDER = 8_000
const QUERY_TIMEOUT_MS = 200_000
const INDEX_TIMEOUT_MS = 900_000

type Json = Record<string, unknown>

function log(line: string): void {
  try {
    appendFileSync(LOG, `${new Date().toISOString()} ${line}\n`)
  } catch {}
}

function core(cmd: string, payload: Json = {}, timeoutMs = QUERY_TIMEOUT_MS): Json | null {
  try {
    const res = spawnSync("python3", [CORE, cmd, "--stdin"], {
      input: JSON.stringify(payload),
      encoding: "utf-8",
      timeout: timeoutMs,
      maxBuffer: 8 * 1024 * 1024,
    })
    if (res.error) {
      log(`core-fail cmd=${cmd} err=${res.error.message}`)
      return null
    }
    if (res.status !== 0 && !res.stdout) {
      log(`core-exit cmd=${cmd} status=${res.status} stderr=${String(res.stderr || "").slice(0, 200)}`)
      return null
    }
    return JSON.parse(res.stdout) as Json
  } catch (e) {
    log(`core-crash cmd=${cmd} err=${e instanceof Error ? e.message : String(e)}`)
    return null
  }
}

function clip(text: string): string {
  if (text.length <= MAX_RENDER) return text
  return `${text.slice(0, MAX_RENDER)}\n…[clipped ${text.length - MAX_RENDER} chars]`
}

function body(d: Json): string {
  const parsed = d.parsed
  if (parsed) return clip(JSON.stringify(parsed, null, 1))
  const out = String(d.stdout || "").trim()
  const err = String(d.stderr || "").trim()
  return clip(out || err || "_(empty output)_")
}

function render(d: Json | null): string {
  if (!d) return "❌ c2g core unreachable (python3 /home/maya/scripts/c2g_tools.py)."
  if (d.tool === "blast_radius" && d.parts) {
    const parts = d.parts as Record<string, Json>
    let out = `# c2g_blast_radius — \`${String(d.name)}\`\n`
    for (const [name, sub] of Object.entries(parts)) {
      const ok = sub.ok ? "ok" : `fail(${String(sub.code)})`
      out += `\n## ${name} — ${ok} (${String(sub.elapsed_ms)}ms)\n${body(sub)}\n`
    }
    return out
  }
  if (d.tool === "error" && Array.isArray(d.frames)) {
    const frames = d.frames as Json[]
    const resolved = typeof d.resolved === "number" ? d.resolved : 0
    let out = `# c2g_error — ${resolved}/${frames.length} frames resolved\n`
    if (d.message) out += `message: ${String(d.message)}\n`
    if (d.root) out += `root: \`${String(d.root)}\`\n`
    out += "\n"
    for (const f of frames) {
      const sym = (f.symbol ?? {}) as Json
      const where = `${String(f.file)}:${String(f.line)}`
      const hint = f.symbol_hint !== undefined && sym.name !== undefined && !String(f.symbol_hint).endsWith(`::${String(sym.name)}`)
        ? ` _(backtrace: ${String(f.symbol_hint)})_`
        : ""
      if (f.external) out += `- ${where} _(external)_\n`
      else if (sym.name !== undefined) out += `- ${where} → **${String(sym.name)}** [${String(sym.kind)}] via ${String(f.source)}${hint}\n`
      else out += `- ${where} _(unresolved${f.error ? `: ${String(f.error)}` : ""})_\n`
    }
    if (Array.isArray(d.sources) && d.sources.length > 0) out += `\nresolved via: ${(d.sources as string[]).join(", ")}\n`
    return out
  }
  const head = d.ok
    ? `ok (${String(d.elapsed_ms)}ms)`
    : `fail${d.code !== undefined && d.code !== null ? ` code=${String(d.code)}` : ""}${d.error ? ` ${String(d.error)}` : ""}`
  let out = `# c2g_${String(d.tool || "run")} — ${head}\n`
  if (d.root) out += `root: \`${String(d.root)}\`\n`
  out += `\n${body(d)}\n`
  if (d.truncated) out += `\n_Output truncated by the core (40 KB cap). Narrow the query._\n`
  return out
}

const rootArg = tool.schema.string().optional().describe("Repository root (default: C2G_ROOT or cwd)")

export const C2gPlugin: Plugin = async (_input: PluginInput) => {
  return {
    tool: {
      c2g_status: tool({
        description:
          "Readiness of the local code2graph index for a repository (dbless, direct c2g binary). Answers: binary found, index state, known omissions. Run this first when unsure.",
        args: { root: rootArg },
        async execute(args) {
          return render(core("run", { tool: "status", root: args.root }))
        },
      }),

      c2g_index: tool({
        description:
          "Build or refresh the local code2graph index for a repository (--trust-mtime). Heavy: run when the CPU is free. Everything else answers from this cache.",
        args: {
          root: rootArg,
          force: tool.schema.boolean().optional().describe("Ignore the existing index and rebuild"),
        },
        async execute(args) {
          return render(core("run", { tool: "index", root: args.root, force: args.force }, INDEX_TIMEOUT_MS))
        },
      }),

      c2g_symbols: tool({
        description: "List indexed symbols, optionally filtered by a name query (dbless).",
        args: {
          query: tool.schema.string().optional().describe("Name filter, e.g. 'coerce'"),
          root: rootArg,
        },
        async execute(args) {
          return render(core("run", { tool: "symbols", query: args.query, root: args.root }))
        },
      }),

      c2g_def: tool({
        description: "Definition site of one symbol: file, line, kind (dbless).",
        args: {
          name: tool.schema.string().describe("Exact symbol name"),
          root: rootArg,
        },
        async execute(args) {
          return render(core("run", { tool: "def", name: args.name, root: args.root }))
        },
      }),

      c2g_error: tool({
        description:
          "Stage 1 from a failure signal: parse a panic, backtrace, compiler diagnostic or traceback into file:line frames and resolve each frame to its symbol — per-project c2g cache, then the merged ~/Embed/c2g store, then the c2g binary. Use this before guessing where a bug lives.",
        args: {
          text: tool.schema.string().describe("Raw failure text: panic, backtrace, compiler diagnostics, or a log excerpt"),
          root: rootArg,
          max_resolve: tool.schema.number().int().optional().describe("Cap on frames resolved against the graph (default 12)"),
        },
        async execute(args) {
          return render(core("run", { tool: "error", text: args.text, root: args.root, max_resolve: args.max_resolve }))
        },
      }),

      c2g_blast_radius: tool({
        description:
          "Blast radius of one symbol: callers, callees and impact in one call (dbless). The stage-2 tool of the five-stage survey.",
        args: {
          name: tool.schema.string().describe("Exact symbol name"),
          root: rootArg,
        },
        async execute(args) {
          return render(core("run", { tool: "blast_radius", name: args.name, root: args.root }))
        },
      }),

      c2g_diff_impact: tool({
        description:
          "Impact of the current diff against a base revision: changed files -> affected symbols and callers (dbless). The incremental-sync tool.",
        args: {
          base: tool.schema.string().optional().describe("Base revision, e.g. origin/main or HEAD~1"),
          depth: tool.schema.number().optional().describe("Traversal depth (default 2)"),
          root: rootArg,
        },
        async execute(args) {
          return render(core("run", { tool: "diff_impact", base: args.base, depth: args.depth, root: args.root }))
        },
      }),

      c2g_query: tool({
        description:
          "One code2graph query: usages, references, imports or module-deps (dbless). Use c2g_blast_radius for callers/callees/impact.",
        args: {
          tool: tool.schema
            .enum(["usages", "references", "imports", "module_deps"])
            .describe("Which query to run"),
          target: tool.schema.string().describe("Symbol name (usages/references) or file path (imports/module_deps)"),
          root: rootArg,
        },
        async execute(args) {
          return render(core("run", { tool: args.tool, target: args.target, root: args.root }))
        },
      }),

      c2g_raw: tool({
        description:
          "Run the c2g CLI with explicit argv (dbless escape hatch). Example: ['status', '--json']. Prefer the named tools; arguments are passed verbatim.",
        args: {
          argv: tool.schema.array(tool.schema.string()).describe("c2g arguments without the binary name"),
          root: rootArg,
        },
        async execute(args) {
          return render(core("run", { tool: "raw", argv: args.argv, root: args.root }))
        },
      }),
    },
  }
}

export default C2gPlugin

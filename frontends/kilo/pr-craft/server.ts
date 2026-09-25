import type { Plugin, PluginInput } from "@kilocode/plugin"
import { tool } from "@kilocode/plugin/tool"
import { spawnSync } from "node:child_process"
import { appendFileSync } from "node:fs"

/**
 * pr-craft — PR & code-review craft for Kilo.
 *
 * Logic lives once, in Python: /home/maya/scripts/pr_craft.py (stdlib only, shared with
 * the Hermes plugin ~/.hermes/plugins/pr-craft). Payload goes over stdin as JSON so no
 * shell escaping is involved.
 *
 *   tools     : pr_checklist, pr_lint_description, pr_lint_comment, pr_lint_diff, pr_review_plan
 *   injection : chat.message detects PR/review intent -> the system transform for that turn
 *               injects the distilled checklist (max 2x per session).
 */

const CORE = process.env.PR_CRAFT_CORE ?? "/home/maya/scripts/pr_craft.py"
const LOG = "/home/maya/logs/pr-craft.log"
const MAX_INJECT = 2
const TTL = 6 * 3600_000

type Json = Record<string, unknown>

function log(line: string): void {
  try {
    appendFileSync(LOG, `${new Date().toISOString()} ${line}\n`)
  } catch {}
}

function core<T = Json>(cmd: string, payload: Json = {}, extra: string[] = []): T | null {
  try {
    const res = spawnSync("python3", [CORE, cmd, ...extra, "--stdin"], {
      input: JSON.stringify(payload),
      encoding: "utf-8",
      timeout: 10_000,
    })
    if (res.error) {
      log(`core-fail cmd=${cmd} err=${res.error.message}`)
      return null
    }
    if (res.status !== 0) {
      log(`core-exit cmd=${cmd} status=${res.status} stderr=${String(res.stderr || "").slice(0, 200)}`)
      return null
    }
    return JSON.parse(res.stdout) as T
  } catch (e) {
    log(`core-crash cmd=${cmd} err=${e instanceof Error ? e.message : String(e)}`)
    return null
  }
}

function partsText(parts: unknown): string {
  if (!Array.isArray(parts)) return ""
  const out: string[] = []
  for (const part of parts) {
    const p = part as { type?: string; text?: string; content?: string }
    if (typeof p?.text === "string" && (p.type === "text" || p.type === undefined)) out.push(p.text)
    else if (typeof p?.content === "string") out.push(p.content)
  }
  return out.join("\n").trim()
}

function icon(level: string): string {
  if (level === "blocker") return "🛑"
  if (level === "warn") return "⚠️"
  if (level === "nit") return "🔹"
  return "ℹ️"
}

function bullets(rows: { level: string; rule: string; msg: string }[] | undefined, key: "msg" | "rule" = "msg"): string {
  if (!rows?.length) return "_none_"
  return rows.map((r) => `- ${icon(r.level)} **${r.rule}** — ${r[key]}`).join("\n")
}

// ---------------------------------------------------------------- renderers

function renderChecklist(d: Json | null): string {
  if (!d) return "❌ pr-craft core unreachable (python3 /home/maya/scripts/pr_craft.py)."
  const sections = (d.sections || {}) as Record<string, string[]>
  const order = ["flow", "author", "reviewer"]
  let out = `# PR/code-review checklist (role=${String(d.role)}, ${String(d.count)} items)\n`
  for (const name of order) {
    const items = sections[name]
    if (!items) continue
    out += `\n### ${name.toUpperCase()}\n${items.map((i) => `- ${i}`).join("\n")}\n`
  }
  return out
}

function renderDesc(d: Json | null): string {
  if (!d) return "❌ pr-craft core unreachable."
  const issues = (d.issues || []) as { level: string; rule: string; msg: string }[]
  const good = (d.good || []) as string[]
  let out = `# pr_lint_description — ${String(d.verdict)} (score ${String(d.score)}/100)\n`
  out += `\n**Subject:** ${String(d.subject || "(none)")}\n`
  out += `\n### Issues\n${bullets(issues)}\n`
  if (good.length) out += `\n### Already good\n${good.map((g) => `- ✅ ${g}`).join("\n")}\n`
  out += `\n_Reminder: subject ~50 chars, imperative; body answers **why**; include steps to test._\n`
  return out
}

function renderComment(d: Json | null): string {
  if (!d) return "❌ pr-craft core unreachable."
  const issues = (d.issues || []) as { level: string; rule: string; msg: string }[]
  let out = `# pr_lint_comment — ${String(d.verdict)}`
  out += ` (blockers ${String(d.blockers)}, warns ${String(d.warns)})\n`
  out += `\n### Issues\n${bullets(issues)}\n`
  const suggested = d.suggested ? String(d.suggested) : ""
  if (suggested) out += `\n### Suggested rewrite\n> ${suggested.split("\n").join("\n> ")}\n`
  const good = (d.good || []) as string[]
  if (good.length) out += `\n### Already good\n${good.map((g) => `- ✅ ${g}`).join("\n")}\n`
  out += `\n_Ask - explain - suggest. Talk about the code, never the developer. Label severity._\n`
  return out
}

function renderDiff(d: Json | null): string {
  if (!d) return "❌ pr-craft core unreachable."
  if (d.status === "unparsed-diff")
    return `# pr_lint_diff — ${String(d.note)}\n\nParsed summary: ${String(d.files)} files, +${String(d.added)}/-${String(d.removed)}.\n`
  const issues = (d.issues || []) as { level: string; rule: string; msg: string }[]
  const main = (d.main_files || []) as { file: string; added: number; removed: number }[]
  const tests = (d.tests_included || []) as string[]
  let out = `# pr_lint_diff — **${String(d.verdict)}**\n\n`
  out += `| Metric | Value |\n|---|---|\n`
  out += `| Files | ${String(d.files)} |\n| Churn | ${String(d.churn)} lines (+${String(d.added)}/-${String(d.removed)}) |\n`
  out += `| Tests in PR | ${tests.length ? tests.join(", ") : "none"} |\n`
  out += `\n### Gate\n${bullets(issues)}\n`
  if (main.length) out += `\n### Read these first\n${main.map((f) => `- \`${f.file}\` (+${f.added}/-${f.removed})`).join("\n")}\n`
  out += `\n_~100 lines is comfortable, ~1000 is too large. Tests travel with the code._\n`
  return out
}

function renderPlan(d: Json | null): string {
  if (!d) return "❌ pr-craft core unreachable."
  const passes = (d.passes || []) as string[]
  const notes = (d.notes || []) as string[]
  let out = `# pr_review_plan\n\n### Passes\n${passes.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n`
  out += `\n### Notes\n${notes.map((n) => `- ${n}`).join("\n")}\n`
  out += `\n---\n\n${renderDiff((d.gate || null) as Json | null)}`
  return out
}

// ------------------------------------------------------------------- plugin

export const PrCraftPlugin: Plugin = async (_input: PluginInput) => {
  // sessionID -> detected role awaiting injection; sessionID -> injections done
  const pending = new Map<string, { role: string; ts: number }>()
  const counts = new Map<string, number>()

  function prune(): void {
    const cutoff = Date.now() - TTL
    for (const [sid, hit] of pending) if (hit.ts < cutoff) pending.delete(sid)
    if (counts.size > 200) {
      for (const [sid, hit] of pending) if (hit.ts < cutoff) counts.delete(sid)
    }
  }

  return {
    "chat.message": async (input, output) => {
      try {
        const text = partsText(output?.parts)
        if (text.length < 6) return
        const det = core<{ hit?: boolean; role?: string; signals?: string[] }>("detect", { text })
        if (!det?.hit) return
        pending.set(String(input?.sessionID || "__global__"), { role: det.role || "reviewer", ts: Date.now() })
        log(`signal session=${String(input?.sessionID)} role=${det.role} signals=${(det.signals || []).join(",")}`)
      } catch (e) {
        log(`chat.message-fail err=${e instanceof Error ? e.message : String(e)}`)
      }
    },

    "experimental.chat.system.transform": async (input, output) => {
      try {
        prune()
        const sid = String(input?.sessionID || "__global__")
        const hit = pending.get(sid)
        if (!hit) return
        pending.delete(sid)
        const used = counts.get(sid) || 0
        if (used >= MAX_INJECT) return
        const blk = core<{ inject?: boolean; context?: string }>("context", {}, ["--role", hit.role])
        if (!blk?.inject || !blk.context) return
        counts.set(sid, used + 1)
        output.system.push(blk.context)
        log(`inject session=${sid} role=${hit.role} n=${used + 1}`)
      } catch (e) {
        log(`transform-fail err=${e instanceof Error ? e.message : String(e)}`)
      }
    },

    tool: {
      pr_checklist: tool({
        description:
          "PR/code-review checklist distilled from 6 review guides (Google eng-practices, mawrkus, thoughtbot, book-pr, Pro Git, first-contributions). Use before authoring a PR or starting a review.",
        args: {
          role: tool.schema
            .enum(["both", "author", "reviewer"])
            .optional()
            .describe("Whose checklist: both (default), author, reviewer"),
        },
        async execute(args) {
          const role = (args.role as string) || "both"
          return renderChecklist(core("checklist", {}, ["--role", role]))
        },
      }),

      pr_lint_description: tool({
        description:
          "Lint a PR title + description against the distilled rules (subject length/imperative, body explains why, issue ref, steps to test, screenshots for UI changes, 'clean up later' trap). Returns blockers, warnings, nits and a score.",
        args: {
          title: tool.schema.string().describe("PR title (subject line)"),
          body: tool.schema.string().optional().describe("PR description body; omit to lint the title only"),
        },
        async execute(args) {
          const text = args.body ? `${args.title}\n\n${args.body}` : String(args.title)
          return renderDesc(core("lint-desc", { text }))
        },
      }),

      pr_lint_comment: tool({
        description:
          "Lint a draft review comment for tone and usefulness: blame/judgment/diminishing words, imperative demands, missing severity label (Nit:/Optional:/FYI:), missing rationale or alternative, untested code suggestions. Returns a suggested rewrite.",
        args: {
          text: tool.schema.string().describe("The draft comment text"),
          role: tool.schema
            .enum(["reviewer", "author"])
            .optional()
            .describe("Author of the comment (default reviewer)"),
        },
        async execute(args) {
          const extra = ["--role", (args.role as string) || "reviewer"]
          return renderComment(core("lint-comment", { text: args.text }, extra))
        },
      }),

      pr_lint_diff: tool({
        description:
          "Gate a diff/PR size before review: churn and file count verdict (ok/warn/split), whether tests travel with the code, mixed-refactor detection, and the main files to read first. Feed it `git diff`, `git diff --cached` or a diffstat summary.",
        args: {
          diff: tool.schema.string().describe("Unified diff or diffstat text"),
        },
        async execute(args) {
          return renderDiff(core("lint-diff", { text: args.diff }))
        },
      }),

      pr_review_plan: tool({
        description:
          "Build the 3-pass review plan for a diff (broad view -> main parts -> the rest) plus the size gate, main files to read first and reminders about severity labels and positive feedback.",
        args: {
          diff: tool.schema.string().describe("Unified diff or diffstat text"),
        },
        async execute(args) {
          return renderPlan(core("plan", { text: args.diff }))
        },
      }),
    },
  }
}

export default PrCraftPlugin

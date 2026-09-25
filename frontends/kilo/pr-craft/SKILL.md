---
name: pr-craft
description: Use when authoring a PR, writing review comments, or reviewing a diff. Distilled 6-guide PR/code-review workflow plus the pr-craft tools (checklist, description/comment/diff linters).
version: 1.0.0
tags:
  - domain:code-review
  - domain:pull-request
  - ecosystem:kilo
  - activation:keyword
triggers:
  - review this PR
  - my PR description
  - review comment
  - is this PR too big
  - code review
  - pull request
  - LGTM
  - Nit:
---

# PR Craft

Distilled from 6 guides (Google eng-practices, mawrkus, thoughtbot, book-pr, Pro Git, first-contributions).
Full synthesis: `~/Bumi-Hijau/inbox/pr-guides/DISTILLED-pr-review-workflow.md`. Converted corpus: `~/Bumi-Hijau/inbox/pr-guides/md/`.

One logic core, two frontends:
`~/scripts/pr_craft.py` (stdlib only) ← `~/.kilo/plugins/pr-craft/server.ts` and `~/.hermes/plugins/pr-craft/`.

## Tools

| Tool | Args | Answers |
|---|---|---|
| `pr_checklist` | `role` (both/author/reviewer) | the checklist for the side you are on |
| `pr_lint_description` | `title`, `body` | subject length/imperative, body explains *why*, issue ref, steps to test, screenshot for UI, "clean up later" trap |
| `pr_lint_comment` | `text`, `role` | blame/judgment/diminishing words, demands, missing severity label or rationale, untested suggestions, plus a suggested rewrite |
| `pr_lint_diff` | `diff` | size verdict (ok/warn/split), tests travel with the code, mixed-refactor detection, main files to read first |
| `pr_review_plan` | `diff` | the 3-pass review plan + the size gate for that diff |

CLI equivalent (works anywhere, payload over stdin):

```bash
git diff | python3 ~/scripts/pr_craft.py lint-diff --stdin
python3 ~/scripts/pr_craft.py lint-comment --stdin <<< '{"text":"You should just rename this."}'
python3 ~/scripts/pr_craft.py selftest          # 10-case regression check
```

## Injection

Both plugins detect PR/review intent in the user message and inject the checklist automatically
(max 2x per session): Kilo via `chat.message` → `experimental.chat.system.transform`, Hermes via
`pre_llm_call`. Hermes also exposes `/pr checklist|desc|comment|diff`. Log: `~/logs/pr-craft.log`.

## Workflow (compressed)

Author: split into one self-contained change (~100 lines, refactors separate, tests included) →
draft PR early → self-review the rendered diff → description with task ref, what, **why**, steps to
test → CI green → 2-3 reviewers deliberately chosen → answer every comment, push feedback rounds as
isolated commits → merge when confident.

Reviewer: read the description, decide if the change should exist → 3 passes (broad view, main parts,
the rest) → send design comments immediately → every line with context → label severity → name one
good thing → reply within one business day without interrupting deep work → follow up and approve once
the contract is met.

Escalation: 3-4 replies without progress → live conversation, then post the summary back → third party
→ team/manager. Never let a PR sit because two people disagree.

## Hits that decide most reviews

- Standard is code health improving, not perfect. Approve when clearly better.
- Small PR beats perfect PR. Reviewers may reject on size alone.
- Facts beat opinions. Style guide beats taste. Everything else is a `Nit:`.
- Comments about the code, never the developer.
- "Clean up later" does not happen: fix now, or file an issue assigned to the author.
- If the reviewer did not understand the code, fix the code, not the PR thread.
- Tests travel with the code, same PR.
- Response speed beats total review duration.

## Pitfalls

- Edit `~/scripts/pr_craft.py` for logic changes. The plugins are thin frontends; patching them
  separately causes drift.
- Plugin changes load at process start: Kilo needs a restart, Hermes needs `/reset`.
- Kilo tool `execute` must be `async` (signature is `(args, ctx) => Promise<ToolResult>`).
- Never pass diff text as a CLI argument — `Argument list too long`. Use `--stdin`.
- Keep the injection cap. Unconditional injection on every turn burns context in long sessions.
- `~/.config/kilo/kilo.jsonc` is JSONC: after editing, strip comments and validate before restarting Kilo.

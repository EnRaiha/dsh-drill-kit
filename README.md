# dsh-drill

Evidence-gated bug-fix drill for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`).

One issue, one worktree, one evidence chain. Each drill stage leaves a record in a per-task ledger; `drill_gate` refuses a completion claim that has no proof behind it. Red and green proofs are produced by **running the test command here**, never by writing an assertion into a file.

Built for the NodeDB drill (`red → green → fmt/clippy → preflight → commit → Review 2 → PR`), and derived from a source review of eleven existing DSH plugins — see `../drill-plugins/REVIEW-20260925.md`.

## Stages and gates

| Stage | Gate | Evidence required |
|---|---|---|
| 1 Localize | `localize` | one `locate` record naming file:line (usually via `drill_locate` over the local code2graph cache) |
| 2 Blast radius | `blast` | one `blast` record with callers/callees/affected files (`drill_blast`), and/or the branch diff plus its dependents (`drill_diff`) |
| 3 Edge cases | `edge` | one `edge` record stating the invariants that must fail — `drill_diff` proposes a checklist, you supply the invariants |
| 4 Surgical patch | **`red`** | a `test` run with `arm=base` that **fails**, with a captured log |
| | **`green`** | a `test` run with `arm=fix` that **passes**, with a captured log |
| | **`hygiene`** | a `hygiene` run (fmt/clippy/preflight) with `exit 0` |
| 5 Review | **`review`** | a `review` record with `verdict=PASS`, `blockers=0`, **and the same commit as the green proof**; a later FAIL or a moved HEAD reopens the gate |
| 6 PR | `pr` | a `pr` record pointing at the PR body file |

`red`, `green`, `hygiene` and `review` are **required** before `drill_gate` reports `ready`. The rest are advisory gates that describe where the work stopped.

## Tools

| Tool | What it does |
|---|---|
| `drill_start` | open a task: ledger + `active.json` + gate report |
| `drill_locate` | stage 1 over the local c2g cache: symbol name, or `file`+`line` from a stack frame → exact definition. Records `locate`. |
| `drill_blast` | stage 2 over the same cache: call sites, transitive callers to a bounded depth, callees. Records `blast`. |
| `drill_diff` | stage 2b from git: changed files against the base ref, deleted files, the files that depend on them (c2g reverse edges), and a proposed manual-test checklist. Records `blast`. |
| `drill_run` | run a command, stream output into `.drill/<task>/logs/`, hash the log, record the exit code **and the commit it ran on**. This is the only way to produce a test proof. |
| `drill_record` | record non-command evidence: locate/blast/edge/review/pr/note |
| `drill_gate` | which gates hold, which are open, and what the next step is |
| `drill_status` | active task, record count, last records, gate state |
| `drill_report` | render the report (gate table + test evidence with exit codes and log hashes) and write `.drill/<task>/report.md` |
| `drill_review` | spawn Review 2: fresh-context, read-only reviewer subagent driven by a **role file** (`drill-auditor` by default — project `.dsh/roles`, then `~/.dsh/roles`, then bundled), with a hard tool-call budget; records the verdict bound to the reviewed commit |
| `drill_setup` | install the bundled skill and auditor role into `~/.dsh/skills/drill/` and `~/.dsh/roles/` |

The plugin also registers one `agent/turn-stopping` listener: while an active task has open required gates, it injects a one-line reminder naming them. It is advisory — it can never block a turn close.

## Install

```sh
# from this checkout (dev): link into a profile, then boot
dsh plugin --profile <profile> add /home/maya/projects/dsh-drill
node apps/cli/lib/cli.js <profile> --dump-config | grep -A2 'id: drill'
```

The plugin row ships in `cordis.patch.yml` as one entry (`id: drill`, `name: dsh-drill`); installing the bundle appends `dsh-drill` to the profile's `dsh.profile.bundles` automatically.

**Dev-mode resolution.** A `link:` install resolves `@deepseek-ai/*` imports from the *link target*, which escapes `$DSH_HOME/profiles/node_modules` (the host's module fallback) — so a linked checkout needs the host packages reachable from this directory:

```sh
mkdir -p node_modules/@deepseek-ai
H=/home/maya/projects/deepseek-harness
ln -sfn $H/packages/core/tools       node_modules/@deepseek-ai/dsh-tools
ln -sfn $H/packages/llm/llm          node_modules/@deepseek-ai/dsh-llm
ln -sfn $H/packages/subagent/subagent node_modules/@deepseek-ai/dsh-subagent
ln -sfn $H/vendor/schemastery        node_modules/@deepseek-ai/schemastery
```

A normal registry/tarball install does not need this: the package lands inside the profile tree, where the host fallback is reachable.

## Configuration

Every key has a schema default; override by re-stating the row's whole config in your profile patch.

| Key | Default | Meaning |
|---|---|---|
| `stateRoot` | `.drill` | Per-task state directory, relative to the session workspace. |
| `reminder` | `true` | Register the turn-stopping gate reminder. |
| `provider` | `spawn` | Subagent provider used by `drill_review` (`spawn` = fresh context; `fork` inherits the parent prefix). A role file's `provider`/`model` win when both are present. |
| `model` | `''` | Optional reviewer model override. |
| `defaultRole` | `drill-auditor` | Role id `drill_review` audits with. |
| `maxReviewToolCalls` | `40` | Fallback budget when the role sets none; `0` disables the cap. Exceeding it aborts the child and records FAIL. |
| `runTimeoutMs` | `900000` | Default timeout for `drill_run`. |
| `c2gEnabled` | `true` | Enable the code2graph-backed stage 1–2 tools. |
| `c2gCacheDir` | `~/.cache/code2graph/projects` | c2g cache root. |
| `sqliteBin` | `sqlite3` | sqlite3 executable used for read-only queries. |
| `c2gDepth` | `3` | Default transitive-caller depth for `drill_blast`. |
| `rippleDepth` | `2` | Default reverse-edge depth for `drill_diff` dependents. |

## Evidence layout

```
.drill/
  active.json                  # the task a turn-stopping reminder talks about
  <task>/
    ledger.jsonl               # append-only, one JSON object per record
    logs/<stamp>-<label>-<arm>.log
    artifacts/review-<stamp>.md
    report.md
```

Every `test`/`hygiene` record carries `exit`, `sha256` of its log, and the `head` commit the command ran on. A record whose log is missing is refused at write time, so the ledger cannot accumulate unbacked claims; a review that names a different commit than the green proof cannot close the review gate.

## v0.2 changes

- **`drill_diff`** — the branch diff becomes blast evidence: `--diff-filter=ACMR` changed files, deletions reported separately, dependents walked backwards over c2g `Call`/`Read`/`TypeRef` edges to a bounded depth, plus a proposed manual-test checklist (one happy-path and one refusal line per changed file, one line per dependent). The checklist is an *input* to stage 3 — the `edge` gate still requires your own invariants, so a diff cannot close it by itself.
- **`drill_review` is role-driven** — persona, tool policy and budget come from `roles/drill-auditor.md` resolved project → user → bundled, with unknown frontmatter keys reported. A role naming a tool the agent cannot see degrades to the visible subset instead of failing the delegation. `FALLBACK_PERSONA`/read-only defaults still apply when no role file exists.
- **Evidence is bound to a commit** — `drill_run` records `head` + `branch`; `drill_review` records `head`. The `review` gate reopens when HEAD moved after the review, and the report names the commit evidence belongs to (or lists the commits it spans).
- **`lib/git.js`** — read-only git queries (`rev-parse HEAD`, branch, `diff --name-only`) that answer null/empty outside a repository instead of throwing.

## Verification

```sh
npm test        # node --test test/*.test.js — 39 tests
```

- unit: task-id safety, entry validation, log hashing, gate logic (including commit binding), report rendering, runner exit codes/timeouts
- git/role: real repositories for `headSha`/`branchName`/`diffFiles` (including the non-repo path); frontmatter parsing, project→user→bundled precedence, tool-filter expansion, budget reading
- c2g: a synthetic cache exercises the SQL (JSON-encoded `kind`/`role`, line from the symbol blob, duplicate names across crates, read-only refusal)
- integration: loads the real `@deepseek-ai/dsh-tools` runtime, compiles **every tool schema against the real DSL**, drives a whole drill (start → locate/blast/diff → red → green → hygiene → review → report), asserts the gates open in order, and asserts the reviewer request carries the role persona, the read-only tool filter, the budget and the commit under review

Loaded clean on DSH `0.1.6-alpha.2` in a scratch profile (`drill`, port 3999): the bundle row activates with no import error and no "entry did not activate" warning.

## Compatibility

Peer ranges carry explicit prerelease branches (`>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0`), because a plain `>=0.1.0-rc.2` silently excludes every prerelease host — the trap documented in the awesome-list's own contributing guide.

Known host constraints on `0.1.6-alpha.2`:

- **No custom session events.** `Session.append` has no `ignorable` envelope there and the read path refuses unknown types, so this plugin keeps state in files and injects durable context as a plugin-sourced user message. The `kind: 'plugin'` message source exists on 0.1.6 and was removed in 0.1.7-alpha.1; on a 0.1.7+ host, declare a `MessageSourceMap` member instead.
- Output schemas use the value-schema DSL: `required: true` belongs **on each property**, never as a top-level `required: [...]` array.

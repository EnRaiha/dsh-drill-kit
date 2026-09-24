# dsh-drill

Evidence-gated bug-fix drill for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`).

One issue, one worktree, one evidence chain. Each drill stage leaves a record in a per-task ledger; `drill_gate` refuses a completion claim that has no proof behind it. Red and green proofs are produced by **running the test command here**, never by writing an assertion into a file.

Built for the NodeDB drill (`red → green → fmt/clippy → preflight → commit → Review 2 → PR`), and derived from a source review of eleven existing DSH plugins — see `../drill-plugins/REVIEW-20260925.md`.

## Stages and gates

| Stage | Gate | Evidence required |
|---|---|---|
| 1 Localize | `localize` | one `locate` record naming file:line (usually via `drill_locate` over the local code2graph cache) |
| 2 Blast radius | `blast` | one `blast` record with callers/callees/affected files (`drill_blast`) |
| 3 Edge cases | `edge` | one `edge` record stating the invariants that must fail |
| 4 Surgical patch | **`red`** | a `test` run with `arm=base` that **fails**, with a captured log |
| | **`green`** | a `test` run with `arm=fix` that **passes**, with a captured log |
| | **`hygiene`** | a `hygiene` run (fmt/clippy/preflight) with `exit 0` |
| 5 Review | **`review`** | a `review` record with `verdict=PASS` and `blockers=0`; a later FAIL reopens the gate |
| 6 PR | `pr` | a `pr` record pointing at the PR body file |

`red`, `green`, `hygiene` and `review` are **required** before `drill_gate` reports `ready`. The rest are advisory gates that describe where the work stopped.

## Tools

| Tool | What it does |
|---|---|
| `drill_start` | open a task: ledger + `active.json` + gate report |
| `drill_locate` | stage 1 over the local c2g cache: symbol name, or `file`+`line` from a stack frame → exact definition. Records `locate`. |
| `drill_blast` | stage 2 over the same cache: call sites, transitive callers to a bounded depth, callees. Records `blast`. |
| `drill_run` | run a command, stream output into `.drill/<task>/logs/`, hash the log, record the exit code. This is the only way to produce a test proof. |
| `drill_record` | record non-command evidence: locate/blast/edge/review/pr/note |
| `drill_gate` | which gates hold, which are open, and what the next step is |
| `drill_status` | active task, record count, last records, gate state |
| `drill_report` | render the report (gate table + test evidence with exit codes and log hashes) and write `.drill/<task>/report.md` |
| `drill_review` | spawn Review 2: fresh-context, read-only reviewer subagent (`toolFilter: read/glob/grep`), hard tool-call budget, structured verdict recorded in the ledger |
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
| `provider` | `spawn` | Subagent provider used by `drill_review` (`spawn` = fresh context; `fork` inherits the parent prefix). |
| `model` | `''` | Optional reviewer model override. |
| `maxReviewToolCalls` | `40` | Hard tool-call budget for the reviewer; `0` disables the cap. Exceeding it aborts the child and records FAIL. |
| `runTimeoutMs` | `900000` | Default timeout for `drill_run`. |
| `c2gEnabled` | `true` | Enable the code2graph-backed stage 1–2 tools. |
| `c2gCacheDir` | `~/.cache/code2graph/projects` | c2g cache root. |
| `sqliteBin` | `sqlite3` | sqlite3 executable used for read-only queries. |
| `c2gDepth` | `3` | Default transitive-caller depth for `drill_blast`. |

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

Every `test`/`hygiene` record carries `exit` and `sha256` of its log. A record whose log is missing is refused at write time, so the ledger cannot accumulate unbacked claims.

## Verification

```sh
npm test        # node --test test/*.test.js — 25 tests
```

- unit: task-id safety, entry validation, log hashing, gate logic, report rendering, runner exit codes/timeouts
- c2g: a synthetic cache exercises the SQL (JSON-encoded `kind`/`role`, line from the symbol blob, duplicate names across crates, read-only refusal)
- integration: loads the real `@deepseek-ai/dsh-tools` runtime, compiles **every tool schema against the real DSL**, then drives a whole drill (start → locate/blast/edge → red → green → hygiene → review → report) and asserts the gates open in order

Loaded clean on DSH `0.1.6-alpha.2` in a scratch profile (`drill`, port 3999): the bundle row activates with no import error and no "entry did not activate" warning.

## Compatibility

Peer ranges carry explicit prerelease branches (`>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0`), because a plain `>=0.1.0-rc.2` silently excludes every prerelease host — the trap documented in the awesome-list's own contributing guide.

Known host constraints on `0.1.6-alpha.2`:

- **No custom session events.** `Session.append` has no `ignorable` envelope there and the read path refuses unknown types, so this plugin keeps state in files and injects durable context as a plugin-sourced user message. The `kind: 'plugin'` message source exists on 0.1.6 and was removed in 0.1.7-alpha.1; on a 0.1.7+ host, declare a `MessageSourceMap` member instead.
- Output schemas use the value-schema DSL: `required: true` belongs **on each property**, never as a top-level `required: [...]` array.

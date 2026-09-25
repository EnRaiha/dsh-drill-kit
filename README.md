# dsh-drill

Evidence-gated bug-fix drill for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`).

One issue, one worktree, one evidence chain. Each drill stage leaves a record in a per-task ledger; `drill_gate` refuses a completion claim that has no proof behind it. Red and green proofs are produced by **running the test command here**, never by writing an assertion into a file.

Built for the NodeDB drill (`red → green → fmt/clippy → preflight → commit → Review 2 → PR`), and derived from a source review of eleven existing DSH plugins — see `../drill-plugins/REVIEW-20260925.md`.

## Stages and gates

| Stage | Gate | Evidence required |
|---|---|---|
| 1 Localize | `localize` | one `locate` record naming file:line — from the failure signal (`drill_error` resolves each frame) or by symbol (`drill_locate`) |
| 2 Blast radius | `blast` | one `blast` record with callers/callees/affected files (`drill_blast`), and/or the branch diff plus its dependents (`drill_diff`) |
| 3 Edge cases | `edge` | one `edge` record stating the invariants that must fail — `drill_diff` proposes a checklist, you supply the invariants |
| 4 Surgical patch | **`red`** | a `test` run with `arm=base` that **fails**, with a captured log |
| | **`green`** | a `test` run with `arm=fix` that **passes**, with a captured log |
| | **`hygiene`** | a `hygiene` run (fmt/clippy/preflight) with `exit 0` |
| 5 Review | **`review`** | a `review` record with `verdict=PASS`, `blockers=0`, **and the same commit as the green proof**; a later FAIL or a moved HEAD reopens the gate |
| 6 PR | `pr` | a `pr` record pointing at the PR body file **rendered for the green proof's commit**; `drill_pr` refuses to record one whose lint has blockers, and new commits reopen both `review` and `pr` |

`red`, `green`, `hygiene` and `review` are **required** before `drill_gate` reports `ready`. The rest are advisory gates that describe where the work stopped.

## Tools

| Tool | What it does |
|---|---|
| `drill_start` | open a task: ledger + `active.json` + gate report |
| `drill_error` | stage 1 from the signal: parse a panic, backtrace, compiler diagnostic or traceback into `file:line` frames and resolve each frame to its symbol (cache → merged store). Records `locate`. |
| `drill_locate` | stage 1 over the local c2g cache: symbol name, or `file`+`line` from a stack frame → exact definition. Records `locate`. |
| `drill_blast` | stage 2 over the same cache: call sites, transitive callers to a bounded depth, callees. Records `blast`. |
| `drill_diff` | stage 2b from git: changed files against the base ref, deleted files, the files that depend on them (c2g reverse edges), and a proposed manual-test checklist. Records `blast`. |
| `drill_search` | text search with `tgrep` (trigram index) or `rg`: for questions the graph cannot answer — a config key, an error string, a SQL fragment, a doc claim. Optionally records the hits as `locate`/`blast`/`edge` evidence, always labelled text-level. |
| `drill_index` | build or refresh the **out-of-tree** tgrep index for the drill repository, so stages 1–2 stop scanning: the index lands in the cache directory, never inside the worktree, and `git status` stays clean. Prunes idle indexes on the way. |
| `drill_cache` | `status` / `prune` / `clear` the derived cache: sizes, entry counts, the idle TTL, and what pruning freed. |
| `drill_pr` | stage 7: render the PR body from the ledger (why, changed files, red/green/preflight rows with exit codes and commits, Review 2 verdict, gate table), write it, score it with the PR-craft core, and record `pr` evidence only when the lint has no blockers. |
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
| `errorMaxResolve` | `12` | Cap on frames `drill_error` resolves against the graph. |
| `prLint` | `true` | Score the rendered PR body with the PR-craft core before recording it. |
| `prCore` | `~/scripts/pr_craft.py` | Path to the shared PR-craft core (Kilo and Hermes use the same file). |
| `pythonBin` | `python3` | Interpreter used to call the PR-craft core. |
| `c2gEnabled` | `true` | Enable the code2graph-backed stage 1–2 tools. |
| `c2gCacheDir` | `~/.cache/code2graph/projects` | c2g cache root. |
| `sqliteBin` | `sqlite3` | sqlite3 executable used for read-only queries. |
| `c2gDepth` | `3` | Default transitive-caller depth for `drill_blast`. |
| `rippleDepth` | `2` | Default reverse-edge depth for `drill_diff` dependents. |
| `searchEngine` | `auto` | `auto` picks `tgrep` when an index covers the root (out-of-tree cache first, then `<root>/.tgrep`), otherwise `rg`; force with `rg` or `tgrep`. |
| `tgrepIndexDir` | `<cacheDir>/tgrep` | Where out-of-tree tgrep indexes live (one directory per root). |
| `cacheDir` | `~/.cache/dsh-drill` | Cache root for derived data. Never `/tmp`. |
| `cacheTtlDays` | `7` | Idle time before a cache entry is removed; `0` disables expiry. |
| `embedEnabled` | `true` | Use the merged c2g store as the second resolution layer. |
| `embedStore` | `~/Embed/c2g/graph_index.sqlite` | Path to the merged c2g graph store. |
| `embedRepoMap` | `''` | Override shard labels, e.g. `nd_src=nodedb/src,nd_sql=nodedb-sql`. |
| `autoIndex` | `false` | When true, a missing index is built on the first search instead of falling back to rg. Off by default so a search never writes unexpectedly. |
| `rgBin` | `rg` | ripgrep binary name or absolute path. |
| `tgrepBin` | `tgrep` | tgrep binary name or absolute path; `~/.local/bin` and `~/.cargo/bin` are searched after `PATH`. |
| `searchMaxHits` | `200` | Cap on returned hits; the result reports when it truncated. |

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

## Search engines (stage 1–2 fallback)

**Which "c2g"?** Three different things share the name: the upstream extractor is **farhan-syah's `NodeDB-Lab/code2graph`** (the `c2g` binary, called only as a last resort); the **per-project cache** `~/.cache/code2graph/projects/<key>/cache.sqlite3` is layer 1 below; and **`~/Embed/c2g`** is this machine's merged store, built by `~/scripts/merge_c2g_shards.py`, layer 2.

The graph is authoritative when it answers, but it does not always: a repository may have no c2g cache, the symbol may not be indexed, or the question may not be about a symbol at all. Three layers, chosen per call and always named in the evidence:

| Layer | Used for | Evidence label |
|---|---|---|
| **c2g CLI cache** (read-only SQL over `~/.cache/code2graph/projects/<key>/cache.sqlite3`) | resolved definitions, call sites, callees, transitive impact, reverse-edge dependents, for the exact worktree that was indexed | `c2g <db>` |
| **merged c2g store** (`~/Embed/c2g/graph_index.sqlite`) | the same questions for **any worktree of the repository** — one merged graph, shard paths mapped to the worktree | `c2g-embed <store> (built <ts>)` |
| **tgrep** (trigram index under `<cacheDir>/tgrep`) | fast substring/regex over an indexed root | `tgrep <bin> (text-level)` |
| **rg** (ripgrep) | everything else, and any root without a tgrep index | `rg <bin> (text-level)` |

`auto` prefers tgrep only when the root actually carries an index — an unindexed tgrep run scans every file and writes a warning into the evidence log, which is worse than ripgrep. Both engines emit the same `--json` match stream, so one parser reads them.

**Indexes live outside the repository.** A tgrep index normally sits at `<root>/.tgrep`, which would add untracked files to a drill worktree and surface in `git status` — exactly what the drill's own preflight checks look at. `drill_index` (and `autoIndex`) instead pass `--index-path`, writing to `~/.cache/dsh-drill/tgrep/<root-slug>/`: measured at ~1.5 s and ~60 MB per NodeDB worktree, ~92 MB peak RAM, and the worktree gains nothing.

## Merged c2g store (`~/Embed`)

`~/Embed` is the machine's embedding and merged-graph store (`RULES.md` there owns the layout). Its `c2g/graph_index.sqlite` is a **different artifact** from the per-project CLI cache: one file with `nodes(id, name, kind, file, repo, line)` and `links(source, target, relation)`, merged from per-crate shards and rebuilt on import. Because it is merged, it answers for *every* worktree of the repository — which is exactly the gap the per-project cache leaves.

Paths inside it are shard-relative, so the plugin maps them and only claims a mapping it can confirm on disk:

| Shard | Worktree path | |
|---|---|---|
| `nd_src` | `nodedb/src` | verified |
| `nd_tests` | `nodedb/tests` | verified |
| `nd_sql` | `nodedb-sql` | verified |
| `nd_cluster` | `nodedb-cluster` | verified |
| `nd_types` | `nodedb-types` | verified |
| `nd_vector` | `nodedb-vector` | verified |
| `nd_rest` | already worktree-relative | verified |

A row whose mapped path is absent from the worktree is returned with `path not in this worktree` rather than silently reported as present.

**This is a snapshot, not the worktree's HEAD.** Evidence recorded from it says so, and carries the store's build time from `manifest.json` (`c2g-embed … (built 2026-09-24T05:24:54+0800)`). Precedence stays: the per-worktree CLI cache is freshest, the merged store answers next, and text search is last.

Measured on `nodedb-296` (no per-worktree cache, merged store present):

```
drill_start  → stage 1–2: no per-worktree c2g cache, merged c2g store available
               (/home/maya/Embed/c2g/graph_index.sqlite (built 2026-09-24T05:24:54+0800)); tgrep index ready
drill_locate nextval_batch → nodedb/src/control/sequence/registry.rs:227 (nd_src)
                             nodedb/src/control/sequence/types.rs:91   (nd_src)
drill_blast  catalog_err   → 40 resolved call sites, 60 transitive callers in 24 files
```

## From a failure signal to symbols

The pipeline's first stage starts from "the stack trace, error logs, input payload, and the specific function throwing the error" — not from a symbol name. `drill_error` takes the raw text and does that work:

- **Parses** a Rust panic header (`panicked at path:line:col: msg`), a numbered backtrace (keeping `crate::module::fn` as a `symbol_hint`), a compiler `-->` diagnostic, a Python `File "x", line N`, and bare `file.ext:line` mentions in prose. Frames dedupe by `file:line` and cap at 40.
- **Marks** toolchain and dependency frames (`/rustc/`, `~/.cargo/registry/`, `node_modules`, `site-packages`) as `external` instead of resolving or dropping them, so the reader can see why nothing was resolved there.
- **Resolves** each repository frame through the same layers as `drill_locate` — per-worktree c2g cache, then the merged store — and shows both answers when the backtrace names a symbol the graph disagrees with (`→ nextval_batch [Method] (c2g-embed) (backtrace names …::allocate)`).
- **Records** the whole chain as `locate` evidence, which is what closes the localize gate.

## A miss is a note, not evidence

A lookup that finds nothing still appends a record — for the audit trail — but carries no `files`, `symbols` or `text`, so the gate it belongs to stays open.

The rule reaches every tool that can write one of those kinds: `drill_locate`, `drill_blast`, and `drill_search` when it is asked to record (`kind: locate|blast|edge`). A zero-hit `drill_search` writes the search it ran and `… — the <gate> gate stays open`, never a `text` field that the gate would count.

That last path is where the fix took three releases, and the sequence is worth keeping: **v0.7.0** shipped the bug (a negative result closed the gate it was supposed to feed), **v0.7.1** fixed `drill_locate`/`drill_blast` and added a regression test, and **v0.7.3** found that `drill_search` still wrote `text: "no hits for <pattern>"` on a zero-hit search — the same bug, on the one recording path the earlier fix had not touched. Its test is two-sided: a miss stays open **and** a hit closes the gate, so "never closes" cannot pass either.

## Ledger concurrency and torn writes

Each record is one synchronous `O_APPEND` write of a newline-terminated line; there is no lock file, so **one writer per task** is the rule. On read, an unterminated final line (the shape a crash mid-append leaves) is skipped, while a complete line that fails to parse refuses evaluation with its line number.

## The PR body comes from the ledger

`drill_pr` renders the body from evidence rather than from prose: the verification table is built from `test` and `hygiene` records (command, exit code, log name, commit), the changed-file list comes from `blast` records, and the Review 2 line comes from the `review` record. A body without a red proof says so in a blockquote instead of implying one.

It is then scored by the **existing** PR-craft core (`~/scripts/pr_craft.py lint-desc`, shared with the Kilo and Hermes plugins — one logic core, no drift), and `pr` evidence is recorded **only when the lint reports no blockers**. A blocked body is still written to disk so the author can fix it, while the `pr` gate stays open.

## Cache and expiry

Everything the plugin can rebuild lives under one root — `~/.cache/dsh-drill` — and never under `/tmp`, which the host may wipe between sessions:

```
~/.cache/dsh-drill/
  c2g-discovery.json      # repository path -> the c2g database that answered, with its snapshot id
  tgrep/<root-slug>/      # out-of-tree trigram indexes
```

**One week idle time to live.** Three rules keep it honest:

- **The c2g cache schema version is re-read on every hit**, not just when the entry was written: one `PRAGMA user_version` query (~2 ms) per answer. Our stages read specific tables (`graph_symbols`, `graph_edges`, `active_snapshots`), so if upstream bumps the cache schema, every c2g-backed record carries `c2g cache schema v4, expected v3 — upstream changed the cache format; verify these queries before trusting the result` instead of quietly reporting a graph it no longer understands. Reading it on the hit is what keeps the drift from hiding behind the seven-day TTL.
- The TTL measures **idleness, not age**: a lookup touches the entry it used, so an index for a worktree still being drilled survives and one abandoned for a week is removed. `prune` runs whenever `drill_index` builds, and `drill_cache prune` runs it on demand. `cacheTtlDays: 0` disables expiry.
- A cached answer is re-validated on read: the database file must still exist, and the entry must carry a snapshot id. Coverage means *can answer* — a c2g cache without an active scope snapshot (for example one rooted at a home directory, or a `/tmp` fixture) is not a candidate, because every query resolves through that snapshot. `drill_start` therefore reports the engine that will actually answer.

`drill_start` reports which engine will answer, so the gap is visible before the first search:

```
stage 1–2: no c2g cache and no tgrep index — run drill_index to build one, otherwise searches scan with rg
stage 1–2: no c2g cache, tgrep index ready (text-level)
stage 1–2: c2g cache covers this repo
```

The fallback never pretends to be a graph: `drill_locate` searches for definition-shaped lines and says so, `drill_blast` reports **occurrences**, explicitly not resolved call sites, and nothing in the fallback path can produce a transitive `impact` list. A caller/callee claim still needs the graph or a read of the code.

## v0.2 changes

- **`drill_diff`** — the branch diff becomes blast evidence: `--diff-filter=ACMR` changed files, deletions reported separately, dependents walked backwards over c2g `Call`/`Read`/`TypeRef` edges to a bounded depth, plus a proposed manual-test checklist (one happy-path and one refusal line per changed file, one line per dependent). The checklist is an *input* to stage 3 — the `edge` gate still requires your own invariants, so a diff cannot close it by itself.
- **`drill_review` is role-driven** — persona, tool policy and budget come from `roles/drill-auditor.md` resolved project → user → bundled, with unknown frontmatter keys reported. A role naming a tool the agent cannot see degrades to the visible subset instead of failing the delegation. `FALLBACK_PERSONA`/read-only defaults still apply when no role file exists.
- **Evidence is bound to a commit** — `drill_run` records `head` + `branch`; `drill_review` records `head`. The `review` gate reopens when HEAD moved after the review, and the report names the commit evidence belongs to (or lists the commits it spans).
- **`lib/git.js`** — read-only git queries (`rev-parse HEAD`, branch, `diff --name-only`) that answer null/empty outside a repository instead of throwing.
- **`drill_search` + `lib/search.js`** — tgrep/rg text search as the honest fallback for stages 1–2, with engine auto-selection and text-level labelling.
- **`drill_error` + `drill_pr`** — the drill now starts from the failure signal (frames resolved to symbols, toolchain frames marked external) and ends with a PR body rendered from the ledger and scored by the shared PR-craft core, recorded only when the lint is clean.
- **merged c2g store as the second resolution layer** — `~/Embed/c2g/graph_index.sqlite` answers for every worktree of a repository through a verified shard-path map, so a missing per-worktree cache no longer costs the drill its resolved call graph (it previously fell straight to text search). The store's build time is carried into every record it produces.
- **`drill_cache` + one expiring cache root** — discovery results and indexes share `~/.cache/dsh-drill`, the TTL is idle-based with a week's default, stale entries are dropped on read (a database that vanished, or an entry recorded before coverage required a snapshot), and `drill_cache status|prune|clear` makes the whole thing inspectable. c2g discovery also stops re-probing every project directory with a sqlite3 process on each call.
- **`drill_index` + out-of-tree indexes** — `--index-path` support keeps the trigram index in `~/.cache/tgrep-index/`, so coverage is added without dirtying a worktree; `drill_start` names the engine that will answer; c2g discovery now picks the **most specific** matching cache root (with an active snapshot preferred), so a stale cache indexed at a parent directory cannot shadow the real one.

## Verification

```sh
npm test        # node --test test/*.test.js — 88 tests
```

- unit: task-id safety, entry validation, log hashing, gate logic (including commit binding), report rendering, runner exit codes/timeouts
- git/role: real repositories for `headSha`/`branchName`/`diffFiles` (including the non-repo path); frontmatter parsing, project→user→bundled precedence, tool-filter expansion, budget reading
- errors: panic headers, numbered backtraces with symbol hints, compiler diagnostics, tracebacks and bare mentions; external marking; dedupe and capping; message extraction
- pr: body rendering from the ledger (including the missing-red warning), blocker surfacing from a core, a crashing core, and a run against the real `pr_craft.py`
- embed store: manifest reading, shard↔worktree path mapping both ways (round trip, overrides, unconfirmed paths), definition/caller/callee/impact/dependent queries over `links` with a relation filter, and a false `isUsable` for a non-database
- cache: TTL by idleness with touch-extends-life, prune protecting the keep list, size accounting, discovery cache hit/miss/expiry/forget, an entry without a snapshot never being served, and index pruning that keeps roots in use
- search: binary resolution, engine auto-selection against an indexed vs unindexed root, out-of-tree index build/read-back/root matching (including that no `.tgrep` appears inside the repo), ripgrep/tgrep JSON parsing, definition-shaped patterns, miss-vs-failure exit codes, unavailable-engine reporting
- c2g: a synthetic cache exercises the SQL (JSON-encoded `kind`/`role`, line from the symbol blob, duplicate names across crates, read-only refusal)
- integration: loads the real `@deepseek-ai/dsh-tools` runtime, compiles **every tool schema against the real DSL**, drives a whole drill (start → locate/blast/diff → red → green → hygiene → review → report), asserts the gates open in order, asserts the reviewer request carries the role persona/read-only filter/budget/commit, and asserts stages 1–2 fall back to a labelled text search on a repo with no code graph

Loaded clean on DSH `0.1.6-alpha.2` in a scratch profile (`drill`, port 3999): the bundle row activates with no import error and no "entry did not activate" warning.

## Compatibility

Peer ranges carry explicit prerelease branches (`>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0`), because a plain `>=0.1.0-rc.2` silently excludes every prerelease host — the trap documented in the awesome-list's own contributing guide.

Known host constraints on `0.1.6-alpha.2`:

- **No custom session events.** `Session.append` has no `ignorable` envelope there and the read path refuses unknown types, so this plugin keeps state in files and injects durable context as a plugin-sourced user message. The `kind: 'plugin'` message source exists on 0.1.6 and was removed in 0.1.7-alpha.1; on a 0.1.7+ host, declare a `MessageSourceMap` member instead.
- Output schemas use the value-schema DSL: `required: true` belongs **on each property**, never as a top-level `required: [...]` array.

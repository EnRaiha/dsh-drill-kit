# The Drill — full document

*2026-09-25 · maya · one issue → one branch → one evidence chain → one reviewed PR · the DSH plugin and its full specification*

---

## 0. TL;DR

*This revision (v0.8.0) is the output of the 2026-09-25 end-to-end review: what was verified, what was wrong, and what stayed unverified is in `~/projects/DRILL-E2E-REVIEW-20260925.md`.*

**Glossary** — **DSH** = DeepSeek Harness, the agent runtime this plugin loads into (the checkout is `~/projects/deepseek-harness`). **c2g** = code2graph, the Rust code-graph extractor written by **[farhan-syah](https://github.com/farhan-syah)** ([`NodeDB-Lab/code2graph`](https://github.com/NodeDB-Lab/code2graph)); locally the name also covers its per-project cache and this machine's merged store + embeddings — see **§4.0** before assuming which one a sentence means. **tgrep** = a trigram-indexed grep with a ripgrep-compatible `--json` stream. **Ledger** = the append-only per-task evidence file. **Gate** = a predicate over that ledger. **Arm** = which side of the fix a test ran on (`base` before, `fix` after). **Commit binding** = an evidence record names the `HEAD` it belongs to.

A **drill** is a bug fix run as a pipeline with gates: localize from the failure signal, map the blast radius, enumerate the edge cases, prove **red** (fails on base) then **green** (passes with the fix), pass hygiene, pass a fresh-context read-only **Review 2**, then produce the PR — with every claim backed by an artifact in a ledger. "Done" is not a sentence; it is a gate evaluation.

Today the drill exists in three places:

| Layer | Where | State |
|---|---|---|
| Full plugin | `~/projects/dsh-drill` (DSH, v0.8.0) | 16 tools, 97 tests, loads on DSH `0.1.6-alpha.2` |
| Shared c2g core | `~/scripts/c2g_tools.py` v1.1.0 + Kilo/Hermes frontends | `c2g_error` / `c2g_frame` on all three surfaces |
| Discipline + PR + agents | Kilo/Hermes `pr-craft`, `parity-auditor`, `test-runner`, `ci-runner`, `codetrack` | reviewed, no enforcement layer |

Everything else in this document is the spec, the data model, and the operating instructions.

---

## 1. What the drill is

### 1.1 Stages and gates

| # | Stage | Gate | Required for done | Evidence |
|---|---|---|---|---|
| 1 | Localize | `localize` | — | one `locate` record with `file:line` — from the failure signal (`drill_error`) or by symbol (`drill_locate`) |
| 2 | Blast radius | `blast` | — | one `blast` record: callers / callees / impact / dependents, or the branch diff |
| 3 | Edge cases | `edge` | — | one `edge` record naming the invariants that must fail |
| 4 | Surgical patch | **`red`** | ✅ | a `test` run with `arm=base` that **fails**, with captured output |
| | | **`green`** | ✅ | a `test` run with `arm=fix` that **passes**, with captured output |
| | | **`hygiene`** | ✅ | a `hygiene` run (fmt / clippy / preflight) with `exit 0` |
| 5 | Review 2 | **`review`** | ✅ | `verdict=PASS`, `blockers=0`, **and the same commit as the green proof** |
| 6 | PR | `pr` | — | a `pr` record pointing at the PR body file; the body must pass its own lint |

**Post-PR semantics (decided 2026-09-25, implemented):** the drill does not stop at "PR opened". New commits on the branch move `HEAD`, and both commit-bound gates reopen: `review` because its record names a commit that is no longer the green proof's, and `pr` because the body was rendered for the older commit. Re-run `drill_review` and `drill_pr` on the commit you are pushing; the `pr` record carries the `head` it was rendered for. A CI failure after the merge is outside the ledger — file it as a new task (the drill is per-issue), and if the fix amends the same PR, push the new commit and re-run stages 5–6.

### 1.2 Hard rules

1. **Red before green.** A test that passes on base is a *guard*, not a proof.
2. **No log, no evidence.** A `test`/`hygiene` record without a readable log file is refused at write time.
3. **The plugin runs the command.** A hand-written log is an assertion; only `drill_run` (or an equivalent executor) produces a proof. Enforced at write time: a `test`/`hygiene` log must live under that task's own `logs/` directory, which only the executor writes. Someone who copies a file in can still forge a record — the ledger is a local file, not a signed log — which is exactly why `pre-push` and Review 2 exist.
4. **Evidence is bound to a commit.** `drill_run` records `head` + `branch`; `drill_review` records `head`. A review of another commit cannot close the gate, and a moved HEAD reopens it — and so does a review that names **no** commit at all while a green proof names one. (Commit binding needs a git workspace: in a plain directory there is no `head` to record, and the gate can only compare what is there.)
5. **Review 2 is read-only and fresh.** The auditor never wrote the code; it cannot edit, commit or push.
6. **A claim without evidence is refused.** `drill_gate` names the open gates; the report says `INCOMPLETE` with the missing list.
7. **One issue, one PR.** No issue numbers in source comments or commit messages — the link lives in the PR body.
8. **A lookup that finds nothing is a note, not evidence.** Any stage-1/2 answer that resolves to nothing still appends a record for the audit trail, but carries no `files`, `symbols` or `text` — so the gate it belongs to stays open. It applies to every path that can write one of those kinds: `drill_locate` and `drill_blast` (miss), `drill_search` with `kind=locate|blast|edge` (zero hits), `drill_error` (a failure signal whose frames are all toolchain/dependency), and `drill_locate`'s store fallback (a symbol the merged store knows only in another shard/worktree). This rule needed three releases to actually hold everywhere: v0.7.0 shipped the bug, v0.7.1 fixed the two symbol tools, and the 2026-09-25 review found the text-search, backtrace and store paths still writing evidence for a miss.

---

## 2. Why the drill exists — the failure modes it closes

Every rule above exists because the failure happened. Evidence from the source review of eleven plugins and from this machine's own history:

| Failure mode | Seen in | What closes it |
|---|---|---|
| Fix written before any red proof | `dsh-issue2pr` has **no red-proof stage at all** — its test runner only runs after the patch, and its report is not bound to a workspace hash | `red` gate + hashed log + commit |
| "Test passed" with no output | `maya-recover`'s evidence table asserts `success = true` for every row, never stores an exit code, and its `sha256` is really 32-bit FNV-1a | `normalizeEntry` refuses a test record without a log; real `sha256:<hex>` |
| Review skipped or stale | Review 2 was a shell script (`review2.sh`) spawning another runtime; nothing tied the verdict to the commit | `review` gate + `head` binding + role-driven auditor |
| Unrelated entries rewritten in a PR | The awesome-list's own gate lists modified entries after issue #1348 | out of scope here; in the drill: `drill_diff` shows exactly what changed |
| A stalled countdown looks like a dead composer | `play-tools.js` send guard (this machine, 2026-09-25) | not drill — but the same lesson: **a gate must be visible or it is a wedge** |
| Loop detection that never runs | `maya-recover`'s `StaleTracker`/`CircuitBreaker` are imported and never instantiated | `drill_gate` is a tool the agent must call, not a background hope |
| A budget that cannot stop anything | `maya-recover` computes `abort` and no caller enforces it | `drill_review` aborts its own controller at the cap |
| Silent persistence failure | `catch {}` around every write in `maya-recover` | append-only local JSONL, no network in the write path |
| A negative lookup counted as proof | this implementation, v0.7.0: a text-search miss wrote evidence text and closed `localize`/`blast` | a miss records a note only (rule 8); v0.7.3 extended the fix to `drill_search`, which had kept the old shape while `drill_locate`/`drill_blast` were fixed in v0.7.1 |

---

## 3. Data model

### 3.1 Ledger

One append-only JSONL file per task: `.drill/<task>/ledger.jsonl`.

```json
{"v":1,"ts":"2026-09-25T00:03:11.482Z","task":"issue314","kind":"test","stage":"patch",
 "arm":"base","cmd":"bash ~/scripts/nodedb-cargo.sh . nextest run -p nodedb","exit":101,
 "log":".drill/issue314/logs/20260925T000311-red-base.log","sha256":"sha256:9f2c…",
 "head":"a1b2c3…","branch":"fix/314-seq-per-row","note":"red proof on base"}
```

| Field | Meaning |
|---|---|
| `v` | ledger schema version (currently 1) |
| `task`, `kind`, `stage` | identity; `kind` ∈ `locate · blast · edge · test · hygiene · review · pr · note`; `stage` ∈ `localize · blast · edge · patch · review · pr` |
| `arm` | `base` or `fix` — **required** for test records (an unarmed test closes neither red nor green, so the ledger refuses it) |
| `cmd`, `exit` | the command and its integer exit code |
| `log`, `sha256` | captured output path and its digest; required for `test`/`hygiene`, and the log must live under that task's own `logs/` directory — only `drill_run` writes there, so a hand-recorded run cannot point the proof at any readable file |
| `head`, `branch` | the commit the evidence belongs to. Recorded by `drill_run`/`drill_review`/`drill_pr` whenever the workspace is a git repo, and an explicit `drill_record` argument otherwise — a `review`/`pr` record that names no commit cannot close its gate once a green proof names one |
| `files`, `symbols`, `text`, `note`, `verdict`, `blockers`, `role`, `bodyPath`, `issue`, `base`, `repo` | evidence payload |

**Concurrency.** Each record is one synchronous `O_APPEND` write of a single newline-terminated line; there is **no lock file**. Within one agent loop tool calls are serialised, so the common case is single-writer. Two processes driving the *same* task would share the file: the `O_APPEND` offset update is atomic, so a line does not interleave with another line in practice, but this is not a documented guarantee — treat "one writer per task" as the rule. On read, an **unterminated final line** (the shape a crash mid-append leaves) is skipped, while a complete line that fails to parse refuses evaluation loudly, with its line number.

**Schema evolution.** `v` is pinned at `1`. When a required field is added, bump to `2`; readers must stay tolerant of `v:1` records missing the new field. Do not silently reinterpret an old `v` — refuse and say why.

Refused at write time: unknown `kind`/`stage`, non-integer `exit`, `arm` outside `{base,fix}`, a **test record with no `arm`**, a `test`/`hygiene` record with no log, a log that cannot be read, a `test`/`hygiene` log outside the task's `logs/` directory, `verdict` outside `{PASS,FAIL}`, negative or non-integer `blockers`, a task id that could escape the state root.

**What "refused" does not buy you.** The log check proves the file exists, is readable, and hashes to something; it proves the run was executed by the drill only insofar as the task's `logs/` directory is written by `drill_run`. Someone who copies a file into that directory can still hand-write a record — this is a deliberate trust boundary (the ledger is a local, single-writer file, not a signed log), and the `pre-push` hook plus Review 2 are what stand behind it.

### 3.2 Layout

```
.drill/
  active.json                     # the task the turn-stopping reminder talks about
  <task>/
    ledger.jsonl                  # append-only evidence
    logs/<stamp>-<label>[-<arm>].log  # arm only for test runs; hygiene logs carry no arm
    artifacts/review-<stamp>.md
    report.md                     # rendered gate + evidence report
    PR_BODY.md                    # rendered by drill_pr
```

### 3.3 Caches (all rebuildable, all under `~/.cache/dsh-drill`, never `/tmp`)

```
~/.cache/dsh-drill/
  c2g-discovery.json              # repository path → the c2g database that answered, TTL 7 days idle
  tgrep/<root-slug>/              # out-of-tree trigram indexes
```

One week idle TTL, measured by **use**, not age: a lookup touches what it read. `drill_cache status|prune|clear` inspects and cleans it. A cached answer is re-validated on read: the database must exist, carry a snapshot id, and its **cache schema version is re-read on every hit** (`PRAGMA user_version`, one ~2 ms query) — so an upstream schema bump is visible on the next call instead of being hidden by the seven-day TTL.

---

## 4. Resolution layers (how stages 1–2 get their answers)

### 4.0 Four different things are called "c2g" — know which one you mean

The same three letters name an upstream library, a cache, a merged store, and an agent wrapper. Confusing them is the easiest way to misread this document (and to debug the wrong layer).

| Name | What it is | Who owns / produces it | Where it lives | Role in the drill |
|---|---|---|---|---|
| **code2graph (upstream)** | Rust library + `c2g` CLI: source files → **symbols, references, cross-file edges** (calls, imports, FFI), tree-sitter based, SCIP-aligned, and deliberately **storage-neutral** ("zero storage opinion") | **[`NodeDB-Lab/code2graph`](https://github.com/NodeDB-Lab/code2graph)** — written by **[farhan-syah](https://github.com/farhan-syah)**, the NodeDB founder (391 contributions; sole visible author, first commit 2026-06-13). The local clone also carries **EnRaiha's** CLI fixes (`f9580d2 fix(cli): refuse an implicit home root and cap reported omissions`) | `~/projects/code2graph` → binary `~/projects/code2graph/target/release/c2g` | the extractor that *produces* the graph; the drill calls it only as the **last resort** (it hung >60 s on `nodedb` during this work) |
| **per-project CLI cache** | the SQLite cache the CLI writes per project: `graph_symbols`, `graph_edges`, `active_snapshots`, scope tier | produced locally by the code2graph CLI | `~/.cache/code2graph/projects/<project-key>/cache.sqlite3` | **layer 1** — what `drill_locate` / `drill_blast` query first (~2 ms, read-only SQL) |
| **merged store + embeddings** | merged `nodes(id,name,kind,file,repo,line)` + `links(source,target,relation)` + FTS + FAISS/vectors for semantic search | **this machine's pipeline**, not the upstream repo: `~/scripts/merge_c2g_shards.py`, `build_c2g_local.py`, `dump_c2g_embed.py`; layout and policy in `~/Embed/RULES.md` | `~/Embed/c2g/{graph_index.sqlite, fts.sqlite, index.faiss, vectors.npy, meta.parquet}` | **layer 2** — answers for worktrees the cache does not cover; shard paths (`nd_src` → `nodedb/src`) mapped into the worktree |
| **agent wrapper (the "c2g skill")** | stdlib-only bridge exposing the CLI to agents: `frame` / `error` + the eight query tools | this machine | `~/scripts/c2g_tools.py` v1.1.0 → `~/.kilo/plugins/c2g/server.ts`, `~/.hermes/plugins/c2g/` | the shared surface every runtime calls; `c2g_error` lives here |

Why the extra layers exist: the upstream library defines **no storage**, so every consumer supplies its own — the CLI cache is the fast per-worktree index, and `~/Embed/c2g` is the merged, cross-worktree store. When this document says "c2g answered", the record always names which one: `c2g` (cache), `c2g-embed` (merged store), or `c2g <binary>` (last resort).

**Are "our c2g" and "NodeDB" the same thing?** Not the same *artifact*, but one project family. Verified from the local clones: `NodeDB-Lab/code2graph` and `NodeDB-Lab/nodedb` are both published under the NodeDB-Lab org (the `nodedb` clone carries `origin` **and** `upstream` = `NodeDB-Lab/nodedb`), and one author — [Farhan Syah](https://github.com/farhan-syah) — wrote **390 of 391** code2graph commits and **3,740 of 3,793** nodedb commits (3,673 under his primary author identity, 67 under his GitHub identity). His profile is the citation; no private address is reproduced here. So the c2g extractor is the NodeDB project's own graph engine, not a third-party tool this machine happens to use. What is **ours alone** is the storage and agent layers on top: the per-project CLI cache, the merged `~/Embed/c2g` store, `~/scripts/c2g_tools.py`, and the Kilo/Hermes frontends. Org *membership* cannot be read from a git clone, so this document records the shared authorship and the shared org rather than a title.

Stage 1–2 answers come from three layers, in order, and every record names which one answered:

| Layer | What it is | Speed | Evidence label |
|---|---|---|---|
| **c2g per-project cache** | `~/.cache/code2graph/projects/<key>/cache.sqlite3` — `graph_symbols` + `graph_edges`, scope snapshot | ~2 ms (read-only SQL) | `c2g` |
| **merged c2g store** | `~/Embed/c2g/graph_index.sqlite` — `nodes(id,name,kind,file,repo,line)` + `links(source,target,relation)`, shard-relative paths | ~2 ms | `c2g-embed` (carries the build time) |
| **tgrep / rg** | trigram index at `~/.cache/dsh-drill/tgrep/<slug>/`, else ripgrep | 1.5 s build, then fast | `<engine> (text-level)` |

**Verified traps** (they broke a naive implementation and are covered by tests):

- `role` and `kind` are JSON-encoded **with quotes** — `role = '"Call"'`; `role = 'Call'` silently returns 0 rows.
- `span_start` / `span_end` are **byte offsets**, not lines — read `json_extract(symbol,'$.line')`.
- Symbol names repeat across crates — disambiguate with the stack frame's file.
- The cache path is a project key, **not** `sha256(abs path)`: `project_key` is a 32-byte BLOB (blake3 over the canonical root — upstream `cli/src/cache/location.rs:24-36`) and the directory name is its `lower(hex(...))`. It is still a deterministic hash of the root, just not the one you would guess, so discover the cache by matching `meta.canonical_root` rather than by computing a path.
- A cache without an active scope snapshot cannot answer; it must not be treated as coverage (a home-directory cache otherwise claims every repo).
- The c2g **binary** hung >60 s on `nodedb` and `nodedb-305` during this work; the SQLite cache answered in milliseconds. Cache first, binary last.
- The cache carries a **schema version** (`PRAGMA user_version`, `SCHEMA_VERSION: i64 = 3` in the upstream `cli/src/cache/schema.rs`). Our queries read specific tables (`graph_symbols`, `graph_edges`, `active_snapshots`), so a bump there means the columns we read may have moved. Every c2g-backed record shows `c2g cache schema v3`, and a mismatch prints a warning *inside the note* rather than failing the call — the graph answer is still recorded, but it is visibly suspect, and the version is re-read on each cache hit so drift cannot hide behind the TTL.

Shard → worktree mapping for the merged store (all verified against `nodedb-296`):

| Shard | Worktree path |
|---|---|
| `nd_src` | `nodedb/src` |
| `nd_tests` | `nodedb/tests` |
| `nd_sql` | `nodedb-sql` |
| `nd_cluster` | `nodedb-cluster` |
| `nd_types` | `nodedb-types` |
| `nd_vector` | `nodedb-vector` |
| `nd_rest` | worktree root (strip the `nd_rest/` prefix — every store path carries its shard prefix) |
| `rp_engine` | `~/Bumi-Hijau/rp-engine-py` (5,354 nodes; `rp_engine/modules/fleet_economy.py` → `~/Bumi-Hijau/rp-engine-py/modules/fleet_economy.py`; a worktree of it also exists at `~/wt-etl/rp-engine-py`) |
| `maya` | `~/scripts` (4,855 nodes; `maya/A3V.py` → `~/scripts/A3V.py`, `maya/acp-server.py` → `~/scripts/acp-server.py`) |

Those last two were missing until the 2026-09-25 end-to-end review: they are 15.0% of the store's 68,089 nodes, and any consumer that switches only on the seven `nd_*` shards silently drops them.

---

## 5. Reference implementation

### 5.1 DSH plugin — `dsh-drill` v0.8.0 (16 tools)

Every tool states what it writes, because whether a gate closes silently is the difference between a drill and a diary. `—` = writes no ledger record.

| Tool | Stage | Does | Writes |
|---|---|---|---|
| `drill_start` | — | open a task; reports which engine will answer stages 1–2 | `note` (`drill-start`) |
| `drill_error` | 1 | parse panic / backtrace / diagnostic / traceback → frames → symbols; toolchain and dependency frames are marked `external` instead of dropped | `locate` — repository frames as `files` + rendered chain as `text`; a signal that contains **no** repository frame (all `/rustc/`, `.cargo/registry/`, `node_modules/`, or a relative `library/std/…` panic header) is a **note only**, so nothing localizes by accident; skipped when no frame parsed, `record=false` suppresses |
| `drill_locate` | 1 | symbol or frame → definition, via cache → merged store, then text | `locate` — on a hit that resolves to a file **in this worktree**; on a miss, and on a store hit whose paths all live in other shards/worktrees, a note-only record (gate stays open) |
| `drill_blast` | 2 | callers, callees, transitive impact | `blast` — on a hit; note-only on a miss |
| `drill_diff` | 2 | branch diff → changed/deleted files, c2g reverse-edge dependents, proposed checklist | `blast` — only when the diff is non-empty and git did not error. If `${base}...HEAD` fails it falls back to the worktree diff and says so: the record then carries the fallback command and a note, and **no** `base` (a base that was never compared must not be printed as one) |
| `drill_search` | 1–2 | tgrep/rg text search for questions the graph cannot answer | nothing by default; records `locate`/`blast`/`edge` when `kind=` is passed — a zero-hit search writes the command and a note only, never evidence (rule 8) |
| `drill_record` | any | append evidence by hand | the named kind. Refuses a `test`/`hygiene` record without a log, a log outside the task's own `logs/` directory (rule 3), a `test` without `arm`; takes an explicit `head` so a hand-recorded `review`/`pr` can be commit-bound |
| `drill_run` | 4 | **run** a command, capture + hash the log | `test` or `hygiene` with `exit`, `sha256`, `head`, `branch`. A child killed by a signal is still recorded: `exit` = `128 + signo` (SIGSEGV → 139) and the signal is named in `note`, because "the test segfaults on base" is a canonical red proof, not a missing record |
| `drill_gate` | — | which gates hold, which are open, what is next | — |
| `drill_status` | — | active task, record count, recent records, gate state | — |
| `drill_report` | — | render gate table + evidence table → `.drill/<task>/report.md` | — |
| `drill_review` | 5 | Review 2: role-driven, read-only, budgeted reviewer subagent | `review` with `verdict`, `blockers`, `role`, `head` |
| `drill_pr` | 6 | render the PR body from the ledger, score it with the PR-craft core | `pr` with `bodyPath` + `head` — only when the lint **ran and** reported no blockers; a lint that crashed (`available: true` with an `error`) is not a clean body, and a missing PR-craft core is not a blocker either (the body is still written to disk) |
| `drill_index` | — | build/refresh the out-of-tree tgrep index (never inside the worktree) | `note` |
| `drill_cache` | — | `status` / `prune` / `clear` the derived cache | `note` |
| `drill_setup` | — | install the skill + auditor role into `~/.dsh/skills` and `~/.dsh/roles` | — |

Plus one `agent/turn-stopping` reminder: while an active task has open required gates, it injects a one-line notice naming them (advisory — it can never block a turn close).

**Config** (`cordis.patch.yml` row `drill`, every key has a default; a patch replaces the row's **whole** config, so restate every key you override):

| Key | Default | Meaning |
|---|---|---|
| `stateRoot` | `.drill` | per-task state directory, relative to the session workspace |
| `reminder` | `true` | register the turn-stopping open-gate notice (advisory) |
| `provider` | `spawn` | subagent provider for `drill_review` (`spawn` = fresh context, `fork` = inherits the parent prefix) |
| `model` | `''` | reviewer model override; a role file's own `model` wins |
| `defaultRole` | `drill-auditor` | role id `drill_review` audits with (project → user → bundled) |
| `maxReviewToolCalls` | `40` | fallback reviewer budget when the role sets none; `0` = unlimited |
| `runTimeoutMs` | `900000` | default timeout for `drill_run` |
| `requireLog` | `true` | refuse `test`/`hygiene` records whose log is missing, unreadable, or outside the task's `logs/` directory |
| `errorMaxResolve` | `12` | **cap on how many frames `drill_error` looks up in the graph** — a 40-frame backtrace resolves at most this many, the rest are reported `not-attempted` (bounds the cost of a deep backtrace) |
| `prLint` | `true` | score the rendered PR body with the PR-craft core before recording it |
| `prCore` | `~/scripts/pr_craft.py` | the shared PR-craft core (Kilo and Hermes use the same file) |
| `pythonBin` | `python3` | interpreter for the PR-craft core |
| `c2gEnabled` | `true` | use the per-project c2g cache |
| `c2gCacheDir` | `~/.cache/code2graph/projects` | c2g cache root |
| `sqliteBin` | `sqlite3` | sqlite3 executable for read-only queries |
| `c2gDepth` | `3` | default transitive-caller depth for `drill_blast` |
| `rippleDepth` | `2` | **how many reverse edges `drill_diff` walks when computing dependents** — depth 1 = direct dependents only, depth 2 = their dependents too (higher = a wider, slower ripple) |
| `searchEngine` | `auto` | `auto` picks `tgrep` only when an index covers the root, else `rg` |
| `tgrepIndexDir` | `<cacheDir>/tgrep` | out-of-tree index location |
| `autoIndex` | `false` | build a missing index on first search (a search never writes unless this is on) |
| `cacheDir` | `~/.cache/dsh-drill` | cache root, never `/tmp` |
| `cacheTtlDays` | `7` | idle TTL for cached discovery + indexes; `0` disables expiry |
| `embedEnabled` | `true` | use the merged c2g store as the second layer |
| `embedStore` | `~/Embed/c2g/graph_index.sqlite` | path to the merged store |
| `embedRepoMap` | `''` | shard overrides, e.g. `nd_src=nodedb/src,nd_sql=nodedb-sql` |

**Ships**: `skills/drill/SKILL.md` (the SOP), `roles/drill-auditor.md` (read-only tools + budget, in the `dsh-plugin-subagent-roles` frontmatter format).

### 5.2 Kilo / Hermes — shared cores and agents

| Piece | Path | Role in the drill |
|---|---|---|
| c2g core | `~/scripts/c2g_tools.py` v1.1.0 | `frame` / `error` + the eight existing query tools; cache → merged store → binary. Built on [farhan-syah](https://github.com/farhan-syah)'s [`NodeDB-Lab/code2graph`](https://github.com/NodeDB-Lab/code2graph) CLI (see §4.0) |
| Kilo frontend | `~/.kilo/plugins/c2g/server.ts` | `c2g_error`, `c2g_def`, `c2g_blast_radius`, `c2g_diff_impact`, … |
| Hermes frontend | `~/.hermes/plugins/c2g/{tools,schemas,__init__}.py` + `plugin.yaml` | same tools, one core |
| PR core | `~/scripts/pr_craft.py` | `lint-desc`, `lint-comment`, `lint-diff`, `plan`, `checklist`; 10-case selftest |
| PR frontends | `~/.kilo/plugins/pr-craft`, `~/.hermes/plugins/pr-craft` | thin wrappers, capped injection (2×/session) |
| Review 2 agent | `~/.kilo/agent/parity-auditor.md` | fresh-session read-only audit; loads the parity-audit skill |
| Test executor | `~/.config/kilo/agents/test-runner.md` | exit code, pass/fail counts, verbatim failing names, timing (this file is **not** mirrored in `~/.kilo/agent/` — only `parity-auditor.md` and `ci-runner.md` live there) |
| CI executor | `~/.kilo/agent/ci-runner.md` | long background parity jobs, per-phase verdicts |
| Safety net | `~/.kilo/plugins/codetrack/server.ts` | shadow-git snapshot before mutating calls; never blocks |
| Review 2 skill | `~/.hermes/skills/devops/nodedb-parity-audit/SKILL.md` | the 7-item checklist + verdict table contract |

**Missing on the Kilo side:** any enforcement. `maya-guardian` is archived; every remaining plugin injects text or reports. The gate lives only in the DSH plugin.

### 5.3 What to run where

- **DSH** (`tkg-web` / `drill` profile): full drill, ledger, gates, review, PR.
- **Kilo**: `c2g_error` for the first mile, `parity-auditor` for Review 2, `pr-craft` for the body — but record evidence by hand or point it at the DSH ledger.
- **Both**: the same c2g core, the same PR core, the same parity-audit skill.

---

## 6. Operating the drill

```bash
# 0. one-time
dsh plugin --profile <profile> add ~/projects/dsh-drill
drill_setup                                  # installs the skill + auditor role
drill_index                                  # tgrep index for this repo (out-of-tree)
```

```
# 1. open the task (names the engine that will answer stages 1–2)
drill_start task=issue314 repo=~/projects/nodedb-314 base=origin/main issue=314

# 2. from the failure signal
drill_error error="<paste the panic / backtrace / compiler output>"
#    → frames → symbols, toolchain frames marked external, records `locate`

# 3a. by symbol / frame
drill_locate symbol=nextval_batch
drill_locate file=nodedb/src/control/sequence/registry.rs line=231

# 3b. or by text when the graph has no answer
drill_search pattern="SequencePerRowUnsupported" kind=blast

# 4. blast radius
drill_blast symbol=catalog_err
drill_diff base=origin/main          # changed files + dependents + proposed checklist

# 5. edge cases (your invariants; the diff checklist is only an input)
drill_record kind=edge stage=edge text="empty registry; concurrent allocate; restart mid-txn"

# 6. red → green → hygiene (the plugin runs these)
drill_run stage=patch arm=base cmd="bash ~/scripts/nodedb-cargo.sh . nextest run -p nodedb -E 'test(~seq_per_row)'"
drill_run stage=patch arm=fix  cmd="bash ~/scripts/nodedb-cargo.sh . nextest run -p nodedb -E 'test(~seq_per_row)'"
drill_run stage=patch kind=hygiene cmd="bash ~/scripts/nodedb-preflight.sh . origin/main"

# 7. Review 2 (fresh, read-only, budgeted)
drill_review                          # role defaults to drill-auditor

# 8. what is left?
drill_gate
drill_report                          # .drill/issue314/report.md

# 9. PR body from the ledger, linted by the shared core
drill_pr title="fix: guard the empty sequence registry" why="A missing sequence panicked the shard."
```

### Verified example — the failure signal path

Input: a real-shaped panic on `nodedb-296` (no per-worktree c2g cache):

```
thread 'wal-writer' panicked at nodedb/src/control/sequence/registry.rs:231:13:
called `Option::unwrap()` on a `None` value
   1: nodedb::control::sequence::registry::nextval_batch
             at ./nodedb/src/control/sequence/registry.rs:231:13
   2: nodedb::control::sequence::SequenceRegistry::allocate
             at ./nodedb/src/control/sequence/types.rs:95:9
```

Output:

```
message: called `Option::unwrap()` on a `None` value
frames: 4 (2 resolved, 2 external)
  nodedb/src/control/sequence/registry.rs:231:13 → nextval_batch [Method] (c2g-embed)
  /rustc/9d1c70f/library/std/src/panicking.rs:597:5 (external)
  nodedb/src/control/sequence/types.rs:95:9 → nextval_batch [Method] (c2g-embed)
  ~/.cargo/registry/…/tokio/src/runtime/task/raw.rs:271:5 (external)
gate: pass:localize
```

Same call on `nodedb-305` answers via `c2g-cache` instead. `catalog_err` blast radius: 40 resolved call sites, 60 transitive callers, 24 files.

---

## 7. Risks and known failure modes

| Risk | Evidence | Mitigation |
|---|---|---|
| The c2g binary can hang for minutes | `c2g status` / `c2g def --at-file` exceeded 60 s on `nodedb`, `nodedb-305` | cache-first resolution; binary last |
| A stale/garbage c2g cache claims coverage | a cache rooted at the home directory, with no snapshot, matched every repo | require an active scope snapshot; prefer the most specific root |
| The merged store is a snapshot, not HEAD | `~/Embed/c2g` built 2026-09-24 | the record carries the build time; precedence keeps the live cache first |
| Text search can be mistaken for a call graph | tgrep/rg answer with occurrences | records are labelled `text-level`; transitive impact is never produced by text |
| A CI/gate that never runs looks like a pass | `dsh-plugin-doctor` exit 6 names exactly this | `drill_gate` must be called; `pre-push` refuses without a ready ledger |
| Reviewer runs out of context or tools | budget + read-only policy | `drill_review` aborts at the cap and records FAIL with what it has |
| Local models are not agentic | this machine's local tier is Stheno (RP finetune); it answered a tool-shaped prompt with prose | the drill needs a tool-capable model; keep the agent loop on a capability-tested model |
| `pre-push` is bypassable | `git push --no-verify` skips it — git's documented behaviour, not a drill bug | pair it with a server-side branch-protection check when pushes go through a hosted remote; otherwise it is a known trust boundary for human commits (agents do not pass `--no-verify` unless told to) |
| A miss counted as evidence | v0.7.0 shipped it: `drill_locate`/`drill_blast` misses closed their own gates. v0.7.1 fixed those two, but **`drill_search` kept the old shape** — a zero-hit search recorded as `locate`/`blast`/`edge` wrote `text: "no hits for <pattern>"`, which the gate counts as evidence | fixed in v0.7.3 on the shared path, with a two-sided regression test (a miss stays open, a hit closes it) |
| The PR body outliving its commit | `drill_pr` recorded no `head` in v0.7.0 | `pr` now records `head`, and the gate reopens when it is not the green proof's commit |
| A gate that closes on a record with no commit at all | the 2026-09-25 end-to-end review: the `review`/`pr` staleness test was skipped when the record carried no `head` (`last?.head !== undefined && …`), and `drill_record` had no `head` argument — so a hand-written `review` with `PASS`/0 blockers closed a required gate unbound | v0.8.0: a missing `head` is as stale as a wrong one, and `drill_record` takes an explicit `head` |
| A hand-written "proof" | the same review: `drill_record kind=test arm=fix exit=0 log=<any readable file>` closed `green` — the write-time check only proved the file existed | v0.8.0: a `test`/`hygiene` log must sit in the task's own `logs/` directory, `test` records need an `arm`, `hygiene` needs a log; the residual trust boundary is documented in §3.1 |
| A red proof that never got recorded | a test that dies by signal (`SIGSEGV`/`SIGABRT`) reports exit `null` to Node, and the ledger refuses a non-integer exit — so the canonical "it crashes on base" proof produced **no record at all** | v0.8.0: `exit = 128 + signo` (SIGSEGV → 139) with the signal named in `note`; regression test kills a shell with `SIGSEGV` |
| A toolchain-only backtrace counted as localization | the same review: `drill_error` wrote `files: []` plus unconditional `text`, and `lib/errors.js` matched toolchain paths only when absolute — so a panic whose header reads `library/std/src/panicking.rs:597` localized to a file that does not exist in the worktree | v0.8.0: relative toolchain/dependency prefixes are external too, and a signal with no repository frame is a note only |
| A store hit in another worktree counted as localization | the same review: `drill_locate`'s merged-store fallback wrote `text` whenever the store knew the name, even when no hit existed in this worktree | v0.8.0: it is a note-only record; the gate stays open until a hit maps into the worktree |
| A fallback diff labelled with a base that was never compared | the same review: `diffFiles` retried `git diff … HEAD`, returned `error: null`, and the record then printed `base` and a `${base}...HEAD` command | v0.8.0: the fallback is flagged, recorded as its own command, and carries no `base` |
| A lint that crashed read as clean | the same review: `clean = !lint.available \|\| blockers.length === 0`, and `lintPrBody` reports `available: true` with an `error` when the core crashes | v0.8.0: `clean` requires the lint to have run without error |
| Service restarts invalidate open tabs (a separate bug we fixed today) | `dsh-auth-proxy` WS tunnel had no 401 re-exchange; reproduced with Playwright | proxy fix + `play-tools.js` wedge watchdog — recorded in the session log, not part of the drill |

---

## 8. Appendices

### A. Gate reference

| id | required | passes when |
|---|---|---|
| `localize` | no | ≥1 `locate` record with files or text |
| `blast` | no | ≥1 `blast` record with files/symbols/text |
| `edge` | no | ≥1 `edge` record with text |
| `red` | **yes** | a `test` record with `arm=base`, `exit ≠ 0`, and a hashed log |
| `green` | **yes** | a `test` record with `arm=fix`, `exit = 0`, and a hashed log |
| `hygiene` | **yes** | a `hygiene` record with `exit = 0` and a hashed log |
| `review` | **yes** | the last `review` record is `PASS` with 0 blockers and names the **same commit as the green proof**. A record that names no commit, or a different one, leaves the gate open |
| `pr` | no | a `pr` record with a `bodyPath` for the same commit as the green proof (a body rendered for an older commit — or for no commit at all — reopens it) |

### B. Verification commands

```bash
cd ~/projects/dsh-drill && npm test           # 97 tests: core, c2g SQL, cache, embed, search, git/role, errors, pr, integration
node --test test/integration.test.js          # the end-to-end drill through the real DSH tool runtime
python3 ~/scripts/pr_craft.py selftest        # 10-case PR-lint regression
python3 ~/scripts/c2g_tools.py run --stdin <<< '{"tool":"error","text":"panicked at nodedb/src/control/sequence/registry.rs:231:13:\nboom","root":"$PWD"}'
dsh --profile drill --dump-config             # profile wiring (see the note below before using `plugin list`)
cd ~/projects/deepseek-harness && node apps/cli/lib/bin.js drill --port 3999 --no-open   # scratch boot (never the live profile)
```

**Two of these need a caveat on this machine (measured 2026-09-25).** `dsh plugin --profile drill list` exits **127** with `pnpm was not found` — the running GUI server was started before pnpm was installed, so any `dsh plugin` subcommand needs either `PATH` including `~/.local/share/pnpm/bin` or a server restart; `dsh --profile drill --dump-config` is the read-only check that works either way, and the scratch boot needs `node apps/cli/lib/bin.js` from the checkout because `dsh` itself is not on `PATH` here.

### C. File inventory

| Path | What |
|---|---|
| `~/projects/dsh-drill/` | the plugin, its skill, role, README, 97 tests |
| `~/projects/dsh-drill/lib/{ledger,gates,errors,pr,c2g,embed,search,git,role,runner,cache,report}.js` | the logic |
| `~/scripts/c2g_tools.py` | shared c2g core (v1.1.0) incl. `frame`/`error` |
| `~/.kilo/plugins/c2g/server.ts`, `~/.hermes/plugins/c2g/**` | the two c2g frontends |
| `~/scripts/pr_craft.py` + `~/.kilo/plugins/pr-craft`, `~/.hermes/plugins/pr-craft` | PR craft |
| `~/.kilo/agent/parity-auditor.md`, `~/.kilo/agent/ci-runner.md`, `~/.config/kilo/agents/test-runner.md` | drill agents (`test-runner.md` exists only under `~/.config/kilo/agents/`; `~/.kilo/agent/` holds the other two plus `ds-worker.md`, `maya.md`, `mk.md`) |
| `~/.hermes/skills/devops/nodedb-parity-audit/SKILL.md` | Review 2 checklist |
| `~/.cache/dsh-drill/` | discovery cache + tgrep indexes (7 worktrees indexed) |
| `~/Embed/c2g/graph_index.sqlite` | merged c2g store (nodes/links) — this machine's layer, not upstream |
| [`NodeDB-Lab/code2graph`](https://github.com/NodeDB-Lab/code2graph) | the upstream c2g library + CLI, by [farhan-syah](https://github.com/farhan-syah); local clone at `~/projects/code2graph` |
| `~/projects/kilo-plugins-drill-review-20260925.md` | the review this work came out of |
| `~/projects/DRILL-E2E-REVIEW-20260925.md` | the 2026-09-25 end-to-end review of this document and the plugin (defects, fixes, unverified items) |

### D. One-page cheat sheet

```
drill_start → drill_error → (drill_locate | drill_search) → drill_blast → drill_diff
           → drill_record edge → drill_run base(≠0) → drill_run fix(=0) → drill_run hygiene(=0)
           → drill_review → drill_gate → drill_report → drill_pr

rule 1: red before green
rule 2: no log, no evidence
rule 3: the plugin runs the command
rule 4: evidence names its commit
rule 5: the auditor never wrote the code
rule 6: a claim without evidence is refused
rule 7: one issue, one PR
rule 8: a miss is a note, not evidence
```

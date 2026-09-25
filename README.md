# The drill kit

One repository for the whole drill: the DSH plugin that enforces it, the two shared Python cores it borrows, the Kilo/Hermes frontends for those cores, and every document the work produced.

`dsh` = DeepSeek Harness. The **drill** is one bug fix run as a pipeline with gates — localize from the failure signal, map the blast radius, enumerate the edge cases, prove **red** (fails on base) then **green** (passes with the fix), pass hygiene, pass a fresh-context read-only **Review 2**, then produce the PR — with every claim backed by an artifact in a ledger. "Done" is not a sentence; it is a gate evaluation.

## Layout

| Path | What |
|---|---|
| `index.js`, `lib/`, `test/`, `skills/`, `roles/`, `cordis.patch.yml`, `package.json` | **the DSH plugin** — 16 tools, 107 tests, the gate implementation and the ledger. This is the root package, so the repo itself installs as a plugin. |
| `core/c2g_tools.py` | the c2g core (stdlib only): `frame`, `error` and the query tools — cache → merged store → binary |
| `core/pr_craft.py` | the PR-craft core (stdlib only): `lint-desc`, `lint-comment`, `lint-diff`, `plan`, `checklist` |
| `frontends/kilo/`, `frontends/hermes/` | thin frontends that expose the two cores as plugins in those runtimes |
| `docs/` | the specification, the reviews, and a generated source bundle for reviewers |
| `tools/build-source-bundle.mjs` | regenerates `docs/DRILL-PLUGIN-SOURCE-BUNDLE-*.md` from the git revision |

## Install the plugin

**The script does it**, from a checkout or piped straight from GitHub — no npm registry, no API token:

```sh
./install.sh --profile web                 # official `dsh plugin add` (needs pnpm on PATH)
./install.sh --profile web --link          # symlink install: no pnpm, no network
./install.sh --profile web --skills --frontends --verify
./install.sh --profile web --uninstall

curl -fsSL https://raw.githubusercontent.com/EnRaiha/dsh-drill-kit/master/install.sh \
  | bash -s -- --profile web --dry-run      # prints every action, writes nothing
curl -fsSL https://raw.githubusercontent.com/EnRaiha/dsh-drill-kit/master/install.sh \
  | bash -s -- --profile web --link
```

It finds the DSH checkout itself (`dsh` on `PATH`, `$HOME/projects/deepseek-harness`, or a checkout beside this repo), falls back from the plugin manager to a link install when pnpm or the network is missing, backs up a profile's `package.json` as `.bak-drill` before editing it, keeps a copy of any skill or role file it would overwrite, refuses to replace a live frontend directory unless you pass `--force`, and never restarts anything. `--dry-run` prints every action without writing.

Flags: `--profile <name>` (default `web`), `--dsh <checkout|bin.js>`, `--link`, `--manager`, `--skills`, `--frontends`, `--verify`, `--uninstall`, `--force`, `--dry-run`.

```sh
dsh plugin --profile <profile> add dsh-drill              # from npm
dsh plugin --profile <profile> add dsh-drill@0.8.4        # pinned
dsh plugin --profile <profile> add /path/to/dsh-drill-kit # local checkout
dsh plugin --profile <profile> add github:EnRaiha/dsh-drill-kit#v0.8.6
```

The plugin imports host modules that the DSH runtime provides (`@deepseek-ai/dsh-tools`, `dsh-llm`, `dsh-subagent`). All three are declared as **optional** peers: the host supplies them through the profile's own resolution, a missing host still fails loudly at import, and a fresh install stays quiet instead of printing `missing peer` for packages the user must not install. `@deepseek-ai/schemastery` is different — a runtime validator, not a host service — so it ships as a regular `dependencies` entry.

Or by hand:

```sh
# from a checkout
node <dsh-checkout>/apps/cli/lib/bin.js plugin --profile <profile> add /path/to/dsh-drill-kit
# or straight from the repo once it is public
dsh plugin --profile <profile> add github:EnRaiha/dsh-drill-kit
```

The plugin row is declared in `cordis.patch.yml` (`dsh.bundle.patch` in `package.json`), which is what both the DSH profile manager and the awesome-dsh-plugin catalog read. Restart the runtime after adding it: host-side plugin rows are composed at boot.

## Run the tests

```sh
node --test test/*.test.js           # 107 tests, 0 failures
node tools/build-source-bundle.mjs   # refresh docs/DRILL-PLUGIN-SOURCE-BUNDLE-*.md
```

`test/integration.test.js` loads the real `@deepseek-ai/dsh-tools` runtime, compiles every tool schema against the real DSL, and drives whole drills through the real `execute()` path. It needs the host packages reachable from this checkout; when they are not, it **skips itself** instead of failing — so a standalone consumer sees a smaller count, never a false red. To wire them up:

```sh
mkdir -p node_modules/@deepseek-ai
for p in llm/llm subagent/subagent core/tools; do
  ln -sfn "$DSH_CHECKOUT/packages/$p" "node_modules/@deepseek-ai/dsh-$(basename $p)"
done
ln -sfn "$DSH_CHECKOUT/vendor/schemastery" node_modules/@deepseek-ai/schemastery
```

## Docs

`docs/README.md` indexes them. The short version: **`DRILL-BUG-AND-PLUGIN-FULL-DOC`** is the canonical specification (it folds in both reviews and the risk register), and **`DRILL-PLUGIN-SOURCE-BUNDLE`** is a generated snapshot — every tracked file plus per-file hashes and a recorded test run — so a reviewer can audit the plugin without repo access.

## Credits and upstream

The drill stands on other people's work, and the c2g layer is theirs:

| Project | Who | What this kit uses |
|---|---|---|
| [NodeDB-Lab/code2graph](https://github.com/NodeDB-Lab/code2graph) | [farhan-syah](https://github.com/farhan-syah) (NodeDB founder), with CLI fixes by [EnRaiha](https://github.com/EnRaiha) | the `c2g` library + CLI, and the per-project SQLite cache whose tables `drill_locate` / `drill_blast` query. Deliberately storage-neutral — every consumer brings its own store. |
| [NodeDB-Lab/nodedb](https://github.com/NodeDB-Lab/nodedb) | the NodeDB-Lab org | the repository the drill was built and exercised against; its shards are the merged store's `nd_*` repo keys |
| [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) | the catalog maintainers | the plugin conventions this repo follows (`dsh.bundle.patch`, `dsh-` naming) and the catalog a plugin can be listed in |

What is *this* repository's own work: the gate implementation and ledger (`index.js`, `lib/`), the drill skill and auditor role, the merged-store/embedding fallback in `lib/embed.js`, and the two Python cores' drill-facing tools (`c2g_error`, `c2g_frame`).

## Status

`dsh-drill` **v0.8.6** · 16 tools · 107 tests · loads on DSH `0.1.6-alpha.2`. Two reviews are recorded in the docs; every defect they found is fixed with a regression test, and the ones that could not be settled are listed as unverified rather than assumed.

## Licence

MIT — see `LICENSE`.

---

The package documentation follows.

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
| 4 Surgical patch | **`red`** | the latest `test` run with `arm=base` **fails**, with a captured log — a later base run that passes reopens it |
| | **`green`** | the latest `test` run with `arm=fix` **passes**, with a captured log — a pass recorded before the last edit does not survive a later failing run |
| | **`hygiene`** | the latest `hygiene` run (fmt/clippy/preflight) exited 0; a later dirty run reopens it |
| 5 Review | **`review`** | a `review` record with `verdict=PASS`, `blockers=0`, **and the same commit as the green proof**; a later FAIL or a moved HEAD reopens the gate |
| 6 PR | `pr` | a `pr` record pointing at the PR body file **rendered for the green proof's commit**; `drill_pr` records one only when the lint ran without blockers, and new commits reopen both `review` and `pr` |

`red`, `green`, `hygiene` and `review` are **required** before `drill_gate` reports `ready`. The rest are advisory gates that describe where the work stopped.

## Tools

| Tool | What it does |
|---|---|
| `drill_start` | open a task: ledger + `active.json` + gate report |
| `drill_error` | stage 1 from the signal: parse a panic, backtrace, compiler diagnostic or traceback into `file:line` frames and resolve each frame to its symbol (cache → merged store). Toolchain and dependency frames — including a relative `library/std/…` panic header — are marked `external`, and a signal with no repository frame records a note instead of `locate` evidence. |
| `drill_locate` | stage 1 over the local c2g cache: symbol name, or `file`+`line` from a stack frame → exact definition. Records `locate`. |
| `drill_blast` | stage 2 over the same cache: call sites, transitive callers to a bounded depth, callees. Records `blast`. |
| `drill_diff` | stage 2b from git: changed files against the base ref, deleted files, the files that depend on them (c2g reverse edges), and a proposed manual-test checklist. Records `blast` — and if the base ref cannot be compared it falls back to the worktree diff, recording the fallback command and a note instead of a `base` it never used. |
| `drill_search` | text search with `tgrep` (trigram index) or `rg`: for questions the graph cannot answer — a config key, an error string, a SQL fragment, a doc claim. Optionally records the hits as `locate`/`blast`/`edge` evidence, always labelled text-level. |
| `drill_index` | build or refresh the **out-of-tree** tgrep index for the drill repository, so stages 1–2 stop scanning: the index lands in the cache directory, never inside the worktree, and `git status` stays clean. Prunes idle indexes on the way. |
| `drill_cache` | `status` / `prune` / `clear` the derived cache: sizes, entry counts, the idle TTL, and what pruning freed. |
| `drill_pr` | stage 7: render the PR body from the ledger (why, changed files, red/green/preflight rows with exit codes and commits, Review 2 verdict, gate table), write it, score it with the PR-craft core, and record `pr` evidence only when the lint ran without blockers (a crashed lint is not a clean body). |
| `drill_run` | run a command, stream output into `.drill/<task>/logs/`, hash the log, record the exit code **and the commit it ran on**. This is the only way to produce a test proof: a `test`/`hygiene` record whose log sits outside the task's `logs/` directory is refused. A child killed by a signal is recorded as `128 + signo` (SIGSEGV → 139) with the signal in `note` — "it crashes on base" is a red proof, not a missing record. |
| `drill_record` | record non-command evidence: locate/blast/edge/review/pr/note. Refuses an unarmed `test`, a `test`/`hygiene` record without a log, and a log outside the task's own `logs/` directory; takes an explicit `head` so a hand-recorded `review`/`pr` can be bound to the commit it reviewed. |
| `drill_gate` | which gates hold, which are open, and what the next step is |
| `drill_status` | active task, record count, last records, gate state |
| `drill_report` | render the report (gate table + test evidence with exit codes and log hashes) and write `.drill/<task>/report.md` |
| `drill_review` | spawn Review 2: fresh-context, read-only reviewer subagent driven by a **role file** (`drill-auditor` by default — project `.dsh/roles`, then `~/.dsh/roles`, then bundled), with a hard tool-call budget; records the verdict bound to the reviewed commit |
| `drill_setup` | install the bundled skill and auditor role into `~/.dsh/skills/drill/` and `~/.dsh/roles/` |

The plugin also registers one `agent/turn-stopping` listener: while an active task has open required gates, it injects a one-line reminder naming them. It is advisory — it can never block a turn close.

## Install

```sh
# from this checkout (dev): link into a profile, then boot
dsh plugin --profile <profile> add ~/projects/dsh-drill-kit
node apps/cli/lib/cli.js <profile> --dump-config | grep -A2 'id: drill'
```

The plugin row ships in `cordis.patch.yml` as one entry (`id: drill`, `name: dsh-drill`); installing the bundle appends `dsh-drill` to the profile's `dsh.profile.bundles` automatically.

**Dev-mode resolution.** A `link:` install resolves `@deepseek-ai/*` imports from the *link target*, which escapes `$DSH_HOME/profiles/node_modules` (the host's module fallback) — so a linked checkout needs the host packages reachable from this directory:

```sh
mkdir -p node_modules/@deepseek-ai
H=${DSH_CHECKOUT:-$HOME/projects/deepseek-harness}
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
| `maxReviewToolCalls` | `40` | Fallback budget when the role sets none; `0` disables the cap. A role's own `maxToolCalls` always wins, including `0` — v0.8.1 fixed a case where a role saying `0` was silently overridden by this fallback. Exceeding the budget aborts the child and records FAIL. |
| `runTimeoutMs` | `900000` | Default timeout for `drill_run`. |
| `errorMaxResolve` | `12` | Cap on frames `drill_error` resolves against the graph. |
| `requireLog` | `true` | Refuse a `test`/`hygiene` record whose log is missing, unreadable, or outside the task's own `logs/` directory. Set `false` to accept a log path from elsewhere — the ledger then records the hash without checking where it came from. |
| `prLint` | `true` | Score the rendered PR body with the PR-craft core before recording it. |
| `prCore` | `''` (auto) | Explicit path to the PR-craft core. Left empty, the plugin resolves `PR_CRAFT_CORE`, then the copy that ships with the package (`core/pr_craft.py`), then `~/scripts/pr_craft.py` — so a fresh install lints without configuring anything. A non-empty value that does not exist is refused by `drill_pr` rather than recorded unlinted. |
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

**Which "c2g"?** Three different things share the name: the upstream extractor is **[farhan-syah](https://github.com/farhan-syah)'s [`NodeDB-Lab/code2graph`](https://github.com/NodeDB-Lab/code2graph)** (the `c2g` binary, called only as a last resort); the **per-project cache** `~/.cache/code2graph/projects/<key>/cache.sqlite3` is layer 1 below; and **`~/Embed/c2g`** is this machine's merged store, built by `~/scripts/merge_c2g_shards.py`, layer 2.

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
               (~/Embed/c2g/graph_index.sqlite (built 2026-09-24T05:24:54+0800)); tgrep index ready
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

The rule reaches every tool that can write one of those kinds: `drill_locate`, `drill_blast`, `drill_search` when it is asked to record (`kind: locate|blast|edge`), `drill_error` when every frame is toolchain or dependency, and `drill_locate`'s merged-store fallback when the store knows the symbol but no hit resolves to a file in this worktree. Each of them writes the command it ran and `… — the <gate> gate stays open`, never a `text` field that the gate would count.

That path is where the fix took four releases, and the sequence is worth keeping: **v0.7.0** shipped the bug (a negative result closed the gate it was supposed to feed), **v0.7.1** fixed `drill_locate`/`drill_blast` and added a regression test, **v0.7.3** found that `drill_search` still wrote `text: "no hits for <pattern>"` on a zero-hit search, and the **v0.8.0 end-to-end review** found the same shape in two more places — `drill_error` on a backtrace with no repository frame, and the merged-store fallback when every hit lives in another worktree. Each test is two-sided where it can be: a miss stays open **and** a hit closes the gate, so "never closes" cannot pass either.

## Ledger concurrency and torn writes

Each record is one synchronous `O_APPEND` write of a newline-terminated line; there is no lock file, so **one writer per task** is the rule. On read, an unterminated final line (the shape a crash mid-append leaves) is skipped, while a complete line that fails to parse refuses evaluation with its line number.

## The PR body comes from the ledger

`drill_pr` renders the body from evidence rather than from prose: the verification table is built from `test` and `hygiene` records (command, exit code, log name, commit), the changed-file list comes from `blast` records, and the Review 2 line comes from the `review` record. A body without a red proof says so in a blockquote instead of implying one.

It is then scored by the **existing** PR-craft core (`core/pr_craft.py lint-desc`, shared with the Kilo and Hermes plugins — one logic core, no drift), and `pr` evidence is recorded **only when the lint reports no blockers**. When the lint could not run at all, the record says so: `recorded without PR-craft lint (…)`, so an unscored body never looks scored. A blocked body is still written to disk so the author can fix it, while the `pr` gate stays open.

## Cache and expiry

Everything the plugin can rebuild lives under one root — `~/.cache/dsh-drill` — and never under `/tmp`, which the host may wipe between sessions:

```
~/.cache/dsh-drill/
  c2g-discovery.json      # repository path -> the c2g database that answered, with its snapshot id
  tgrep/<root-slug>/      # out-of-tree trigram indexes
```

**One week idle time to live.** Three rules keep it honest:

- **The active scope snapshot is picked deterministically.** Upstream keys `active_snapshots` by `(resolver_tier, completeness)` with `completeness IN (0,1)`, so a cache can hold a partial graph and a complete one at the same time. Every query reads `… WHERE resolver_tier='scope' ORDER BY completeness DESC LIMIT 1`: the complete snapshot wins, a partial one is used only when it is all the cache has, and — because all queries share that fragment — symbols and edges never come from two different snapshots. When only a partial snapshot answered, the record says `partial scope snapshot, callers may be under-reported` instead of presenting an incomplete graph as the graph.
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
- **Evidence is bound to a commit** — `drill_run` records `head` + `branch`; `drill_review` records `head`. The `review` gate reopens when HEAD moved after the review, and the report names the commit evidence belongs to (or lists the commits it spans). A review that names **no** commit is as stale as one that names the wrong one — v0.8.0 closed the hole where a head-less record skipped the comparison entirely.
- **`lib/git.js`** — read-only git queries (`rev-parse HEAD`, branch, `diff --name-only`) that answer null/empty outside a repository instead of throwing.
- **`drill_search` + `lib/search.js`** — tgrep/rg text search as the honest fallback for stages 1–2, with engine auto-selection and text-level labelling.
- **`drill_error` + `drill_pr`** — the drill now starts from the failure signal (frames resolved to symbols, toolchain frames marked external) and ends with a PR body rendered from the ledger and scored by the shared PR-craft core, recorded only when the lint is clean.
- **merged c2g store as the second resolution layer** — `~/Embed/c2g/graph_index.sqlite` answers for every worktree of a repository through a verified shard-path map, so a missing per-worktree cache no longer costs the drill its resolved call graph (it previously fell straight to text search). The store's build time is carried into every record it produces.
- **`drill_cache` + one expiring cache root** — discovery results and indexes share `~/.cache/dsh-drill`, the TTL is idle-based with a week's default, stale entries are dropped on read (a database that vanished, or an entry recorded before coverage required a snapshot), and `drill_cache status|prune|clear` makes the whole thing inspectable. c2g discovery also stops re-probing every project directory with a sqlite3 process on each call.
- **`drill_index` + out-of-tree indexes** — `--index-path` support keeps the trigram index in `~/.cache/tgrep-index/`, so coverage is added without dirtying a worktree; `drill_start` names the engine that will answer; c2g discovery now picks the **most specific** matching cache root (with an active snapshot preferred), so a stale cache indexed at a parent directory cannot shadow the real one.

## Verification

```sh
npm test        # node --test test/*.test.js — 107 tests
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

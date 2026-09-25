# dsh-drill-kit — complete source bundle for review

*Revision: **v0.8.3**, source revision `90312d25e71c` on branch `master`, tree DIRTY (the revision that last touched the files below, not HEAD — the bundle itself is committed after them). Generated 20260925. Every file below is the exact committed content at that revision; the sha256 in the inventory lets a reviewer confirm the exact bytes.*

**Why this file exists.** A review that only receives `index.js` cannot judge the twelve `lib/*.js` modules the host imports, the nine test files that pin the behaviour, or the skill/role text the reviewer subagent is driven by — that is where the gates, the ledger, the c2g resolver and the audit persona actually live. This bundle carries every tracked file, so a line-by-line review can cover the whole kit, and it records the test run so a read-only reviewer does not have to execute anything.

## Inventory

| File | Lines | Bytes | sha256 (first 16) | Tests declared |
|---|---|---|---|---|
| `.github/workflows/publish.yml` | 37 | 1270 | `8392c0bbbcb091b4` | — |
| `.gitignore` | 4 | 28 | `1adbb37be33001da` | — |
| `LICENSE` | 22 | 1064 | `2f841f07845b05a9` | — |
| `README.md` | 356 | 33629 | `f3e36d5f6d0176cc` | — |
| `cordis.patch.yml` | 9 | 300 | `7b935022f8a8569a` | — |
| `core/README.md` | 39 | 2842 | `63a0a42187d0161a` | — |
| `core/c2g_tools.py` | 674 | 26464 | `bc13afe99510c89e` | — |
| `core/pr_craft.py` | 488 | 26669 | `eb02e28af4b86fc5` | — |
| `docs/README.md` | 28 | 2891 | `d617a76955e43ba7` | — |
| `frontends/README.md` | 46 | 2336 | `3c88c71470530bd6` | — |
| `frontends/hermes/c2g/SKILL.md` | 89 | 5510 | `ea3640f117e6a831` | — |
| `frontends/hermes/c2g/__init__.py` | 31 | 1592 | `4fe73484f698bcf9` | — |
| `frontends/hermes/c2g/plugin.yaml` | 19 | 606 | `065e2ac6fab5cf2a` | — |
| `frontends/hermes/c2g/schemas.py` | 149 | 4697 | `75329da0f32aa83c` | — |
| `frontends/hermes/c2g/tools.py` | 224 | 7771 | `9dc77ddb621edc1a` | — |
| `frontends/hermes/pr-craft/__init__.py` | 32 | 1540 | `73d4ae01ec17c89d` | — |
| `frontends/hermes/pr-craft/plugin.yaml` | 15 | 436 | `5d2fc24e022bc9b3` | — |
| `frontends/hermes/pr-craft/schemas.py` | 94 | 3204 | `14eab8eb275477bd` | — |
| `frontends/hermes/pr-craft/tools.py` | 255 | 9896 | `a50a857e3e102460` | — |
| `frontends/kilo/c2g/SKILL.md` | 78 | 4439 | `045a42f0fe54e2b7` | — |
| `frontends/kilo/c2g/server.ts` | 234 | 9769 | `21cd0390bce4fd2f` | — |
| `frontends/kilo/pr-craft/SKILL.md` | 88 | 4226 | `52a78c21b4475ca2` | — |
| `frontends/kilo/pr-craft/server.ts` | 267 | 11512 | `f430a13745164029` | — |
| `index.js` | 1598 | 80475 | `466a829fdc44a48c` | — |
| `install.sh` | 264 | 10719 | `d4c518a396110649` | — |
| `lib/c2g.js` | 350 | 16752 | `e3e32966ff0fc0f2` | — |
| `lib/cache.js` | 158 | 4455 | `20d40379c8ebd093` | — |
| `lib/embed.js` | 291 | 12389 | `e668f9982e542349` | — |
| `lib/errors.js` | 198 | 8128 | `93302e8fbf464dfb` | — |
| `lib/gates.js` | 173 | 7395 | `dcc11c0d346e7ef5` | — |
| `lib/git.js` | 82 | 3037 | `726f3288b7d322b2` | — |
| `lib/ledger.js` | 188 | 7827 | `a7844bfdd7350b77` | — |
| `lib/pr.js` | 141 | 5828 | `6eb4c8b520ce3dfe` | — |
| `lib/report.js` | 64 | 2584 | `67dea8b82fbfc52c` | — |
| `lib/role.js` | 161 | 6175 | `a598d2bca4a2b564` | — |
| `lib/runner.js` | 91 | 3367 | `c4c1b3d80baba0e8` | — |
| `lib/search.js` | 303 | 12658 | `e973f0abbc09846d` | — |
| `package.json` | 70 | 1946 | `4a51ec81014972df` | — |
| `roles/drill-auditor.md` | 55 | 3019 | `107e089732dc1579` | — |
| `skills/drill/SKILL.md` | 68 | 5524 | `5b4c9a06a6dc254b` | — |
| `tools/build-source-bundle.mjs` | 98 | 5401 | `7bc478d7e6669192` | — |
| `test/c2g.test.js` | 162 | 9940 | `eda73b53ef16bf61` | 13 |
| `test/cache.test.js` | 218 | 11674 | `4fbd474745ef55fe` | 9 |
| `test/core.test.js` | 266 | 14119 | `d71387054522f89d` | 16 |
| `test/embed.test.js` | 112 | 5884 | `f348358148cebd43` | 6 |
| `test/errors.test.js` | 135 | 7536 | `96e8696dd4f94a23` | 10 |
| `test/git-role.test.js` | 136 | 6242 | `36f78867e90a4799` | 9 |
| `test/integration.test.js` | 882 | 49642 | `be244980d46c33a2` | 23 |
| `test/pr.test.js` | 97 | 5612 | `13c93f92f822c760` | 7 |
| `test/search.test.js` | 135 | 6629 | `bf1a0d746a4b8c32` | 11 |

**Totals:** 9774 lines across 50 files; 104 tests declared across 9 test files.

## The test run, recorded

```text
$ node --test test/*.test.js
# tests 104
# pass 104
# fail 0
$ exit 0
```

All 104 pass, 0 fail. The suite needs the host packages reachable from this checkout (`@deepseek-ai/dsh-tools`); when they are not, `integration.test.js` skips itself instead of failing, so a consumer running it standalone sees a smaller count rather than a false red.

---

## `.github/workflows/publish.yml`

sha256 `8392c0bbbcb091b4004745f7501c6701ff3306204860b0097453a8360128432d` · 37 lines

````yaml
name: publish

# Trusted publishing (OIDC): npm exchanges this workflow's identity for a
# short-lived publish credential, so no token has to be stored. An NPM_TOKEN
# secret is still honoured if present, which is what the very first publish
# needs — npm configures a trusted publisher for a package that already exists
# (npm/cli#8544 tracks allowing the initial version over OIDC).
on:
  release:
    types: [published]
  workflow_dispatch:

permissions:
  contents: read
  id-token: write # OIDC

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          registry-url: https://registry.npmjs.org
      # No install step on purpose: the suite has no dependencies of its own, and
      # the integration test skips itself when the host packages are absent
      # instead of failing. Installing would try to resolve the @deepseek-ai
      # peers, which are provided by the host, not by this package.
      - run: node --test test/*.test.js
      - run: pnpm publish --access public --no-git-checks --provenance
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
````

## `.gitignore`

sha256 `1adbb37be33001da141e7b5846ea0fc28f5735e87fb11bb26ba2e47c07c98149` · 4 lines

````markdown
node_modules/
*.tgz
.drill/
````

## `LICENSE`

sha256 `2f841f07845b05a9e9a003004a4c028a93238eb2efa576047a85d3dba8578b9a` · 22 lines

````markdown
MIT License

Copyright (c) 2026 EnRaiha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
````

## `README.md`

sha256 `f3e36d5f6d0176cc60aeef5732c3db459affded027d68a4b58864b5141cc6a63` · 356 lines

````markdown
# The drill kit

One repository for the whole drill: the DSH plugin that enforces it, the two shared Python cores it borrows, the Kilo/Hermes frontends for those cores, and every document the work produced.

`dsh` = DeepSeek Harness. The **drill** is one bug fix run as a pipeline with gates — localize from the failure signal, map the blast radius, enumerate the edge cases, prove **red** (fails on base) then **green** (passes with the fix), pass hygiene, pass a fresh-context read-only **Review 2**, then produce the PR — with every claim backed by an artifact in a ledger. "Done" is not a sentence; it is a gate evaluation.

## Layout

| Path | What |
|---|---|
| `index.js`, `lib/`, `test/`, `skills/`, `roles/`, `cordis.patch.yml`, `package.json` | **the DSH plugin** — 16 tools, 104 tests, the gate implementation and the ledger. This is the root package, so the repo itself installs as a plugin. |
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
  | bash -s -- --profile web --link
```

It finds the DSH checkout itself (`dsh` on `PATH`, `$HOME/projects/deepseek-harness`, or a checkout beside this repo), falls back from the plugin manager to a link install when pnpm or the network is missing, backs up a profile's `package.json` as `.bak-drill` before editing it, keeps a copy of any skill or role file it would overwrite, refuses to replace a live frontend directory unless you pass `--force`, and never restarts anything. `--dry-run` prints every action without writing.

Flags: `--profile <name>` (default `web`), `--dsh <checkout|bin.js>`, `--link`, `--manager`, `--skills`, `--frontends`, `--verify`, `--uninstall`, `--force`, `--dry-run`.

**Until the package is on npm, install it by path or by URL** — a bare `dsh plugin add dsh-drill` resolves against the registry and fails with a 404 while the name is unpublished:

```sh
dsh plugin --profile tkg-web add /path/to/dsh-drill-kit          # local checkout
dsh plugin --profile tkg-web add github:EnRaiha/dsh-drill-kit    # or from this repo
dsh plugin --profile tkg-web add github:EnRaiha/dsh-drill-kit#v0.8.3   # pinned to a release
```

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
node --test test/*.test.js           # 104 tests, 0 failures
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

`dsh-drill` **v0.8.3** · 16 tools · 104 tests · loads on DSH `0.1.6-alpha.2`. Two reviews are recorded in the docs; every defect they found is fixed with a regression test, and the ones that could not be settled are listed as unverified rather than assumed.

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
| 4 Surgical patch | **`red`** | a `test` run with `arm=base` that **fails**, with a captured log |
| | **`green`** | a `test` run with `arm=fix` that **passes**, with a captured log |
| | **`hygiene`** | a `hygiene` run (fmt/clippy/preflight) with `exit 0` |
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
dsh plugin --profile <profile> add ~/projects/dsh-drill
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

It is then scored by the **existing** PR-craft core (`~/scripts/pr_craft.py lint-desc`, shared with the Kilo and Hermes plugins — one logic core, no drift), and `pr` evidence is recorded **only when the lint reports no blockers**. A blocked body is still written to disk so the author can fix it, while the `pr` gate stays open.

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
npm test        # node --test test/*.test.js — 104 tests
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
````

## `cordis.patch.yml`

sha256 `7b935022f8a8569ac6d12e1d414f4d80d2541c18fd1ee1a3eb6ad0f4bd2e6c72` · 9 lines

````yaml
# dsh-drill bundle patch: one row, everything downstream of it is a tool.
#
# Config is omitted on purpose: every key has a Schema default in index.js, and a
# patch replaces a row's WHOLE config, so an override below must restate the keys
# it needs.
- insert:
    - id: drill
      name: dsh-drill
````

## `core/README.md`

sha256 `63a0a42187d0161a992be48548db73a9a0d415044a76532560f8519f44687a0c` · 39 lines

````markdown
# core — the two shared Python cores

Both files are **stdlib only** and have no dependency on this repository's layout. They are the single implementations of their logic; every frontend is a thin wrapper around them.

| File | Version | Purpose |
|---|---|---|
| [`c2g_tools.py`](c2g_tools.py) | 1.1.0 | code2graph access for agents: `frame` (failure signal → symbols) and `error` (the same, rendered) plus the query tools — `symbols`, `def`, `callers`, `callees`, `blast-radius`, `diff-impact`, `usages`, `references`, `imports`, `module-deps`, `raw`. Resolution order: per-project c2g cache → merged store → the `c2g` binary as a last resort. |
| [`pr_craft.py`](pr_craft.py) | — | PR discipline as a linter: `lint-desc`, `lint-comment`, `lint-diff`, `plan`, `checklist`, plus a 10-case `selftest`. |

Run them directly — they read a JSON request on stdin and print JSON:

```sh
python3 core/pr_craft.py selftest
python3 core/c2g_tools.py run --stdin <<< '{"tool":"error","text":"panicked at src/main.rs:12:5:\nboom","root":"'$PWD'"}'
```

## Where the graph comes from

The c2g core does **not** implement a code graph. That is [NodeDB-Lab/code2graph](https://github.com/NodeDB-Lab/code2graph) — a Rust, tree-sitter based, polyglot extractor written by [farhan-syah](https://github.com/farhan-syah) (NodeDB founder) with CLI fixes contributed by [EnRaiha](https://github.com/EnRaiha). The upstream project is deliberately storage-neutral ("zero storage opinion"), which is why every consumer supplies its own store — and why this core has a three-layer fallback:

1. **the per-project CLI cache** — `~/.cache/code2graph/projects/<project-key>/cache.sqlite3`, written by the upstream CLI, read here with plain SQL;
2. **a merged store** — a single `graph_index.sqlite` built from per-shard indexes, which answers for worktrees the per-project cache does not cover;
3. **the `c2g` binary** — last resort, and slow enough that the drill treats a cache hit as the normal path.

Upstream references worth keeping to hand: `cli/src/cache/schema.rs` (the cache schema, `SCHEMA_VERSION = 3`, and the `active_snapshots` key `(resolver_tier, completeness)`), `cli/src/cache/location.rs` (how a project key is derived — blake3 over the canonical root, not `sha256`).

## Frontends

Kilo and Hermes each wrap these cores; see [`../frontends/README.md`](../frontends/README.md). The core path is overridable there via `C2G_CORE` / `PR_CRAFT_CORE`, so a checkout can point at `core/` instead of a home-directory copy.

## Tests

The cores are exercised through the plugin's suite (`node --test test/*.test.js` at the repository root), which drives them the way the frontends do, and by their own selftests:

```sh
python3 core/pr_craft.py selftest     # {"ok": true, "cases": {...10...}}
python3 core/c2g_tools.py --help
```
````

## `core/c2g_tools.py`

sha256 `bc13afe99510c89e472dd24af9a7ba3bcbc677a1059c27236e5beb7cdde8694e` · 674 lines

````markdown
#!/usr/bin/env python3
"""c2g_tools — stdlib-only bridge from LLM plugins to the code2graph CLI (c2g).

One core, two frontends:
  - Kilo    ~/.kilo/plugins/c2g/server.ts
  - Hermes  ~/.hermes/plugins/c2g/

DB-less by construction: reads the c2g index/cache on disk. No NodeDB, no PG, no
Maya cortex. `error`/`frame` additionally read the per-project c2g cache SQLite and
the merged store ~/Embed/c2g/graph_index.sqlite before falling back to the binary,
because a cold binary query costs minutes while a cache read costs milliseconds. The same questions stay answerable through cortex_codegraph_* (NodeDB
code graph) and knowledge-graph_* (PG store) when those are warm; this core is the
straight path.

CLI (payload over stdin, mirrors pr_craft.py):
  python3 c2g_tools.py describe --stdin
  python3 c2g_tools.py run --stdin          # {"tool": "callers", "name": "foo", "root": "..."}

Python API:
  describe() -> dict
  query(tool, **kw) -> dict
"""

from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

VERSION = "1.1.0"
LOG = Path(os.environ.get("C2G_LOG") or Path.home() / "logs" / "c2g.log")
MAX_CAPTURE = 200_000
MAX_OUT = 40_000
DEFAULT_TIMEOUT = 180
MAX_TIMEOUT = 900
# c2g accepts `--timeout <int><ms|s|m|h>`. Bounding it in-process lets c2g abort
# with its own diagnostic (exit 4, "operation timed out") instead of being killed
# by our subprocess timeout with no output at all.
QUERY_DEADLINE = "60s"
INDEX_DEADLINE = "900s"
INDEX_TIMEOUT = 900

BIN_CANDIDATES = [
    os.environ.get("C2G_BIN"),
    str(Path.home() / "projects/code2graph/target/release/c2g"),
    shutil.which("c2g"),
]

# tool -> (subcommand, positional key)
SIMPLE_TOOLS = {
    "status": ("status", None),
    "symbols": ("symbols", "query"),
    "def": ("def", "name"),
    "callers": ("callers", "name"),
    "callees": ("callees", "name"),
    "impact": ("impact", "name"),
    "usages": ("usages", "name"),
    "references": ("references", "name"),
    "imports": ("imports", "target"),
    "module_deps": ("module-deps", "target"),
    "index": ("index", None),
    "cache": ("cache", "action"),
    # frame resolves a stack position: def --at-file <file> --line <n>
    "frame": ("def", None),
}
FLAG_TOOLS = {"callers", "callees", "impact", "usages", "references"}


def _log(line: str) -> None:
    try:
        LOG.parent.mkdir(parents=True, exist_ok=True)
        with LOG.open("a", encoding="utf-8") as fh:
            fh.write(f"{time.strftime('%Y-%m-%dT%H:%M:%S')} {line}\n")
    except Exception:
        pass


def binary() -> str | None:
    for cand in BIN_CANDIDATES:
        if not cand:
            continue
        path = Path(cand).expanduser()
        if path.is_file() and os.access(path, os.X_OK):
            return str(path)
    return None


def _git_root(start: Path) -> Path | None:
    """Nearest ancestor of `start` holding a .git entry, else None."""
    for path in (start, *start.parents):
        if (path / ".git").exists():
            return path
    return None


def _forbidden_roots() -> set[Path]:
    """Paths that are never a project: walking them costs minutes and answers nothing."""
    home = Path.home()
    return {Path("/"), home, home.parent, home / ".."}


def resolve_root(explicit=None) -> tuple[str | None, str | None]:
    """Resolve the project root. Returns (root, error).

    An agent session usually runs with cwd=$HOME, so the old `cwd` default made
    c2g walk every file under the home directory and blow past the subprocess
    timeout with no output. Prefer C2G_ROOT, then the git root of cwd, and refuse
    home/`/` outright instead of hanging.
    """
    if explicit is not None and explicit != "":
        if not isinstance(explicit, (str, os.PathLike)):
            return None, f"root must be a string, got {type(explicit).__name__}"
        candidate = Path(os.fspath(explicit)).expanduser()
    elif os.environ.get("C2G_ROOT"):
        candidate = Path(os.environ["C2G_ROOT"]).expanduser()
    else:
        cwd = Path.cwd()
        candidate = _git_root(cwd) or cwd
    try:
        resolved = candidate.resolve()
    except OSError as err:
        return None, f"cannot resolve root {candidate}: {err}"
    if resolved in _forbidden_roots():
        return None, (
            f"refusing root {resolved}: it is a home filesystem root, not a project. "
            "Pass an explicit root (root=~/projects/<repo>) or set C2G_ROOT; "
            "c2g walks every file below the root and would not return."
        )
    if not resolved.is_dir():
        return None, f"root is not a directory: {resolved}"
    return str(resolved), None


def default_root() -> str | None:
    """Back-compat shim: resolved root or None when the root is unusable."""
    return resolve_root()[0]


def _int_arg(kw: dict, key: str) -> int | None:
    """Coerce a numeric arg; raise ValueError instead of an uncaught TypeError."""
    value = kw.get(key)
    if value is None:
        return None
    if isinstance(value, bool) or not isinstance(value, (int, float, str)):
        raise ValueError(f"{key} must be a number, got {type(value).__name__}")
    try:
        return int(value)
    except (TypeError, ValueError) as err:
        raise ValueError(f"{key} must be a number, got {value!r}") from err


def _argv_common(tool: str, root: str, kw: dict) -> list[str]:
    argv: list[str] = []
    deadline = INDEX_DEADLINE if tool == "index" else QUERY_DEADLINE
    argv += ["--timeout", str(kw.get("deadline") or deadline)]
    tier = kw.get("tier") or "scope"
    if tier != "scope":
        argv += ["--tier", str(tier)]
    limit = _int_arg(kw, "limit")
    if limit is not None:
        argv += ["--limit", str(limit)]
    if kw.get("min_confidence") is not None:
        argv += ["--min-confidence", str(kw["min_confidence"])]
    if tool == "diff_impact" and kw.get("depth") is not None:
        argv += ["--depth", str(_int_arg(kw, "depth"))]
    if tool in FLAG_TOOLS:
        for key, flag in (("file", "--file"), ("line", "--line"), ("column", "--column")):
            value = _int_arg(kw, key)
            if value is not None:
                argv += [flag, str(value)]
    # A partial index answers instead of erroring; the caller sees `flags` in the result.
    if kw.get("allow_partial", True) and tool != "index":
        argv.append("--allow-partial")
    if kw.get("allow_stale"):
        argv.append("--allow-stale")
    if kw.get("frozen"):
        argv.append("--frozen")
    if kw.get("no_cache"):
        argv.append("--no-cache")
    if kw.get("include_hidden"):
        argv.append("--include-hidden")
    if kw.get("force") and tool == "index":
        argv.append("--force")
    argv += ["--root", str(root), "--json"]
    return argv


def _build_argv(tool: str, root: str, kw: dict) -> list[str]:
    bin_path = binary()
    if not bin_path:
        raise FileNotFoundError(
            "c2g binary not found: set C2G_BIN or build ~/projects/code2graph (cargo build --release)"
        )
    if tool == "raw":
        raw = kw.get("argv") or []
        if not isinstance(raw, list) or not all(isinstance(a, str) for a in raw):
            raise ValueError("raw.argv must be a list of strings")
        argv = [bin_path, *raw]
        if "--root" not in argv and root:
            argv += ["--root", str(root)]
        if "--json" not in argv and kw.get("json", True):
            argv.append("--json")
        return argv

    if tool == "diff_impact":
        base = kw.get("base")
        argv = [bin_path, "diff-impact"]
        if base:
            argv.append(str(base))
        return argv + _argv_common(tool, root, kw)

    if tool == "blast_radius":
        raise ValueError("blast_radius is a composite; use python API or run the three tools")

    if tool == "frame":
        file = kw.get("file")
        line = _int_arg(kw, "line")
        if not file or line is None:
            raise ValueError("frame needs file and line")
        argv = [bin_path, "def", "--at-file", str(file), "--line", str(line)]
        column = _int_arg(kw, "column")
        if column is not None:
            argv += ["--column", str(column)]
        return argv + _argv_common(tool, root, kw)

    if tool not in SIMPLE_TOOLS:
        raise ValueError(f"unknown tool '{tool}' (try: {', '.join(sorted(SIMPLE_TOOLS))}, diff_impact, raw)")

    sub, pos_key = SIMPLE_TOOLS[tool]
    argv = [bin_path, sub]
    if tool == "index":
        if kw.get("trust_mtime", True):
            argv.append("--trust-mtime")
        return argv + _argv_common(tool, root, kw)
    if pos_key:
        positional = kw.get(pos_key)
        if positional is None:
            positional = kw.get("target")  # usages/references accept either key
        if positional is not None:
            argv.append(str(positional))
    return argv + _argv_common(tool, root, kw)


def run_argv(argv: list[str], timeout_s: int = DEFAULT_TIMEOUT, root: str | None = None) -> dict:
    timeout_s = max(1, min(int(timeout_s), MAX_TIMEOUT))
    started = time.monotonic()
    try:
        res = subprocess.run(
            argv,
            capture_output=True,
            text=True,
            timeout=timeout_s,
            cwd=root if root and Path(root).is_dir() else None,
        )
    except subprocess.TimeoutExpired:
        return {
            "ok": False,
            "code": None,
            "error": f"timeout after {timeout_s}s",
            "argv": argv,
            "elapsed_ms": int((time.monotonic() - started) * 1000),
        }
    except OSError as err:
        return {"ok": False, "code": None, "error": str(err), "argv": argv, "elapsed_ms": 0}

    out = res.stdout or ""
    truncated = False
    if len(out) > MAX_OUT:
        out = out[:MAX_OUT] + "\n…[truncated]"
        truncated = True
    parsed = None
    if out and res.returncode == 0:
        try:
            parsed = json.loads(res.stdout)
        except Exception:
            parsed = None
    result = {
        "ok": res.returncode == 0,
        "code": res.returncode,
        "argv": argv,
        "elapsed_ms": int((time.monotonic() - started) * 1000),
        "stdout": out,
        "stderr": (res.stderr or "")[-4000:],
        "parsed": parsed,
        "truncated": truncated,
    }
    if res.returncode != 0:
        _log(f"fail tool={argv[1] if len(argv) > 1 else '?'} code={res.returncode} err={(res.stderr or '')[:200]!r}")
    return result


def query(tool: str, **kw) -> dict:
    """Run one c2g tool. Returns the normalized result dict."""
    kw.setdefault("allow_partial", True)
    root, error = resolve_root(kw.get("root"))
    if error:
        return {"ok": False, "code": None, "error": error, "tool": tool}
    assert root is not None  # resolve_root returns exactly one of (root, error)
    if tool == "blast_radius":
        name = kw.get("name")
        if not name:
            return {"ok": False, "error": "blast_radius needs name"}
        parts = {}
        for sub in ("callers", "callees", "impact"):
            parts[sub] = query(sub, **kw)
        return {"ok": all(p.get("ok") for p in parts.values()), "tool": "blast_radius", "name": name, "parts": parts}
    if tool == "describe":
        return describe(root)
    if tool == "error":
        kw.pop("root", None)
        text = kw.pop("text", None)
        max_resolve = kw.pop("max_resolve", 12)
        if not text:
            return {"ok": False, "error": "error needs text", "tool": "error"}
        return error_report(root, text, max_resolve=max_resolve, **kw)
    if tool == "frame":
        kw.pop("root", None)
        file = kw.pop("file", None)
        line = _int_arg(kw, "line")
        kw.pop("line", None)
        column = _int_arg(kw, "column")
        kw.pop("column", None)
        if not file or line is None:
            return {"ok": False, "error": "frame needs file and line", "tool": "frame"}
        return frame(root, file, line, column, **kw)
    argv = _build_argv(tool, root, kw)
    timeout_s = kw.get("timeout_s") or (INDEX_TIMEOUT if tool == "index" else DEFAULT_TIMEOUT)
    result = run_argv(argv, timeout_s=timeout_s, root=root)
    result["tool"] = tool
    result["root"] = root
    return result


# ---------------------------------------------------------------- failure signals
# Stage 1 of the survey starts from a stack trace, not a symbol name. These helpers
# turn a failure signal into frames and resolve each frame against, in order: the
# per-project c2g cache SQLite, the merged ~/Embed/c2g store, then the c2g binary.

SOURCE_EXT = "rs|py|ts|tsx|js|jsx|mjs|cjs|go|java|kt|rb|c|cc|cpp|cxx|h|hpp|sql|toml|yaml|yml|json"
EXTERNAL_MARKERS = (
    "/rustc/", "/rustlib/", "/library/core/", "/library/std/", "/.cargo/registry/",
    "/node_modules/", "/usr/lib/", "/usr/local/lib/", "/site-packages/", "/.rustup/",
)
MAX_FRAMES = 40
MERGE_STORE = Path.home() / "Embed/c2g/graph_index.sqlite"
SHARD_PREFIXES = {
    "nd_src": "nodedb/src",
    "nd_tests": "nodedb/tests",
    "nd_sql": "nodedb-sql",
    "nd_cluster": "nodedb-cluster",
    "nd_types": "nodedb-types",
    "nd_vector": "nodedb-vector",
}
REST_SHARD = "nd_rest"


def _normalize_frame_path(raw: str) -> tuple[str, bool]:
    """Strip file://, ./ and repository-absolute prefixes; flag toolchain paths."""
    file = raw.strip()
    for prefix in ("file://", "./"):
        if file.startswith(prefix):
            file = file[len(prefix):]
    external = any(marker in file for marker in EXTERNAL_MARKERS)
    if file.startswith("/") and not external:
        for marker in ("/nodedb/", "/nodedb-sql/", "/nodedb-cluster/", "/nodedb-types/", "/nodedb-vector/"):
            if marker in file:
                file = file[file.index(marker) + 1:]
                break
    return file, external


def _extract_message(text: str) -> str | None:
    """The panic or error message that accompanies the frames."""
    panic = re.search(r"panicked at [^\n]*?:(\d+)(?::(\d+))?:[ \t]*([^\n]*)", text)
    if panic:
        if panic.group(3).strip():
            return panic.group(3).strip()
        tail = text[panic.end():].split("\n")
        tail = [line.strip() for line in tail if line.strip()]
        if tail:
            return tail[0]
    header = re.search(r"^\s*(?:error|fatal|thread '[^']+' panicked)[^\n]*:\s*([^\n]+)$", text, re.M)
    if header and header.group(1).strip():
        return header.group(1).strip()
    err = re.search(r"^\s*(?:ERROR|FATAL|Error):\s*([^\n]+)$", text, re.M)
    return err.group(1).strip() if err else None


def parse_frames(text: str) -> dict:
    """Parse a failure signal into `{message, frames}`.

    Recognised per line: a panic header, a numbered backtrace frame (its symbol kept
    as `symbol_hint`), a compiler `-->` diagnostic, a Python `File "x", line N`, and a
    bare `file.ext:line[:col]` mention. Frames dedupe by file:line and cap at MAX_FRAMES.
    """
    source = str(text or "").replace("\r\n", "\n")
    frames: list[dict] = []
    seen: set[str] = set()

    def push(raw_path: str, line: int, column: int | None, hint: str | None) -> None:
        file, external = _normalize_frame_path(raw_path)
        if not file or not isinstance(line, int) or line <= 0:
            return
        key = f"{file}:{line}"
        if key in seen:
            return
        seen.add(key)
        frame = {"file": file, "line": line, "column": column, "external": external}
        if hint:
            frame["symbol_hint"] = hint
        frames.append(frame)

    pending: str | None = None
    bare_re = re.compile(rf'''(?:^|[\s("'`])((?:[\w.@+-]+/)*[\w.@+-]+\.(?:{SOURCE_EXT})):(\d+)(?::(\d+))?''')
    for raw_line in source.split("\n"):
        line = raw_line.rstrip()
        numbered = re.match(r"^\s*\d+:\s+(?:0x[0-9a-f]+ - )?([A-Za-z_][\w:<>$]*(?:::[A-Za-z_][\w:<>$]*)+)\s*$", line)
        if numbered:
            pending = numbered.group(1)
            continue
        panic = re.search(r"panicked at (.+?):(\d+)(?::(\d+))?", line)
        if panic:
            push(panic.group(1), int(panic.group(2)), int(panic.group(3)) if panic.group(3) else None, pending)
            pending = None
            continue
        at = re.search(r"\bat\s+(?:\./)?([^\s()]+?):(\d+)(?::(\d+))?\s*$", line)
        if at:
            push(at.group(1), int(at.group(2)), int(at.group(3)) if at.group(3) else None, pending)
            pending = None
            continue
        arrow = re.search(r"-->\s+([^\s:]+):(\d+)(?::(\d+))?", line)
        if arrow:
            push(arrow.group(1), int(arrow.group(2)), int(arrow.group(3)) if arrow.group(3) else None, None)
            pending = None
            continue
        py = re.search(r'File "([^"]+)", line (\d+)', line)
        if py:
            push(py.group(1), int(py.group(2)), None, None)
            pending = None
            continue
        for match in bare_re.finditer(line):
            push(match.group(1), int(match.group(2)), int(match.group(3)) if match.group(3) else None, None)
            pending = None
    return {"message": _extract_message(source), "frames": frames[:MAX_FRAMES]}


def _sqlite_json(db: Path, sql: str, timeout_s: int = 30) -> list[dict]:
    """One read-only query through the sqlite3 CLI."""
    sqlite = shutil.which("sqlite3")
    if not sqlite:
        return []
    proc = subprocess.run([sqlite, "-readonly", "-json", str(db), sql], capture_output=True, text=True, timeout=timeout_s)
    out = (proc.stdout or "").strip()
    if not out:
        return []
    parsed = json.loads(out)
    return parsed if isinstance(parsed, list) else []


def _cache_for_root(root: str) -> Path | None:
    """The most specific c2g cache with an active scope snapshot covering `root`."""
    base = Path.home() / ".cache/code2graph/projects"
    if not base.is_dir():
        return None
    wanted = str(Path(root).resolve())
    best: tuple[int, Path] | None = None
    for entry in base.iterdir():
        db = entry / "cache.sqlite3"
        if not db.is_file():
            continue
        try:
            meta = _sqlite_json(db, "SELECT CAST(canonical_root AS TEXT) AS root, CAST(application_identity AS TEXT) AS identity FROM meta LIMIT 1")
            if not meta or meta[0].get("identity") not in (None, "code2graph-cache"):
                continue
            canonical = str(Path(str(meta[0].get("root"))).resolve())
            if not (wanted == canonical or wanted.startswith(canonical.rstrip("/") + "/")):
                continue
            snap = _sqlite_json(db, "SELECT snapshot_id FROM active_snapshots WHERE resolver_tier='scope' LIMIT 1")
            if not snap:
                continue
        except Exception:
            continue
        if best is None or len(canonical) > best[0]:
            best = (len(canonical), db)
    return best[1] if best else None


def _frame_from_cache(db: Path, file: str, line: int) -> dict | None:
    scope = "(SELECT snapshot_id FROM active_snapshots WHERE resolver_tier='scope')"
    rows = _sqlite_json(db, (
        "SELECT name, replace(kind,'\"','') AS kind, file, json_extract(symbol,'$.line') AS line "
        f"FROM graph_symbols WHERE snapshot_id={scope} AND file='{file.replace(chr(39), chr(39)*2)}' "
        f"AND json_extract(symbol,'$.line') <= {int(line)} ORDER BY json_extract(symbol,'$.line') DESC LIMIT 1"
    ))
    return rows[0] if rows else None


def _to_stored_path(worktree_relative: str) -> str:
    for shard, prefix in SHARD_PREFIXES.items():
        if worktree_relative == prefix or worktree_relative.startswith(prefix + "/"):
            return f"{shard}/{worktree_relative[len(prefix) + 1:]}" if worktree_relative != prefix else shard
    return f"{REST_SHARD}/{worktree_relative}"


def _frame_from_merge_store(file: str, line: int) -> dict | None:
    if not MERGE_STORE.is_file():
        return None
    stored = _to_stored_path(file).replace("'", "''")
    rows = _sqlite_json(MERGE_STORE, (
        "SELECT name, kind, file, repo, line FROM nodes "
        f"WHERE file='{stored}' AND line <= {int(line)} ORDER BY line DESC LIMIT 1"
    ))
    return rows[0] if rows else None


def frame(root: str, file: str, line: int, column: int | None = None, **kw) -> dict:
    """Resolve one stack position to a symbol: cache, merged store, then the binary."""
    external = any(marker in file for marker in EXTERNAL_MARKERS)
    if external:
        return {"ok": False, "tool": "frame", "root": root, "file": file, "line": line, "external": True,
                "error": "frame is outside the repository"}
    db = _cache_for_root(root)
    if db is not None:
        try:
            hit = _frame_from_cache(db, file, line)
        except Exception:
            hit = None
        if hit:
            return {"ok": True, "tool": "frame", "root": root, "file": file, "line": line, "source": "c2g-cache", "symbol": hit}
    try:
        hit = _frame_from_merge_store(file, line)
    except Exception:
        hit = None
    if hit:
        mapped = dict(hit)
        mapped["worktree_path"] = hit.get("file", "")
        return {"ok": True, "tool": "frame", "root": root, "file": file, "line": line, "source": "c2g-merge-store", "symbol": mapped}
    try:
        argv = _build_argv("frame", root, {"file": file, "line": line, "column": column, **kw})
    except (ValueError, FileNotFoundError) as err:
        return {"ok": False, "tool": "frame", "root": root, "file": file, "line": line, "error": str(err)}
    result = run_argv(argv, timeout_s=kw.get("binary_timeout_s") or DEFAULT_TIMEOUT, root=root)
    payload = result.get("payload")
    symbol = _symbol_from_def_payload(payload)
    if symbol is None:
        return {"ok": False, "tool": "frame", "root": root, "file": file, "line": line,
                "error": "the binary answered but carried no symbol", "binary": payload, "flags": result.get("flags")}
    return {"ok": True, "tool": "frame", "root": root, "file": file, "line": line, "source": "binary", "symbol": symbol, "flags": result.get("flags")}


def _symbol_from_def_payload(payload) -> dict | None:
    """Pull one symbol out of a `def` payload, tolerating the shapes it may take."""
    if payload is None:
        return None
    if isinstance(payload, list):
        return payload[0] if payload and isinstance(payload[0], dict) else None
    if isinstance(payload, dict):
        for key in ("symbol", "definition", "def"):
            value = payload.get(key)
            if isinstance(value, dict):
                return value
        for key in ("results", "symbols", "definitions"):
            value = payload.get(key)
            if isinstance(value, list) and value and isinstance(value[0], dict):
                return value[0]
    return None


def error_report(root: str, text: str, max_resolve: int = 12, **kw) -> dict:
    """Parse a failure signal and resolve its repository frames to symbols."""
    parsed = parse_frames(text)
    resolved = 0
    sources: list[str] = []
    frames = []
    attempts = 0
    for frame_in in parsed["frames"]:
        entry = dict(frame_in)
        if frame_in.get("external"):
            entry["source"] = "external"
            frames.append(entry)
            continue
        if attempts >= max(1, int(max_resolve)):
            entry["source"] = "not-attempted"
            frames.append(entry)
            continue
        attempts += 1
        result = frame(root, frame_in["file"], frame_in["line"], frame_in.get("column"), **kw)
        if result.get("ok"):
            entry["source"] = result["source"]
            entry["symbol"] = result["symbol"]
            resolved += 1
            if result["source"] not in sources:
                sources.append(result["source"])
        else:
            entry["source"] = None
            entry["error"] = result.get("error")
        frames.append(entry)
    return {
        "ok": bool(parsed["frames"]),
        "tool": "error",
        "root": root,
        "message": parsed["message"],
        "frames": frames,
        "resolved": resolved,
        "unresolved": len([f for f in frames if not f.get("external") and not f.get("symbol")]),
        "external": len([f for f in frames if f.get("external")]),
        "sources": sources,
    }


def describe(root: str | None = None) -> dict:
    bin_path = binary()
    version = None
    if bin_path:
        try:
            res = subprocess.run([bin_path, "--version"], capture_output=True, text=True, timeout=10)
            version = (res.stdout or res.stderr).strip()
        except Exception:
            version = None
    resolved, error = resolve_root(root)
    return {
        "ok": bool(bin_path) and not error,
        "version": VERSION,
        "binary": bin_path,
        "binary_version": version,
        "root": resolved,
        "root_error": error,
        "dbless": True,
        "tools": [
            "c2g_status", "c2g_index", "c2g_symbols", "c2g_def", "c2g_blast_radius",
            "c2g_diff_impact", "c2g_query", "c2g_raw",
        ],
        "notes": [
            "reads the c2g cache/index on disk; no NodeDB, no PG, no cortex",
            "query tools add --allow-partial by default; pass allow_partial=false to require a complete index",
            "root resolution: explicit arg > C2G_ROOT > git root of cwd; home and / are refused, pass a project root",
            "every call carries --timeout (60s queries, 900s index) so an oversized root aborts with exit 4 instead of hanging",
            "cortex_codegraph_* and knowledge-graph_* answer the same questions when their stores are warm",
        ],
    }


def main(argv: list[str]) -> int:
    cmd = argv[1] if len(argv) > 1 else "describe"
    payload: dict = {}
    if "--stdin" in argv:
        raw = sys.stdin.read().strip()
        if raw:
            payload = json.loads(raw)
    if cmd == "describe":
        out = describe(payload.get("root"))
    elif cmd == "run":
        tool = payload.pop("tool", None)
        if not tool:
            out = {"ok": False, "error": "payload.tool is required"}
        else:
            try:
                out = query(tool, **payload)
            except (ValueError, FileNotFoundError) as err:
                out = {"ok": False, "error": str(err)}
    else:
        out = {"ok": False, "error": f"unknown command '{cmd}' (describe|run)"}
    print(json.dumps(out))
    return 0 if out.get("ok") else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
````

## `core/pr_craft.py`

sha256 `eb02e28af4b86fc5cd208430a5d80d23ef074bdb0924589a4216d31797b9685f` · 488 lines

````markdown
#!/usr/bin/env python3
"""pr_craft — PR & code-review craft core (stdlib only).

Distilled from 6 review guides (Google eng-practices, mawrkus, thoughtbot,
book-pr, Pro Git, first-contributions). Shared logic for the Kilo Code plugin
(~/.kilo/plugins/pr-craft) and the Hermes plugin (~/.hermes/plugins/pr-craft).

CLI (JSON on stdout, always exit 0):
    pr_craft.py detect        [--text T | --file F | --stdin]
    pr_craft.py context       [--role reviewer|author|both] [--text T | --stdin]
    pr_craft.py checklist     [--role reviewer|author|both]
    pr_craft.py lint-desc     [--text T | --file F | --stdin]
    pr_craft.py lint-comment  [--text T | --file F | --stdin] [--role reviewer|author]
    pr_craft.py lint-diff     [--text T | --file F | --stdin]
    pr_craft.py plan          [--text T | --file F | --stdin]
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys

# ---------------------------------------------------------------- checklists

CHECKLISTS = {
    "author": [
        "One self-contained change; refactors separate; tests in the same PR",
        "Draft PR opened early; description has task ref, what/why, steps to test, screenshots",
        "Self-reviewed the rendered diff outside the IDE; anticipated obvious objections",
        "CI green before requesting review",
        "2-3 reviewers chosen deliberately (+ domain expert if needed)",
        "Every comment answered; feedback rounds pushed as isolated commits",
        "Merge only when confident; final editorial control is the author's",
    ],
    "reviewer": [
        "Read the description first: should this change exist at all?",
        "Design problems sent immediately, before finishing the read",
        "Every line + context (whole file, whole system); tests read as carefully as code",
        "Severity labels on comments (Nit:/Optional:/FYI:); alternatives with references",
        "Comments about the code, never the developer; at least one genuine positive",
        "Responded within one business day; did not interrupt deep work to do it",
        "Followed up and approved once the contract was met (or escalated - never limbo)",
    ],
    "flow": [
        "Small PR = one self-contained change: ~100 lines fine, ~1000 too large",
        "Standard is code health improving, not perfection - approve when clearly better",
        "Response <= 1 business day; speed of replies beats speed of the whole review",
        "Review is a contract: author does what you asked -> you approve, and follow up",
        "No 'clean up later' - fix now, or file an issue assigned to the author",
        "Ask/explain/suggest ('why not ...?'), never demand; label severity",
        "3-4 replies without progress -> move to chat/call, then post the summary back",
    ],
}

TRIGGERS = [
    (r"\bgh\s+pr\b|\bpull request\b|\bpull-request\b|\bpr\b|\bmr\b|\bmerge request\b", "pr"),
    (r"\bcode review\b|\breview(ing|er|s)?\b|\blgtm\b|\bnit:", "review"),
    (r"\bdiff\b|\bpatch\b|\bchanges requested\b|\bapprove\b|\bapproval\b", "diff"),
    (r"\bcommit message\b|\bsquash\b|\brebase\b|\bmerge conflict\b", "git"),
]
# Words that make a hit an AUTHOR-side hit, a REVIEWER-side hit, or both.
AUTHOR_SIGNS = r"\b(my|our)\s+(pr|mr|patch|branch|diff)\b|\bi (wrote|opened|created|pushed)\b|" \
               r"\bpr description\b|\bcommit message\b|\brequest(ing)? review\b|\bsplit (the|this) (pr|cl)\b"
REVIEWER_SIGNS = r"\breview(ing|er)?\b|\blgtm\b|\bnit\b|\bapprove\b|\bcomment(s|ing)?\b|" \
                 r"\bwhat to look for\b|\bfeedback\b|\bthis (pr|mr|diff|patch) (looks|seems)\b"
# Never inject on pure chatter mentioning "PR" in passing.
STOP = r"^\s*(/|!)\w+|^\s*(hey|hi|hello|thanks|ok)\W*$"

SEV_LABELS = ("nit:", "optional:", "consider:", "suggestion:", "fyi:", "blocker:", "question:")

# ------------------------------------------------------------------ helpers


def _text_from(args) -> str:
    if getattr(args, "stdin", False):
        raw = sys.stdin.read()
        try:
            payload = json.loads(raw)
            if isinstance(payload, dict):
                return str(payload.get("text") or payload.get("message") or "")
        except Exception:
            pass
        return raw
    if getattr(args, "file", None):
        with open(args.file, encoding="utf-8", errors="replace") as fh:
            return fh.read()
    return getattr(args, "text", "") or ""


def _hits(pattern: str, text: str) -> list[str]:
    return sorted({m.group(0).strip().lower() for m in re.finditer(pattern, text, re.I)})


# ------------------------------------------------------------------- detect


def detect(text: str) -> dict:
    text = (text or "").strip()
    if len(text) < 6 or re.match(STOP, text, re.I):
        return {"hit": False, "role": None, "signals": [], "reason": "too short / chatter"}
    signals: list[str] = []
    for pattern, label in TRIGGERS:
        found = _hits(pattern, text)
        if found:
            signals.append(label)
    if not signals:
        return {"hit": False, "role": None, "signals": [], "reason": "no PR/review signal"}
    author = bool(re.search(AUTHOR_SIGNS, text, re.I))
    reviewer = bool(re.search(REVIEWER_SIGNS, text, re.I))
    role = "both" if author and reviewer else "author" if author else "reviewer"
    return {"hit": True, "role": role, "signals": sorted(set(signals)), "reason": "trigger matched"}


def checklist(role: str = "both") -> dict:
    if role == "both":
        items = CHECKLISTS["flow"] + CHECKLISTS["author"] + CHECKLISTS["reviewer"]
    else:
        items = CHECKLISTS[role]
    return {"role": role, "count": len(items), "items": items, "sections": CHECKLISTS}


def context_block(text: str = "", role: str | None = None) -> dict:
    det = detect(text) if text else {"hit": True, "role": role or "both", "signals": [], "reason": "forced"}
    role = role or det.get("role") or "both"
    if not det.get("hit"):
        return {"inject": False, "role": None, "context": "", "detect": det}
    lines = ["<pr-craft>", "PR/code-review mode detected. Apply the distilled checklist:", ""]
    for item in CHECKLISTS["flow"]:
        lines.append(f"- {item}")
    side = "author" if role == "author" else "reviewer" if role == "reviewer" else None
    if side:
        lines += ["", f"{side.upper()} side:"]
        lines += [f"- {i}" for i in CHECKLISTS[side]]
    else:
        lines += ["", "AUTHOR side:"] + [f"- {i}" for i in CHECKLISTS["author"]]
        lines += ["", "REVIEWER side:"] + [f"- {i}" for i in CHECKLISTS["reviewer"]]
    lines += [
        "",
        "Before posting a review comment or a PR description, run pr_lint_comment / pr_lint_description "
        "and fix the blockers. Full distilled guide: "
        "~/Bumi-Hijau/inbox/pr-guides/DISTILLED-pr-review-workflow.md",
        "</pr-craft>",
    ]
    return {"inject": True, "role": role, "context": "\n".join(lines), "detect": det}


# ---------------------------------------------------------- lint: description

BAD_SUBJECTS = (
    "fix bug", "bugfix", "fix build", "add patch", "update", "updates", "changes", "wip",
    "misc", "temp", "phase 1", "fix", "done", "stuff", "various", "cleanup", "minor fixes",
)


def lint_description(text: str) -> dict:
    text = (text or "").replace("\r\n", "\n").strip()
    issues: list[dict] = []
    good: list[str] = []

    def add(level: str, rule: str, msg: str) -> None:
        issues.append({"level": level, "rule": rule, "msg": msg})

    lines = text.split("\n")
    subject = next((l.strip() for l in lines if l.strip()), "")
    rest = "\n".join(lines[lines.index(subject) + 1:]) if subject else ""
    body = strip_html_comments(rest)

    if not subject:
        add("blocker", "subject", "No PR title/subject found.")
    else:
        n = len(subject)
        if n > 72:
            add("blocker", "subject-length", f"Subject is {n} chars - keep it under ~50 (hard max 72).")
        elif n > 50:
            add("nit", "subject-length", f"Subject is {n} chars - trim toward ~50 so it reads in history.")
        else:
            good.append(f"subject length ok ({n})")
        first = re.sub(r"^[\[(][^\])]*[\])]\s*", "", subject).split(" ")[0].strip(":.,").lower()
        if re.fullmatch(r"[a-z]+(ing|ed)", first) and first not in {"read", "red"}:
            add("warn", "imperative", f"'{first}' looks like gerund/past tense - write the subject as an order "
                                      "(e.g. 'Add ...', 'Fix ...', 'Remove ...').")
        if subject.rstrip().endswith("."):
            add("nit", "subject-period", "Drop the trailing period on the subject line.")
        low = re.sub(r"^[\[(][^\])]*[\])]\s*", "", subject).lower()
        if any(low.startswith(b) or low == b for b in BAD_SUBJECTS):
            add("blocker", "bad-subject", f"'{subject}' says nothing a future reader can act on - state what changed.")
        tags = re.findall(r"[\[\(][^\])]{1,40}[\])]", subject)
        if len(tags) > 2:
            add("nit", "tags", f"{len(tags)} tags in the subject overwhelm the first line - move them into the body.")
        if not rest.strip():
            add("blocker", "no-body", "No description body: add what changed and *why* (future readers search by this).")
        elif not re.match(r"^\s*$", lines[lines.index(subject) + 1] if len(lines) > lines.index(subject) + 1 else ""):
            add("nit", "blank-line", "Put a blank line between the subject and the body.")

    if body.strip():
        has_why = bool(re.search(r"\b(because|so that|reason|why|in order to|to avoid|trade-?off|motivation)\b",
                                  body, re.I))
        if has_why:
            good.append("body explains why")
        else:
            add("warn", "why-missing", "Explain *why* the change is needed, not only what it does - the diff already "
                                       "shows the what.")
        if not re.search(r"#\d+|https?://\S+|\b(jira|issue|ticket|linear|github)\b", body, re.I):
            add("info", "no-ref", "No issue/design link: another reader will not find the context later.")
        if not re.search(r"\btest(ed|ing|s)?\b", body, re.I):
            add("warn", "no-test-steps", "Add 'steps to test' (or the commands run) so the reviewer can reproduce.")
        else:
            good.append("test steps present")
        if re.search(r"\b(ui|frontend|front-end|component|style|css|screen|button|form|layout)\b", text, re.I) \
                and not re.search(r"!\[|\.png|\.jpg|\.gif|\.mp4|screenshot|screen ?cast|video", body, re.I):
            add("info", "ui-no-visual", "UI-facing change with no screenshot/video - reviewers cannot judge visuals "
                                        "from a diff.")
        if re.search(r"\b(next steps|follow-?ups?|not in this pr|out of scope)\b", body, re.I):
            good.append("next steps / out-of-scope declared")
        if re.search(r"\b(clean(ed|ing)? ?up later|cleanup later|do it later|will fix later|temporary|for now)\b", body, re.I):
            add("warn", "later-trap", "'Later' work almost never happens - do it now, or file an issue assigned to you.")

    blockers = [i for i in issues if i["level"] == "blocker"]
    warns = [i for i in issues if i["level"] == "warn"]
    score = max(0, 100 - 25 * len(blockers) - 10 * len(warns) - 3 * len([i for i in issues if i["level"] == "nit"]))
    return {"ok": not blockers, "score": score, "subject": subject, "issues": issues, "good": good,
            "verdict": "ok" if not issues else ("fix blockers first" if blockers else "polish")}


def strip_html_comments(text: str) -> str:
    return re.sub(r"<!--.*?-->", "", text, flags=re.S)


# ------------------------------------------------------------- lint: comment

JUDGMENT = r"\b(dumb|stupid|idiotic|ridiculous|obviously|terrible|awful|nonsense|crazy|silly|weird|broken mess)\b"
DIMINISH = r"\b(simply|simple|just|of course|trivially|merely|easy)\b"
HYPERBOLE = r"\b(always|never|endlessly|nothing ever|everything|every time|constantly)\b"
BLAME = r"\b(why did you|you forgot|you broke|you ignore|you always|you never|your mistake|your fault)\b"
DEMAND = r"\b(you (should|must|need to|have to|ought to)|i (want|insist) you|do it like)\b"
SARCASM = r"(\bsure, because\b|\byeah,? right\b|/s\b|🙄|\bhow (wonderful|surprising)\b)"
ALT_HINT = r"\b(instead|what about|how about|could we|consider|suggest|alternative|propose|what do you think)\b"
RATIONALE = (r"\b(because|since|so that|reason|why:|this (is|would) (better|safer|simpler|clearer)|improves|avoids|"
            r"duplicat\w*|consistent with|reads better|harder to (read|follow)|tests? (pass|fail)|safer|clearer)\b")
TEST_CLAIM = r"\b(tested|untested|i ran|i did not test|not tested|verified locally|test pass)\b"
PRAISE = r"\b(nice|thanks|thank you|good call|great|well done|i learned|appreciate|love this|clean)\b"
SOFTEN = [(r"\byou should\b", "should we"), (r"\byou must\b", "could we"),
          (r"\byou need to\b", "we may want to"), (r"\byou have to\b", "we may want to"),
          (r"\bwhy did you\b", "what was the reason for"), (r"\byou forgot\b", "this seems to miss"),
          (r"\byou broke\b", "this breaks"), (r"\byour code\b", "this code"),
          (r"\bplease (just|simply)\b", "please"), (r"\byour code\b", "this code"),
          (r"\byour (function|method|variable|naming)\b", r"this \1")]


def lint_comment(text: str, role: str = "reviewer") -> dict:
    text = (text or "").strip()
    body = strip_html_comments(text)
    issues: list[dict] = []
    good: list[str] = []

    def add(level: str, rule: str, msg: str) -> None:
        issues.append({"level": level, "rule": rule, "msg": msg})

    if not body:
        return {"ok": False, "issues": [{"level": "blocker", "rule": "empty", "msg": "No comment text."}],
                "good": [], "suggested": None, "verdict": "empty"}

    first = body.split("\n", 1)[0].strip().lower()
    if ":" in first[:24] and not first.startswith(tuple(SEV_LABELS)):
        add("info", "label-format", "Unknown label - prefer Nit: / Optional: / Consider: / FYI: / Blocker:.")
    if not first.startswith(SEV_LABELS):
        add("info", "no-severity-label",
            "No severity label. Lead with 'Nit:' (polish), 'Optional:'/'Consider:' (not required) or 'FYI:' "
            "(future, not this PR) so the author knows what is mandatory.")
    else:
        good.append("severity label present")

    for pattern, level, rule, msg in (
        (BLAME, "blocker", "blame", "Blames the person ('why did you', 'you forgot') - describe the code instead."),
        (JUDGMENT, "blocker", "judgment", "Judgmental wording ('obviously', 'dumb') - assume intelligent and well-meaning."),
        (DEMAND, "warn", "demand", "Imperative demand ('you should/must') - ask, explain, suggest instead."),
        (SARCASM, "blocker", "sarcasm", "Sarcasm reads as hostile in async text - state the issue plainly."),
        (DIMINISH, "warn", "diminishing", "Diminishing word ('simply', 'just', 'easy') - it reads as condescension."),
        (HYPERBOLE, "nit", "hyperbole", "Hyperbole ('always', 'never') - keep it factual or the point gets argued away."),
    ):
        found = _hits(pattern, body)
        if found:
            add(level, rule, f"{msg} (found: {', '.join(found[:4])})")

    exclam = body.count("!")
    if exclam >= 3:
        add("nit", "tone", f"{exclam} exclamation marks - calm the tone before posting.")
    if len(body) > 1200:
        add("nit", "length", f"{len(body)} chars - long threads belong in a call, with a short summary posted back.")

    if not re.search(RATIONALE, body, re.I):
        add("nit", "no-why", "No rationale - say *why* the change improves the code (facts beat preference).")
    else:
        good.append("explains why")
    if re.search(r"\b(don'?t|shouldn'?t|wrong|bad|revert|remove|avoids?)\b", body, re.I) and not re.search(ALT_HINT, body, re.I):
        add("warn", "no-alternative", "Rejects something without an alternative - add a concrete suggestion or reference.")
    if re.search(r"```|^\s{4,}\S|replace with|use this", body, re.I | re.M) and not re.search(TEST_CLAIM, body, re.I):
        add("info", "untested-suggestion", "You supplied code - say whether you tested it; never imply untested (or "
                                           "LLM/blog-sourced) code is verified.")
    if re.search(r"\b(api|security|privacy|concurrency|race|deadlock|accessib|i18n|perf)\b", body, re.I) \
            and not re.search(r"\b(expert|owner|team|reviewer|qualified)\b", body, re.I):
        add("info", "domain", "Domain-sensitive area - confirm a qualified reviewer covers it.")
    if role == "reviewer" and not re.search(PRAISE, body, re.I):
        add("info", "no-praise", "No positive note - name one thing done well; it is often the highest-value comment.")
    if re.search(r"\b(split|too (large|big)|1000 lines|huge pr)\b", body, re.I):
        good.append("size concern raised")

    suggested = body
    for pattern, repl in SOFTEN:
        suggested = re.sub(pattern, repl, suggested, flags=re.I)
    suggested = re.sub(r"\b(just|simply|obviously|of course|clearly|easily)\b[ ]*", "", suggested, flags=re.I)
    suggested = re.sub(r"\b(dumb|stupid|idiotic|ridiculous|nonsense|silly)\b[ ]*", "", suggested, flags=re.I)
    suggested = re.sub(r"\s{2,}", " ", suggested).strip()
    suggested = re.sub(r"\b(it|this|that) (is|was|seems)\s*[.,]?\s*$", "", suggested, flags=re.I).strip().rstrip(",")
    suggested = re.sub(r"[,;]\s*$", ".", suggested)
    if not re.match(r"^\s*(nit|optional|consider|fyi|blocker|question):", suggested, re.I):
        level = "blocker" if any(i["level"] == "blocker" for i in issues) else \
            "optional" if any(i["level"] == "warn" for i in issues) else "nit"
        suggested = f"{level.capitalize()}: {suggested}"

    blockers = [i for i in issues if i["level"] == "blocker"]
    warns = [i for i in issues if i["level"] == "warn"]
    return {"ok": not blockers and not warns, "blockers": len(blockers), "warns": len(warns),
            "issues": issues, "good": good, "suggested": suggested if suggested != body else None,
            "verdict": "rewrite before posting" if blockers else
                       ("soften" if warns else ("label only" if issues else "ok"))}


# ---------------------------------------------------------------- lint: diff


def lint_diff(text: str) -> dict:
    text = text or ""
    files: list[tuple[str, int, int]] = []
    current, added, removed = None, 0, 0
    for line in text.split("\n"):
        if line.startswith("diff --git"):
            if current:
                files.append((current, added, removed))
            current, added, removed = line.split(" b/")[-1].strip(), 0, 0
        elif current is not None:
            if line.startswith("+") and not line.startswith("+++"):
                added += 1
            elif line.startswith("-") and not line.startswith("---"):
                removed += 1
        m = re.match(r"^\s*(\S+)\s*\|\s*(\d+)\s*([+-]*)", line)   # git diff --stat row
        if m and "|" in line and current is None:
            files.append((m.group(1), len(m.group(3).replace("-", "")) or int(m.group(2)) // 5,
                          len(m.group(3).replace("+", ""))))
    if current:
        files.append((current, added, removed))
    summary = re.search(r"(\d+)\s+files? changed(?:, (\d+) insertions?\(\+\))?(?:, (\d+) deletions?\(-\))?",
                        text)
    if not files:
        if summary:
            return {"files": int(summary.group(1)), "added": int(summary.group(2) or 0),
                    "removed": int(summary.group(3) or 0), "status": "unparsed-diff",
                    "note": "Only a diffstat summary was given; pass the real diff for the tests/refactor gate."}

    added = sum(a for _, a, _ in files)
    removed = sum(r for _, _, r in files)
    if summary:                      # diffstat bars are scaled; trust the real totals
        added = int(summary.group(2) or added)
        removed = int(summary.group(3) or removed)
    churn = added + removed
    count = int(summary.group(1)) if summary else len(files)

    tests = [f for f, _, _ in files if re.search(r"(^|/)(tests?|spec|__tests__)/|\.(test|spec)\.[jt]sx?$|_test\.(py|go|rs|rb)$|(^|/)(test|spec)[-_.][^/]+\.(py|js|ts|tsx|go|rs|rb|java)$|Test\.java$", f)]
    docs = [f for f, _, _ in files if re.search(r"\.(md|rst|adoc|txt)$|(^|/)docs?/", f)]
    refactorish = churn > 150 and any(abs(a - r) <= max(2, churn * 0.05) for _, a, r in files)

    issues: list[dict] = []
    if churn > 1000 or count > 30:
        verdict = "split"
        issues.append({"level": "blocker", "rule": "size",
                       "msg": f"{churn} changed lines across {count} files - reviewers may reject purely for size. "
                              "Split into self-contained PRs (stack them, or split by file/layer/feature)."})
    elif churn > 400 or count > 12:
        verdict = "warn"
        issues.append({"level": "warn", "rule": "size",
                       "msg": f"{churn} changed lines across {count} files - justify it, or split; ~100 lines "
                              "per PR is the comfortable zone."})
    else:
        verdict = "ok"
    if not tests and any(not re.search(r"\.(md|rst|adoc|txt|json|ya?ml|lock)$", f) for f, _, _ in files):
        issues.append({"level": "warn", "rule": "tests",
                       "msg": "Source files changed with no test file in the same PR - tests travel with the code."})
    if refactorish:
        issues.append({"level": "info", "rule": "refactor",
                       "msg": "Positive and negative churn are near-equal - looks like a rename/format pass. Keep pure "
                              "refactors in a separate PR so the behaviour diff stays readable."})
    if docs and len(docs) == len(files):
        issues.append({"level": "info", "rule": "docs-only", "msg": "Docs-only change: keep it separate and quick."})

    top = sorted(files, key=lambda f: f[1] + f[2], reverse=True)[:3]
    return {"files": count, "added": added, "removed": removed,
            "churn": churn, "approximate_churn": bool(summary), "tests_included": tests, "docs": docs,
            "verdict": verdict, "issues": issues,
            "main_files": [{"file": f, "added": a, "removed": r} for f, a, r in top]}


def review_plan(text: str) -> dict:
    gate = lint_diff(text)
    steps = [
        "Pass 1 - broad view: read the description, decide whether the change should exist at all. If not, say so "
        "immediately with an alternative.",
        "Pass 2 - main parts: " + (", ".join(f["file"] for f in gate.get("main_files", [])) or "largest-churn files") +
        ". Send design-level comments now - the author may already be stacking work on this.",
        "Pass 3 - the rest in a fixed sequence so nothing is missed; reading the tests first is often the fastest way "
        "to grasp intent.",
    ]
    notes = ["Look at the whole file for added lines that belong in a smaller function; look at the change in system "
             "context.", "Label severity on every comment and name at least one good thing."]
    if gate["verdict"] in ("warn", "split"):
        notes.append("Consider asking for a split before a deep read: " + gate["issues"][0]["msg"])
    return {"gate": gate, "passes": steps, "notes": notes}


# ---------------------------------------------------------------------- CLI


def _emit(obj: dict) -> None:
    sys.stdout.write(json.dumps(obj, ensure_ascii=False, default=str))


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="PR/code-review craft core")
    parser.add_argument("command", choices=["detect", "context", "checklist", "lint-desc", "lint-comment",
                                            "lint-diff", "plan", "selftest"])
    parser.add_argument("--text", default="")
    parser.add_argument("--file", default=None)
    parser.add_argument("--stdin", action="store_true")
    parser.add_argument("--role", default=None, choices=["reviewer", "author", "both"])
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    text = _text_from(args)
    try:
        if args.command == "detect":
            _emit(detect(text))
        elif args.command == "context":
            _emit(context_block(text, args.role))
        elif args.command == "checklist":
            _emit(checklist(args.role or "both"))
        elif args.command == "lint-desc":
            _emit(lint_description(text))
        elif args.command == "lint-comment":
            _emit(lint_comment(text, args.role or "reviewer"))
        elif args.command == "lint-diff":
            _emit(lint_diff(text))
        elif args.command == "plan":
            _emit(review_plan(text))
        elif args.command == "selftest":
            _emit(selftest())
    except Exception as err:                                    # never crash the caller
        _emit({"ok": False, "error": f"{type(err).__name__}: {err}"})
    return 0


def selftest() -> dict:
    cases = {
        "detect.review": detect("can you review this PR? the diff touches auth"),
        "detect.chatter": detect("hey, ok"),
        "detect.author": detect("my PR description is ready, should I split the PR?"),
        "desc.bad": lint_description("Fix bug.\n\nmade some changes"),
        "desc.good": lint_description(
            "Add search box to the app header\n\nBecause users keep asking for inline search (issue #1234).\n\n"
            "Steps to test:\n1. sign in\n2. type 'test' and hit enter\n3. expect /search?query=test\n\n"
            "Next steps: implement the search page (#1235)."),
        "comment.bad": lint_comment("You should just rename this, it's obviously dumb and your code is broken."),
        "comment.good": lint_comment("Nit: this helper duplicates the parser in utils.\nInstead, could we call "
                                     "parseQuery() here? I tested the replacement locally and the tests pass."),
        "diff.big": lint_diff("diff --git a/a.ts b/a.ts\n" + "+x\n" * 700 + "diff --git a/b.py b/b.py\n-x\n" * 350),
        "diff.small": lint_diff("diff --git a/a.ts b/a.ts\n+const x = 1\ndiff --git a/a.test.ts b/a.test.ts\n+expect(x).toBe(1)"),
        "plan": review_plan("diff --git a/a.ts b/a.ts\n" + "+x\n" * 120),
    }
    summary = {k: (v.get("hit"), v.get("verdict", v.get("ok")), v.get("score")) for k, v in cases.items()}
    return {"ok": True, "cases": summary}


if __name__ == "__main__":
    raise SystemExit(main())
````

## `docs/README.md`

sha256 `d617a76955e43ba7bc8d7f6c9a8493a079e09c753b8733f2069197686816639c` · 28 lines

````markdown
# Docs

Everything the drill work produced, in reading order.

| Document | What it is | Status |
|---|---|---|
| [`DRILL-BUG-AND-PLUGIN-FULL-DOC-20260925.md`](DRILL-BUG-AND-PLUGIN-FULL-DOC-20260925.md) | **The canonical specification.** What the drill is, why it exists, the ledger data model, the three c2g resolution layers, the 16-tool reference implementation, the operating guide, both reviews (§7) and the risk register (§8), plus Appendices A–D. | current (v0.8.3, 104 tests) |
| [`DRILL-PLUGIN-SOURCE-BUNDLE-20260925.md`](DRILL-PLUGIN-SOURCE-BUNDLE-20260925.md) | **Generated snapshot for reviewers.** All 29 tracked files inline, with per-file `sha256` + line counts, the declared test count per file, and the recorded `node --test` run. Regenerate with `node tools/build-source-bundle.mjs`. | generated at the commit in its header |
| [`DRILL-E2E-REVIEW-20260925.md`](DRILL-E2E-REVIEW-20260925.md) | The first end-to-end review as a standalone record: method, the seven defects it found (gate binding, unbound `cwd`-style holes, rule-8 misses, mislabelled diffs), what was verified true, what stayed unverified. | historical — its content is §7 of the full doc |
| [`DRILL-BUG-FULL-DOC-20260925.md`](DRILL-BUG-FULL-DOC-20260925.md) | The specification as it stood at **v0.8.0**, before the second review. | historical |

The two historical files are deliberately **not** updated as the code moves: they record what that revision was. Live numbers (version, test count, defect list) belong to the full document.

## How the docs are kept honest

- Every claim in the specification was checked against the source or the machine; anything that could not be settled is listed as *unverified* rather than asserted (see §7.4).
- The risk register records each defect **with the version that fixed it**, so a reader can tell a live risk from a closed one.
- The source bundle is generated from a clean git revision, never hand-edited: its inventory hashes and its embedded code blocks come from the same bytes.

## Credits and upstream

The graph layer these documents describe is not this repository's work:

- [NodeDB-Lab/code2graph](https://github.com/NodeDB-Lab/code2graph) — the Rust, tree-sitter based code-graph extractor and `c2g` CLI, written by [farhan-syah](https://github.com/farhan-syah) (NodeDB founder), with CLI fixes by [EnRaiha](https://github.com/EnRaiha). Its per-project cache is what §4 of the specification queries, and its deliberately storage-neutral design is why §4 has three layers.
- [NodeDB-Lab/nodedb](https://github.com/NodeDB-Lab/nodedb) — the repository the drill was built and exercised against; the merged store's `nd_*` shards come from it.
- [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) — the plugin catalog whose conventions (`dsh.bundle.patch`, `dsh-` naming, per-entry schema) this kit follows.

````

## `frontends/README.md`

sha256 `3c88c71470530bd65848db17328d5ef5cab4286ae5e5bde2127c7ec43830cb14` · 46 lines

````markdown
# frontends — Kilo and Hermes

Thin runtime glue around the two cores in [`../core/`](../core/). They own no logic: every tool call is forwarded to `c2g_tools.py` or `pr_craft.py`, so the two runtimes and the DSH plugin cannot drift apart.

| Path | Runtime | Exposes |
|---|---|---|
| `kilo/c2g/` | Kilo (plugin API, TypeScript) | `c2g_status`, `c2g_index`, `c2g_symbols`, `c2g_def`, `c2g_error`, `c2g_blast_radius`, `c2g_diff_impact`, `c2g_query`, `c2g_raw` + a `SKILL.md` |
| `kilo/pr-craft/` | Kilo | the PR-craft tools + a `SKILL.md` |
| `hermes/c2g/` | Hermes (`plugin.yaml`, Python) | the same c2g tools, one core |
| `hermes/pr-craft/` | Hermes | the same PR-craft tools |

## Core path

Each frontend defaults to the home-directory copies (`~/scripts/c2g_tools.py`, `~/scripts/pr_craft.py`) and honours an environment override, so a checkout can point at this repository's `core/`:

| Frontend | Constant | Override |
|---|---|---|
| `kilo/c2g/server.ts` | `CORE` | `C2G_CORE` |
| `kilo/pr-craft/server.ts` | `CORE` | `PR_CRAFT_CORE` |
| `hermes/c2g/tools.py` | `CORE` | `C2G_CORE` |
| `hermes/pr-craft/tools.py` | `CORE` | `PR_CRAFT_CORE` |

```sh
export C2G_CORE="$PWD/core/c2g_tools.py"
```

## Install

The runtimes load plugins from their own directories; copy or symlink the folders in:

```sh
ln -sfn "$PWD/frontends/kilo/c2g"       ~/.kilo/plugins/c2g
ln -sfn "$PWD/frontends/kilo/pr-craft"  ~/.kilo/plugins/pr-craft

ln -sfn "$PWD/frontends/hermes/c2g"      ~/.hermes/plugins/c2g
ln -sfn "$PWD/frontends/hermes/pr-craft" ~/.hermes/plugins/pr-craft
```

## Where the graph comes from

These frontends read the graph that [NodeDB-Lab/code2graph](https://github.com/NodeDB-Lab/code2graph) — the Rust extractor written by [farhan-syah](https://github.com/farhan-syah) (NodeDB founder) — produces, through the same three-layer fallback as the core: per-project CLI cache, merged store, then the `c2g` binary. See [`../core/README.md`](../core/README.md) for the details and the upstream schema references.

## Caveat from the source machine

On the machine this kit came from, the Kilo and opencode servers are deliberately stopped ("other than hermes as main, others have no server"); the frontends still work, they are simply not the main runtime there. Nothing in this directory depends on those services running.
````

## `frontends/hermes/c2g/SKILL.md`

sha256 `ea3640f117e6a831a5cb5288e286a71f6c54889a49531fceba0abd8b6b89bdda` · 89 lines

````markdown
---
name: c2g
description: "Straight code2graph (c2g) access for LLM agents — symbol lookup, def sites, callers/callees, blast radius, diff impact, usages, references, imports, module-deps. DB-less: reads the local c2g index, no NodeDB/PG/cortex. Trigger on 'blast radius', 'callers of', 'callees', 'who calls', 'symbol lookup', 'diff impact', 'code2graph', 'c2g'."
---

# c2g — straight code2graph access (dbless)

One stdlib core, two frontends:

| Layer | Path |
|---|---|
| Core (logic) | `~/scripts/c2g_tools.py` |
| Kilo plugin | `~/.kilo/plugins/c2g/server.ts` → tools `c2g_*` |
| Hermes plugin | `~/.hermes/plugins/c2g/` → tools `c2g_*` |
| Binary | `C2G_BIN` or `~/projects/code2graph/target/release/c2g` |

DB-less by construction: it shells out to the c2g binary and reads its index/cache on disk.
No NodeDB, no PG, no Maya cortex. The same questions also answer through
`cortex_codegraph_*` (NodeDB code graph) and `knowledge-graph_*` (PG store) when those are warm;
this skill is the direct path that works with zero stores.

## Tools

| Tool | Question it answers |
|---|---|
| `c2g_status` | Is the local index ready for this root? Known omissions? |
| `c2g_error` | Parse a panic/backtrace/compiler diagnostic into file:line frames and resolve each to its symbol (cache → merged store → binary) |
| `c2g_index` | Build/refresh the index (`--trust-mtime`). Heavy — run when the CPU is free. |
| `c2g_symbols` | List symbols, optional name filter |
| `c2g_def` | Where is this symbol defined (file, line, kind) |
| `c2g_blast_radius` | callers + callees + impact for one symbol, one call |
| `c2g_diff_impact` | Current diff vs base → affected symbols and callers (incremental sync) |
| `c2g_query` | `usages` · `references` · `imports` · `module_deps` |
| `c2g_raw` | Escape hatch: explicit c2g argv |

## Structural sweeps

`ast-grep` (`sg`, installed) covers AST-level pattern search that regex cannot:
`sg -p '$C.consume_rest()' --lang rust <dir>` finds method-call sites; `sg -p '#[allow(dead_code)]'`
finds attribute patterns. Use `tgrep`/`rg` for text, `sg` for shape, `c2g` for relationships. Start from the failure signal when there is one: `c2g_error` turns a stack trace into symbols before any guessing.

## Usage rules

1. **Always name the root.** Resolution order: explicit `root` arg → `C2G_ROOT` → git root of cwd.
   The CLI itself refuses an implicit root that is a home directory or the filesystem root, and the
   core refuses those even when passed explicitly: an agent session runs with cwd=$HOME, so the raw
   `cwd` default walked ~2.4M files and died on the subprocess timeout with no output. A refusal is
   instant — pass `root="~/projects/<repo>"` and retry.
2. **Warm the index once per repo**: `c2g_index` (or `c2g index --trust-mtime --root <repo>`).
   Queries add `--allow-partial` by default so a partial index answers instead of erroring;
   pass `allow_partial=false` to require a complete index.
3. **Blast radius before patching** (stage 2 of the five-stage survey): `c2g_blast_radius` gives
   upstream callers, downstream callees, and impact together. Feed the LLM only the target
   implementation plus 1-hop neighbours — never the whole repo.
4. **After edits** (stage 5 / incremental sync): `c2g_diff_impact origin/main` (or `HEAD~1`)
   maps changed files to affected symbols; re-index only changed files, not the world.
5. **Timeouts**: every call carries `--timeout` (60 s queries, 900 s index) so c2g aborts with its own
   exit 4 `operation timed out` instead of being SIGKILLed with empty output. Override with
   `deadline="120s"`. A cold or missing index makes `callers`/`impact` slow — warm it first.
6. **When the answer must come from the stores instead**: use `cortex_codegraph_*`
   (NodeDB `code_nodes`, currently nodes-only: search works, traversal needs edges) or
   `knowledge-graph_*` (`lsp_references`, `find_path`, `semantic_query`; store must be scanned).

## Examples

```bash
# core CLI (no plugin needed)
python3 ~/scripts/c2g_tools.py describe
printf '{"tool":"blast_radius","name":"coerce_value","root":"$HOME/projects/nodedb"}' \
  | python3 ~/scripts/c2g_tools.py run --stdin
```

Agent calls: `c2g_def(name="extract_vector_floats", root="…")`,
`c2g_blast_radius(name="coerce_value", root="…")`,
`c2g_diff_impact(base="origin/main", root="…")`.

## Pitfalls

- **A missing root is not a slow query, it is a refused query.** Never assume cwd is a project.
- Do not pass a filesystem root, `/tmp`, or a parent of many repos as `root`: it either times out
  or returns megabytes of `omissions`. One repo per call.
- Kilo spawns a fresh `python3` per call, so core edits apply immediately. The Hermes plugin imports
  the core in-process and reloads it on mtime change, but the *plugin module itself* is loaded at
  session start: restart the Hermes session after editing `~/.hermes/plugins/c2g/tools.py`.
- `raw` passes argv verbatim; the core appends `--root` and `--json` only when absent (no `--timeout`).
- The core never builds argv through a shell; arguments are a list, so injection is not a concern.
- Keep the core single: fix `~/scripts/c2g_tools.py`, never the two frontends separately.
- `c2g_error` resolves frames cache-first (per-project cache SQLite → merged `~/Embed/c2g` store) and only then the binary: a cold binary query costs minutes, a cache read milliseconds. Frames under `/rustc/`, `~/.cargo/registry/` and `node_modules` are reported as external, never resolved.
````

## `frontends/hermes/c2g/__init__.py`

sha256 `4fe73484f698bcf9b895c9411726642f07bc66fc8e50fb743fc3853487066714` · 31 lines

````markdown
"""c2g — straight code2graph access for Hermes (dbless).

Registers 8 tools. All logic lives in the shared stdlib-only core
core/c2g_tools.py in this repository (the same core the Kilo plugin bridges into), so the
two frontends stay in sync. No NodeDB, no PG, no cortex.
"""

from . import schemas
from . import tools


def register(ctx):
    ctx.register_tool(name="c2g_status", toolset="c2g",
                      schema=schemas.C2G_STATUS, handler=tools.handle_c2g_status)
    ctx.register_tool(name="c2g_index", toolset="c2g",
                      schema=schemas.C2G_INDEX, handler=tools.handle_c2g_index)
    ctx.register_tool(name="c2g_symbols", toolset="c2g",
                      schema=schemas.C2G_SYMBOLS, handler=tools.handle_c2g_symbols)
    ctx.register_tool(name="c2g_def", toolset="c2g",
                      schema=schemas.C2G_DEF, handler=tools.handle_c2g_def)
    ctx.register_tool(name="c2g_error", toolset="c2g",
                      schema=schemas.C2G_ERROR, handler=tools.handle_c2g_error)
    ctx.register_tool(name="c2g_blast_radius", toolset="c2g",
                      schema=schemas.C2G_BLAST_RADIUS, handler=tools.handle_c2g_blast_radius)
    ctx.register_tool(name="c2g_diff_impact", toolset="c2g",
                      schema=schemas.C2G_DIFF_IMPACT, handler=tools.handle_c2g_diff_impact)
    ctx.register_tool(name="c2g_query", toolset="c2g",
                      schema=schemas.C2G_QUERY, handler=tools.handle_c2g_query)
    ctx.register_tool(name="c2g_raw", toolset="c2g",
                      schema=schemas.C2G_RAW, handler=tools.handle_c2g_raw)
````

## `frontends/hermes/c2g/plugin.yaml`

sha256 `065e2ac6fab5cf2a27ea92dd6d4764fecd9ceeb80e048622eb6bf4de19e9e250` · 19 lines

````markdown
name: c2g
version: 1.0.0
description: |
  Straight code2graph access (dbless): symbols, def, callers, callees, impact,
  diff-impact, usages, references, imports, module-deps, error (failure signal → symbols). One stdlib-only Python
  core (~/scripts/c2g_tools.py) shared with the Kilo plugin
  (~/.kilo/plugins/c2g). No NodeDB, no PG, no cortex — the direct path; the
  same questions also answer through cortex_codegraph_* and knowledge-graph_*.
provides_tools:
  - c2g_status
  - c2g_index
  - c2g_symbols
  - c2g_def
  - c2g_error
  - c2g_blast_radius
  - c2g_diff_impact
  - c2g_query
  - c2g_raw
````

## `frontends/hermes/c2g/schemas.py`

sha256 `75329da0f32aa83c0b06a3dc18f6c4d06fee02081d9206b7fdfe4aac0f919ae8` · 149 lines

````markdown
"""Tool schemas — what the LLM sees for the c2g plugin."""

_ROOT = {"type": "string", "description": "Repository root (default: C2G_ROOT or cwd)"}

C2G_STATUS = {
    "name": "c2g_status",
    "description": (
        "Readiness of the local code2graph index for a repository (dbless, direct c2g "
        "binary). Answers: binary found, index state, known omissions. Run this first "
        "when unsure."
    ),
    "parameters": {"type": "object", "properties": {"root": _ROOT}},
}

C2G_INDEX = {
    "name": "c2g_index",
    "description": (
        "Build or refresh the local code2graph index for a repository (--trust-mtime). "
        "Heavy: run when the CPU is free. Everything else answers from this cache."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "root": _ROOT,
            "force": {"type": "boolean", "description": "Ignore the existing index and rebuild"},
        },
    },
}

C2G_SYMBOLS = {
    "name": "c2g_symbols",
    "description": "List indexed symbols, optionally filtered by a name query (dbless).",
    "parameters": {
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "Name filter, e.g. 'coerce'"},
            "root": _ROOT,
        },
    },
}

C2G_DEF = {
    "name": "c2g_def",
    "description": "Definition site of one symbol: file, line, kind (dbless).",
    "parameters": {
        "type": "object",
        "properties": {
            "name": {"type": "string", "description": "Exact symbol name"},
            "root": _ROOT,
        },
        "required": ["name"],
    },
}

C2G_BLAST_RADIUS = {
    "name": "c2g_blast_radius",
    "description": (
        "Blast radius of one symbol: callers, callees and impact in one call (dbless). "
        "The stage-2 tool of the five-stage survey."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "name": {"type": "string", "description": "Exact symbol name"},
            "root": _ROOT,
        },
        "required": ["name"],
    },
}

C2G_DIFF_IMPACT = {
    "name": "c2g_diff_impact",
    "description": (
        "Impact of the current diff against a base revision: changed files -> affected "
        "symbols and callers (dbless). The incremental-sync tool."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "base": {"type": "string", "description": "Base revision, e.g. origin/main or HEAD~1"},
            "depth": {"type": "number", "description": "Traversal depth (default 2)"},
            "root": _ROOT,
        },
    },
}

C2G_QUERY = {
    "name": "c2g_query",
    "description": (
        "One code2graph query: usages, references, imports or module-deps (dbless). Use "
        "c2g_blast_radius for callers/callees/impact."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "tool": {
                "type": "string",
                "enum": ["usages", "references", "imports", "module_deps"],
                "description": "Which query to run",
            },
            "target": {
                "type": "string",
                "description": "Symbol name (usages/references) or file path (imports/module_deps)",
            },
            "root": _ROOT,
        },
        "required": ["tool", "target"],
    },
}

C2G_RAW = {
    "name": "c2g_raw",
    "description": (
        "Run the c2g CLI with explicit argv (dbless escape hatch). Example: "
        "['status', '--json']. Prefer the named tools; arguments pass verbatim."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "argv": {
                "type": "array",
                "items": {"type": "string"},
                "description": "c2g arguments without the binary name",
            },
            "root": _ROOT,
        },
        "required": ["argv"],
    },
}

C2G_ERROR = {
    "name": "c2g_error",
    "description": (
        "Stage 1 from a failure signal: parse a panic, backtrace, compiler diagnostic or "
        "traceback into file:line frames and resolve each frame to its symbol — per-project "
        "c2g cache, then the merged ~/Embed/c2g store, then the c2g binary. Use this before "
        "guessing where a bug lives."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "text": {"type": "string", "description": "Raw failure text: panic, backtrace, compiler diagnostics, or a log excerpt"},
            "root": _ROOT,
            "max_resolve": {"type": "integer", "description": "Cap on frames resolved against the graph (default 12)"},
        },
        "required": ["text"],
    },
}
````

## `frontends/hermes/c2g/tools.py`

sha256 `9dc77ddb621edc1ad21ca3ce32b38a05bd828a8f9cf41c1b01d6892e24b213f1` · 224 lines

````markdown
"""Handlers for the c2g Hermes plugin.

All logic lives in one stdlib-only core shared with the Kilo plugin:
core/c2g_tools.py in this repository. Handlers return JSON strings (Hermes convention),
each carrying a rendered `markdown` field so the answer is readable as-is.
"""

from __future__ import annotations

import os
import importlib.util
import json
import subprocess
import sys
import time
from pathlib import Path

# Core resolution: an explicit override, else this kit's copy, else the usual
# home-directory install (frontends/hermes/c2g/tools.py -> repo root is parents[3]).
REPO_CORE = Path(__file__).resolve().parents[3] / "core" / "c2g_tools.py"
CORE = Path(os.environ.get("C2G_CORE") or (REPO_CORE if REPO_CORE.exists() else Path.home() / "scripts" / "c2g_tools.py"))
LOG = Path(os.environ.get("C2G_LOG") or Path.home() / "logs" / "c2g.log")
MAX_RENDER = 8_000
QUERY_TIMEOUT_S = 200
INDEX_TIMEOUT_S = 900

_state: dict[str, object] = {"core": None, "mtime": None}


def _core_mtime() -> int | None:
    try:
        return CORE.stat().st_mtime_ns
    except OSError:
        return None


def _log(line: str) -> None:
    try:
        LOG.parent.mkdir(parents=True, exist_ok=True)
        with LOG.open("a", encoding="utf-8") as fh:
            fh.write(f"{time.strftime('%Y-%m-%dT%H:%M:%S')} {line}\n")
    except Exception:
        pass


def core():
    """Import the shared core (stdlib only) or fall back to subprocess use.

    The module is cached per process, so a core edit is picked up on its next
    mtime change instead of needing a Hermes restart.
    """
    mtime = _core_mtime()
    if _state["core"] is not None and _state["mtime"] == mtime:
        return _state["core"] or None
    try:
        spec = importlib.util.spec_from_file_location("c2g_tools_core", CORE)
        if spec is None or spec.loader is None:
            raise RuntimeError(f"cannot load core from {CORE}")
        mod = importlib.util.module_from_spec(spec)
        sys.modules["c2g_tools_core"] = mod
        spec.loader.exec_module(mod)
        _state["core"] = mod
    except Exception as err:
        _log(f"core-import-fail err={err}")
        _state["core"] = False
    _state["mtime"] = mtime
    return _state["core"] or None


def run(tool: str, **kwargs):
    """Call the core in-process; fall back to its CLI over stdin."""
    mod = core()
    if mod is not None:
        try:
            return mod.query(tool, **kwargs)
        except Exception as err:
            _log(f"core-call-fail tool={tool} err={err}")
    payload = {"tool": tool, **{k: v for k, v in kwargs.items() if isinstance(v, (str, int, float, bool, list))}}
    try:
        res = subprocess.run(
            [sys.executable, str(CORE), "run", "--stdin"],
            input=json.dumps(payload), capture_output=True, text=True, timeout=QUERY_TIMEOUT_S,
        )
        if res.stdout.strip():
            return json.loads(res.stdout)
    except Exception as err:
        _log(f"core-cli-fail tool={tool} err={err}")
    return None


# ── renderers (mirror the Kilo plugin's output) ──


def _clip(text: str) -> str:
    if len(text) <= MAX_RENDER:
        return text
    return f"{text[:MAX_RENDER]}\n…[clipped {len(text) - MAX_RENDER} chars]"


def _body(d: dict) -> str:
    parsed = d.get("parsed")
    if parsed is not None:
        return _clip(json.dumps(parsed, indent=1, ensure_ascii=False))
    out = str(d.get("stdout") or "").strip()
    err = str(d.get("stderr") or "").strip()
    return _clip(out or err or "_(empty output)_")


def _render(d: dict | None) -> str:
    if not d:
        return f"❌ c2g core unreachable (python3 {CORE})."
    if d.get("tool") == "blast_radius" and d.get("parts"):
        out = f"# c2g_blast_radius — `{d.get('name')}`\n"
        for name, sub in (d["parts"] or {}).items():
            ok = "ok" if sub.get("ok") else f"fail({sub.get('code')})"
            out += f"\n## {name} — {ok} ({sub.get('elapsed_ms')}ms)\n{_body(sub)}\n"
        return out
    if d.get("tool") == "error" and isinstance(d.get("frames"), list):
        frames = d["frames"]
        out = f"# c2g_error — {d.get('resolved', 0)}/{len(frames)} frames resolved\n"
        if d.get("message"):
            out += f"message: {d['message']}\n"
        if d.get("root"):
            out += f"root: `{d['root']}`\n"
        out += "\n"
        for f in frames:
            sym = f.get("symbol") or {}
            where = f"{f.get('file')}:{f.get('line')}"
            hint_name = sym.get("name")
            hint = ""
            if f.get("symbol_hint") and hint_name and not str(f["symbol_hint"]).endswith(f"::{hint_name}"):
                hint = f" _(backtrace: {f['symbol_hint']})_"
            if f.get("external"):
                out += f"- {where} _(external)_\n"
            elif hint_name:
                out += f"- {where} → **{hint_name}** [{sym.get('kind')}] via {f.get('source')}{hint}\n"
            else:
                detail = f": {f['error']}" if f.get("error") else ""
                out += f"- {where} _(unresolved{detail})_\n"
        if d.get("sources"):
            out += f"\nresolved via: {', '.join(d['sources'])}\n"
        return out
    if d.get("ok"):
        head = f"ok ({d.get('elapsed_ms')}ms)"
    else:
        head = f"fail code={d.get('code')}" + (f" {d.get('error')}" if d.get("error") else "")
    out = f"# c2g_{d.get('tool') or 'run'} — {head}\n"
    if d.get("root"):
        out += f"root: `{d['root']}`\n"
    out += f"\n{_body(d)}\n"
    if d.get("truncated"):
        out += "\n_Output truncated by the core (40 KB cap). Narrow the query._\n"
    return out


def _pack(markdown: str, data: dict | None = None) -> str:
    payload = {"ok": True, "markdown": markdown}
    if data:
        payload["data"] = data
    return json.dumps(payload, ensure_ascii=False)


def _simple(tool: str, args: dict, **extra) -> str:
    try:
        kw = {k: args.get(k) for k in ("root", "query", "name", "target", "base", "depth", "force", "argv")}
        kw = {k: v for k, v in kw.items() if v is not None}
        kw.update(extra)
        d = run(tool, **kw)
        if not d:
            return json.dumps({"ok": False, "error": "c2g core unreachable"})
        return _pack(_render(d), d)
    except Exception as err:
        return json.dumps({"ok": False, "error": f"{type(err).__name__}: {err}"})


# ── tool handlers ──


def handle_c2g_status(args: dict, **kwargs) -> str:
    return _simple("status", args)


def handle_c2g_index(args: dict, **kwargs) -> str:
    return _simple("index", args)


def handle_c2g_symbols(args: dict, **kwargs) -> str:
    return _simple("symbols", args)


def handle_c2g_def(args: dict, **kwargs) -> str:
    return _simple("def", args)


def handle_c2g_error(args: dict, **kwargs) -> str:
    """Parse a failure signal and resolve its frames to symbols."""
    try:
        kw = {"text": args.get("text"), "root": args.get("root")}
        if args.get("max_resolve") is not None:
            kw["max_resolve"] = args["max_resolve"]
        kw = {k: v for k, v in kw.items() if v is not None}
        d = run("error", **kw)
        if not d:
            return json.dumps({"ok": False, "error": "c2g core unreachable"})
        return _pack(_render(d), d)
    except Exception as err:
        return json.dumps({"ok": False, "error": f"{type(err).__name__}: {err}"})


def handle_c2g_blast_radius(args: dict, **kwargs) -> str:
    return _simple("blast_radius", args)


def handle_c2g_diff_impact(args: dict, **kwargs) -> str:
    return _simple("diff_impact", args)


def handle_c2g_query(args: dict, **kwargs) -> str:
    return _simple(str(args.get("tool") or ""), args)


def handle_c2g_raw(args: dict, **kwargs) -> str:
    return _simple("raw", args)
````

## `frontends/hermes/pr-craft/__init__.py`

sha256 `73d4ae01ec17c89d4910a5079610d3d305f1b408eb7dbd50393321bc0f5fbeb1` · 32 lines

````markdown
"""pr-craft — PR & code-review craft for Hermes.

Registers 5 tools, the pre_llm_call context-injection hook, and a /pr command.
All logic lives in the shared stdlib-only core core/pr_craft.py
(same core the Kilo plugin bridges into), so the two stay in sync.
"""

from . import schemas
from . import tools


def register(ctx):
    # ── Tools ──
    ctx.register_tool(name="pr_checklist", toolset="pr-craft",
                      schema=schemas.PR_CHECKLIST, handler=tools.handle_pr_checklist)
    ctx.register_tool(name="pr_lint_description", toolset="pr-craft",
                      schema=schemas.PR_LINT_DESCRIPTION, handler=tools.handle_pr_lint_description)
    ctx.register_tool(name="pr_lint_comment", toolset="pr-craft",
                      schema=schemas.PR_LINT_COMMENT, handler=tools.handle_pr_lint_comment)
    ctx.register_tool(name="pr_lint_diff", toolset="pr-craft",
                      schema=schemas.PR_LINT_DIFF, handler=tools.handle_pr_lint_diff)
    ctx.register_tool(name="pr_review_plan", toolset="pr-craft",
                      schema=schemas.PR_REVIEW_PLAN, handler=tools.handle_pr_review_plan)

    # ── Injection: PR/review intent in the user message -> distilled checklist ──
    ctx.register_hook("pre_llm_call", tools.pre_llm_call)

    # ── Slash command ──
    ctx.register_command("pr", tools.command_pr,
                         description="PR craft: /pr checklist [role] | /pr desc <title> | "
                                     "/pr comment <text> | /pr diff <diff>")
````

## `frontends/hermes/pr-craft/plugin.yaml`

sha256 `5d2fc24e022bc9b32b52ef32683c4745da0e6155e1c97ffd3b1b08b28fc490cc` · 15 lines

````markdown
name: pr-craft
version: 1.0.0
description: |
  PR & code-review craft — distilled checklist injection plus lint tools for PR
  descriptions, review comments and diff size gates. One stdlib-only Python core
  (~/scripts/pr_craft.py) shared with the Kilo plugin (~/.kilo/plugins/pr-craft).
provides_tools:
  - pr_checklist
  - pr_lint_description
  - pr_lint_comment
  - pr_lint_diff
  - pr_review_plan
provides_hooks:
  - pre_llm_call
````

## `frontends/hermes/pr-craft/schemas.py`

sha256 `14eab8eb275477bd3aaeb0f8b323b161db772bde9924b849e4ce954af07be42b` · 94 lines

````markdown
"""Tool schemas — what the LLM sees for the pr-craft plugin."""

PR_CHECKLIST = {
    "name": "pr_checklist",
    "description": (
        "PR/code-review checklist distilled from 6 review guides (Google eng-practices, "
        "mawrkus, thoughtbot, book-pr, Pro Git, first-contributions). Use before authoring "
        "a PR or before starting a review."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "role": {
                "type": "string",
                "enum": ["both", "author", "reviewer"],
                "description": "Whose checklist: both (default), author, reviewer",
            }
        },
    },
}

PR_LINT_DESCRIPTION = {
    "name": "pr_lint_description",
    "description": (
        "Lint a PR title + description against the distilled rules (subject length and "
        "imperative mood, body explains why, issue reference, steps to test, screenshot for "
        "UI changes, 'clean up later' trap). Returns blockers, warnings, nits and a score."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "title": {"type": "string", "description": "PR title (subject line)"},
            "body": {
                "type": "string",
                "description": "PR description body; omit to lint the title only",
            },
        },
        "required": ["title"],
    },
}

PR_LINT_COMMENT = {
    "name": "pr_lint_comment",
    "description": (
        "Lint a draft review comment for tone and usefulness: blame/judgment/diminishing "
        "words, imperative demands, missing severity label (Nit:/Optional:/FYI:), missing "
        "rationale or alternative, untested code suggestions. Returns a suggested rewrite."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "text": {"type": "string", "description": "The draft comment text"},
            "role": {
                "type": "string",
                "enum": ["reviewer", "author"],
                "description": "Who is writing the comment (default reviewer)",
            },
        },
        "required": ["text"],
    },
}

PR_LINT_DIFF = {
    "name": "pr_lint_diff",
    "description": (
        "Gate a diff/PR size before review: churn and file-count verdict (ok/warn/split), "
        "whether tests travel with the code, mixed-refactor detection, and the main files to "
        "read first. Feed it `git diff`, `git diff --cached`, or a diffstat summary."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "diff": {"type": "string", "description": "Unified diff or diffstat text"},
        },
        "required": ["diff"],
    },
}

PR_REVIEW_PLAN = {
    "name": "pr_review_plan",
    "description": (
        "Build the 3-pass review plan for a diff (broad view -> main parts -> the rest) plus "
        "the size gate, the main files to read first, and reminders about severity labels and "
        "positive feedback."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "diff": {"type": "string", "description": "Unified diff or diffstat text"},
        },
        "required": ["diff"],
    },
}
````

## `frontends/hermes/pr-craft/tools.py`

sha256 `a50a857e3e1024605ea09b6dccc24ff43cbe77167088e74f938e81d27a8c81b7` · 255 lines

````markdown
"""Handlers for the pr-craft Hermes plugin.

All logic lives in one stdlib-only core shared with the Kilo plugin:
core/pr_craft.py in this repository. Handlers return JSON strings (Hermes convention),
each carrying a rendered `markdown` field so the answer is readable as-is.
"""

from __future__ import annotations

import os
import importlib.util
import json
import re
import subprocess
import sys
import time
from pathlib import Path

REPO_CORE = Path(__file__).resolve().parents[3] / "core" / "pr_craft.py"
CORE = Path(os.environ.get("PR_CRAFT_CORE") or (REPO_CORE if REPO_CORE.exists() else Path.home() / "scripts" / "pr_craft.py"))
LOG = Path(os.environ.get("PR_CRAFT_LOG") or Path.home() / "logs" / "pr-craft.log")
MAX_INJECT = 2

_state: dict[str, object] = {"core": None}
_injected: dict[str, int] = {}


def _log(line: str) -> None:
    try:
        LOG.parent.mkdir(parents=True, exist_ok=True)
        with LOG.open("a", encoding="utf-8") as fh:
            fh.write(f"{time.strftime('%Y-%m-%dT%H:%M:%S')} {line}\n")
    except Exception:
        pass


def core():
    """Import the shared core (stdlib only) or fall back to subprocess use."""
    if _state["core"] is None:
        try:
            spec = importlib.util.spec_from_file_location("pr_craft_core", CORE)
            if spec is None or spec.loader is None:
                raise RuntimeError(f"cannot load core from {CORE}")
            mod = importlib.util.module_from_spec(spec)
            sys.modules["pr_craft_core"] = mod
            spec.loader.exec_module(mod)
            _state["core"] = mod
        except Exception as err:
            _log(f"core-import-fail err={err}")
            _state["core"] = False
    return _state["core"] or None


def run(command: str, **kwargs):
    """Call a core function; fall back to the CLI if the import failed."""
    mod = core()
    if mod is not None:
        fn = getattr(mod, command, None)
        if fn:
            return fn(**kwargs)
    # CLI fallback — payload over stdin, never argv (no shell escaping, no arg limits)
    payload = {k: v for k, v in kwargs.items() if isinstance(v, (str, int))}
    try:
        res = subprocess.run(
            [sys.executable, str(CORE), command, "--stdin"],
            input=json.dumps(payload), capture_output=True, text=True, timeout=15,
        )
        if res.returncode == 0 and res.stdout.strip():
            return json.loads(res.stdout)
    except Exception as err:
        _log(f"core-cli-fail cmd={command} err={err}")
    return None


# ── renderers (mirror the Kilo plugin's output) ──

_ICON = {"blocker": "🛑", "warn": "⚠️", "nit": "🔹"}


def _bullets(rows) -> str:
    if not rows:
        return "_none_"
    return "\n".join(f"- {_ICON.get(r['level'], 'ℹ️')} **{r['rule']}** — {r['msg']}" for r in rows)


def _render_checklist(d: dict) -> str:
    sections = d.get("sections", {})
    out = [f"# PR/code-review checklist (role={d.get('role')}, {d.get('count')} items)"]
    for name in ("flow", "author", "reviewer"):
        if name in sections:
            out.append(f"\n### {name.upper()}")
            out += [f"- {i}" for i in sections[name]]
    return "\n".join(out)


def _render_desc(d: dict) -> str:
    out = [f"# pr_lint_description — {d.get('verdict')} (score {d.get('score')}/100)",
           f"\n**Subject:** {d.get('subject') or '(none)'}",
           f"\n### Issues\n{_bullets(d.get('issues'))}"]
    if d.get("good"):
        out.append("\n### Already good\n" + "\n".join(f"- ✅ {g}" for g in d["good"]))
    out.append("\n_Subject ~50 chars, imperative; body answers **why**; include steps to test._")
    return "\n".join(out)


def _render_comment(d: dict) -> str:
    out = [f"# pr_lint_comment — {d.get('verdict')} (blockers {d.get('blockers')}, warns {d.get('warns')})",
           f"\n### Issues\n{_bullets(d.get('issues'))}"]
    if d.get("suggested"):
        out.append("\n### Suggested rewrite\n> " + str(d["suggested"]).replace("\n", "\n> "))
    if d.get("good"):
        out.append("\n### Already good\n" + "\n".join(f"- ✅ {g}" for g in d["good"]))
    out.append("\n_Ask - explain - suggest. Talk about the code, never the developer. Label severity._")
    return "\n".join(out)


def _render_diff(d: dict) -> str:
    if d.get("status") == "unparsed-diff":
        return (f"# pr_lint_diff — {d.get('note')}\n\nParsed summary: {d.get('files')} files, "
                f"+{d.get('added')}/-{d.get('removed')}.")
    out = [f"# pr_lint_diff — **{d.get('verdict')}**", "\n| Metric | Value |\n|---|---|",
           f"| Files | {d.get('files')} |",
           f"| Churn | {d.get('churn')} lines (+{d.get('added')}/-{d.get('removed')}) |",
           f"| Tests in PR | {', '.join(d.get('tests_included') or []) or 'none'} |",
           f"\n### Gate\n{_bullets(d.get('issues'))}"]
    if d.get("main_files"):
        out.append("\n### Read these first\n" + "\n".join(
            f"- `{f['file']}` (+{f['added']}/-{f['removed']})" for f in d["main_files"]))
    out.append("\n_~100 lines is comfortable, ~1000 is too large. Tests travel with the code._")
    return "\n".join(out)


def _render_plan(d: dict) -> str:
    passes = d.get("passes", [])
    out = ["# pr_review_plan\n\n### Passes"]
    out += [f"{i + 1}. {p}" for i, p in enumerate(passes)]
    if d.get("notes"):
        out.append("\n### Notes\n" + "\n".join(f"- {n}" for n in d["notes"]))
    out.append("\n---\n\n" + _render_diff(d.get("gate", {})))
    return "\n".join(out)


def _pack(markdown: str, data: dict | None = None) -> str:
    payload = {"ok": True, "markdown": markdown}
    if data:
        payload["data"] = data
    return json.dumps(payload, ensure_ascii=False)


# ── tool handlers ──


def handle_pr_checklist(args: dict, **kwargs) -> str:
    try:
        role = str(args.get("role") or "both")
        d = run("checklist", role=role)
        if not d:
            return json.dumps({"ok": False, "error": "pr-craft core unreachable"})
        return _pack(_render_checklist(d), {"role": role, "items": d.get("items", [])})
    except Exception as err:
        return json.dumps({"ok": False, "error": f"{type(err).__name__}: {err}"})


def handle_pr_lint_description(args: dict, **kwargs) -> str:
    try:
        title = str(args.get("title") or "")
        body = args.get("body")
        text = f"{title}\n\n{body}" if body else title
        d = run("lint_description", text=text)
        if not d:
            return json.dumps({"ok": False, "error": "pr-craft core unreachable"})
        return _pack(_render_desc(d), d)
    except Exception as err:
        return json.dumps({"ok": False, "error": f"{type(err).__name__}: {err}"})


def handle_pr_lint_comment(args: dict, **kwargs) -> str:
    try:
        d = run("lint_comment", text=str(args.get("text") or ""), role=str(args.get("role") or "reviewer"))
        if not d:
            return json.dumps({"ok": False, "error": "pr-craft core unreachable"})
        return _pack(_render_comment(d), d)
    except Exception as err:
        return json.dumps({"ok": False, "error": f"{type(err).__name__}: {err}"})


def handle_pr_lint_diff(args: dict, **kwargs) -> str:
    try:
        d = run("lint_diff", text=str(args.get("diff") or ""))
        if not d:
            return json.dumps({"ok": False, "error": "pr-craft core unreachable"})
        return _pack(_render_diff(d), d)
    except Exception as err:
        return json.dumps({"ok": False, "error": f"{type(err).__name__}: {err}"})


def handle_pr_review_plan(args: dict, **kwargs) -> str:
    try:
        d = run("review_plan", text=str(args.get("diff") or ""))
        if not d:
            return json.dumps({"ok": False, "error": "pr-craft core unreachable"})
        return _pack(_render_plan(d), d)
    except Exception as err:
        return json.dumps({"ok": False, "error": f"{type(err).__name__}: {err}"})


# ── pre_llm_call hook — the injection path ──

_PREFILTER = re.compile(r"\b(pr|pull request|mr|merge request|review|reviewer|diff|patch|lgtm|nit|"
                        r"approve|approval|changes requested|commit message)\b", re.I)


def pre_llm_call(session_id=None, user_message=None, conversation_history=None,
                 is_first_turn=False, model=None, platform=None, **kwargs):
    """Fast-path trigger scan -> inject the distilled checklist for that turn."""
    try:
        text = (user_message or "").strip()
        if len(text) < 6 or not _PREFILTER.search(text):
            return None
        key = str(session_id or "__global__")
        used = _injected.get(key, 0)
        if used >= MAX_INJECT:
            return None
        d = run("context_block", text=text)
        if not d or not d.get("inject"):
            return None
        _injected[key] = used + 1
        if len(_injected) > 200:                                    # cheap GC
            for k in [k for k, v in _injected.items() if v >= MAX_INJECT][:100]:
                _injected.pop(k, None)
        _log(f"inject session={key} role={d.get('role')} n={used + 1}")
        return {"context": d.get("context", "")}
    except Exception as err:
        _log(f"hook-fail err={type(err).__name__}: {err}")
        return None


# ── slash command: /pr-checklist ──


def command_pr(raw: str = "") -> str:
    parts = (raw or "").strip().split(" ", 1)
    action = (parts[0] or "checklist").lower()
    arg = parts[1] if len(parts) > 1 else ""
    try:
        if action == "desc":
            return handle_pr_lint_description({"title": arg})
        if action == "comment":
            return handle_pr_lint_comment({"text": arg})
        if action == "diff":
            return handle_pr_lint_diff({"diff": arg})
        return handle_pr_checklist({"role": arg or "both"})
    except Exception as err:
        return json.dumps({"ok": False, "error": f"{type(err).__name__}: {err}"})
````

## `frontends/kilo/c2g/SKILL.md`

sha256 `045a42f0fe54e2b700038a4f5bbcfcb4abd16452c3965d03d28f1fe1b5a4bc69` · 78 lines

````markdown
---
name: c2g
description: "Straight code2graph (c2g) access for LLM agents — symbol lookup, def sites, callers/callees, blast radius, diff impact, usages, references, imports, module-deps. DB-less: reads the local c2g index, no NodeDB/PG/cortex. Trigger on 'blast radius', 'callers of', 'callees', 'who calls', 'symbol lookup', 'diff impact', 'code2graph', 'c2g'."
---

# c2g — straight code2graph access (dbless)

One stdlib core, two frontends:

| Layer | Path |
|---|---|
| Core (logic) | `~/scripts/c2g_tools.py` |
| Kilo plugin | `~/.kilo/plugins/c2g/server.ts` → tools `c2g_*` |
| Hermes plugin | `~/.hermes/plugins/c2g/` → tools `c2g_*` |
| Binary | `C2G_BIN` or `~/projects/code2graph/target/release/c2g` |

DB-less by construction: it shells out to the c2g binary and reads its index/cache on disk.
No NodeDB, no PG, no Maya cortex. The same questions also answer through
`cortex_codegraph_*` (NodeDB code graph) and `knowledge-graph_*` (PG store) when those are warm;
this skill is the direct path that works with zero stores.

## Tools

| Tool | Question it answers |
|---|---|
| `c2g_status` | Is the local index ready for this root? Known omissions? |
| `c2g_error` | Parse a panic/backtrace/compiler diagnostic into file:line frames and resolve each to its symbol (cache → merged store → binary) |
| `c2g_index` | Build/refresh the index (`--trust-mtime`). Heavy — run when the CPU is free. |
| `c2g_symbols` | List symbols, optional name filter |
| `c2g_def` | Where is this symbol defined (file, line, kind) |
| `c2g_blast_radius` | callers + callees + impact for one symbol, one call |
| `c2g_diff_impact` | Current diff vs base → affected symbols and callers (incremental sync) |
| `c2g_query` | `usages` · `references` · `imports` · `module_deps` |
| `c2g_raw` | Escape hatch: explicit c2g argv |

## Structural sweeps

`ast-grep` (`sg`, installed) covers AST-level pattern search that regex cannot:
`sg -p '$C.consume_rest()' --lang rust <dir>` finds method-call sites; `sg -p '#[allow(dead_code)]'`
finds attribute patterns. Use `tgrep`/`rg` for text, `sg` for shape, `c2g` for relationships. Start from the failure signal when there is one: `c2g_error` turns a stack trace into symbols before any guessing.

## Usage rules

1. **Warm the index once per repo**: `c2g_index` (or `c2g index --trust-mtime --root <repo>`).
   Queries add `--allow-partial` by default so a partial index answers instead of erroring;
   pass `allow_partial=false` to require a complete index.
2. **Blast radius before patching** (stage 2 of the five-stage survey): `c2g_blast_radius` gives
   upstream callers, downstream callees, and impact together. Feed the LLM only the target
   implementation plus 1-hop neighbours — never the whole repo.
3. **After edits** (stage 5 / incremental sync): `c2g_diff_impact origin/main` (or `HEAD~1`)
   maps changed files to affected symbols; re-index only changed files, not the world.
4. **Timeouts**: queries 200 s, index 900 s. A cold or missing index makes `callers`/`impact`
   slow — warm it first, off the critical path.
5. **When the answer must come from the stores instead**: use `cortex_codegraph_*`
   (NodeDB `code_nodes`, currently nodes-only: search works, traversal needs edges) or
   `knowledge-graph_*` (`lsp_references`, `find_path`, `semantic_query`; store must be scanned).

## Examples

```bash
# core CLI (no plugin needed)
python3 ~/scripts/c2g_tools.py describe
printf '{"tool":"blast_radius","name":"coerce_value","root":"$HOME/projects/nodedb"}' \
  | python3 ~/scripts/c2g_tools.py run --stdin
```

Agent calls: `c2g_def(name="extract_vector_floats", root="…")`,
`c2g_blast_radius(name="coerce_value", root="…")`,
`c2g_diff_impact(base="origin/main", root="…")`.

## Pitfalls

- A cold index plus a query command can sit minutes: `c2g_status` first, warm with `c2g_index`.
- `raw` passes argv verbatim; the core appends `--root` and `--json` only when absent.
- The core never builds argv through a shell; arguments are a list, so injection is not a concern.
- Keep the core single: fix `~/scripts/c2g_tools.py`, never the two frontends separately.
- `c2g_error` resolves frames cache-first (per-project cache SQLite → merged `~/Embed/c2g` store) and only then the binary: a cold binary query costs minutes, a cache read milliseconds. Frames under `/rustc/`, `~/.cargo/registry/` and `node_modules` are reported as external, never resolved.
````

## `frontends/kilo/c2g/server.ts`

sha256 `21cd0390bce4fd2f5ee6b4095cf8b9cac365d022ce039ce26051f493086c9bca` · 234 lines

````markdown
import type { Plugin, PluginInput } from "@kilocode/plugin"
import { tool } from "@kilocode/plugin/tool"
import { spawnSync } from "node:child_process"
import { appendFileSync, existsSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

/**
 * c2g — straight code2graph access for Kilo, bypassing Maya cortex.
 *
 * DB-less: shells out to the c2g binary through the shared stdlib core
 * core/c2g_tools.py in this repository — the same core the Hermes plugin uses. No
 * NodeDB, no PG. The same questions can also be asked through
 * cortex_codegraph_* (NodeDB code graph) and knowledge-graph_* (PG store)
 * when those are warm — this plugin is the direct path.
 *
 *   tools: c2g_status, c2g_index, c2g_symbols, c2g_def, c2g_blast_radius,
 *          c2g_diff_impact, c2g_query, c2g_raw
 */

// Core resolution: an explicit override, else this kit's copy, else the usual
// home-directory install. Being repo-relative is what lets a checkout run the
// frontend against core/ without copying anything.
const REPO_CORE = fileURLToPath(new URL("../../core/c2g_tools.py", import.meta.url))
const CORE = process.env.C2G_CORE ?? (existsSync(REPO_CORE) ? REPO_CORE : join(homedir(), "scripts", "c2g_tools.py"))
const LOG = process.env.C2G_LOG ?? join(homedir(), "logs", "c2g.log")
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
  if (!d) return `❌ c2g core unreachable (python3 ${CORE}).`
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
````

## `frontends/kilo/pr-craft/SKILL.md`

sha256 `52a78c21b4475ca2d4c5c54b775a4be50c5c27e372283ab66df16c44949efcaf` · 88 lines

````markdown
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
````

## `frontends/kilo/pr-craft/server.ts`

sha256 `f430a137451640293911f34b39fbca23838f2cef592db541ff7e6c39112c16ea` · 267 lines

````markdown
import type { Plugin, PluginInput } from "@kilocode/plugin"
import { tool } from "@kilocode/plugin/tool"
import { spawnSync } from "node:child_process"
import { appendFileSync, existsSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

/**
 * pr-craft — PR & code-review craft for Kilo.
 *
 * Logic lives once, in Python: core/pr_craft.py (stdlib only, shared with
 * the Hermes plugin ~/.hermes/plugins/pr-craft). Payload goes over stdin as JSON so no
 * shell escaping is involved.
 *
 *   tools     : pr_checklist, pr_lint_description, pr_lint_comment, pr_lint_diff, pr_review_plan
 *   injection : chat.message detects PR/review intent -> the system transform for that turn
 *               injects the distilled checklist (max 2x per session).
 */

const REPO_CORE = fileURLToPath(new URL("../../core/pr_craft.py", import.meta.url))
const CORE = process.env.PR_CRAFT_CORE ?? (existsSync(REPO_CORE) ? REPO_CORE : join(homedir(), "scripts", "pr_craft.py"))
const LOG = process.env.PR_CRAFT_LOG ?? join(homedir(), "logs", "pr-craft.log")
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
  if (!d) return `❌ pr-craft core unreachable (python3 ${CORE}).`
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
````

## `index.js`

sha256 `466a829fdc44a48c6f68fb1499b0a9e260560735dfdf439b312b8ef5234ed7a9` · 1598 lines

````javascript
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
import { C2G_SCHEMA_VERSION, callees as c2gCallees, callers as c2gCallers, dependentFiles, discoverDb, impact as c2gImpact, locateByFrame, locateByName } from './lib/c2g.js'
import { branchName, diffFiles, headSha } from './lib/git.js'
import { resolveRole, roleBudget, roleToolFilter } from './lib/role.js'
import { DEFAULT_INDEX_DIR, definitionPattern, indexFor, indexRoot, indexesSize, legacyIndexDir, pruneIndexes, resolveBin, resolveEngine, searchText } from './lib/search.js'
import { cacheRoot, drop, readCache, sizeOf } from './lib/cache.js'
import { MAX_FRAMES, describeFrames, parseFrames } from './lib/errors.js'
import { lintPrBody, renderPrBody } from './lib/pr.js'
import {
  DEFAULT_EMBED_STORE,
  callers as embedCallers,
  callees as embedCallees,
  dependentFiles as embedDependentFiles,
  displayPath as embedDisplayPath,
  impact as embedImpact,
  isUsable as embedUsable,
  locate as embedLocate,
  openStore as openEmbedStore,
  symbolAtLine as embedSymbolAtLine,
  storeLabel as embedStoreLabel,
} from './lib/embed.js'

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
  prLint: z.boolean().default(true),
  prCore: z.string().default(''),
  pythonBin: z.string().default('python3'),
  requireLog: z.boolean().default(true),
  errorMaxResolve: z.number().min(1).max(40).step(1).default(12),
  embedEnabled: z.boolean().default(true),
  embedStore: z.string().default(''),
  embedRepoMap: z.string().default(''),
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
  'Follow ~/.hermes/skills/devops/nodedb-parity-audit/SKILL.md when it exists; otherwise apply the same seven checks: test inventory parity, caller closure, producer/consumer enumeration, invariant chokepoints, module contracts, repo norms (bash ~/scripts/nodedb-preflight.sh <repo> <base>), PR format.',
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
function c2gInfo(repo, config) {
  if (!config.c2gEnabled) return null
  try {
    const options = { cacheDir: drillCacheDir(config), ttlMs: cacheTtlMs(config) }
    const found = config.c2gCacheDir && config.c2gCacheDir.length > 0
      ? discoverDb(repo, config.c2gCacheDir, config.sqliteBin, options)
      : discoverDb(repo, undefined, config.sqliteBin, options)
    return found === null ? null : { db: found.db, schemaVersion: found.schemaVersion ?? null, completeness: found.completeness ?? null }
  } catch {
    return null
  }
}

/** Just the database path, for call sites that only need the handle. */
function c2gDb(repo, config) {
  return c2gInfo(repo, config)?.db ?? null
}

/**
 * The note every c2g-backed record carries: which database answered, at which
 * cache schema, and whether that snapshot is the complete graph. The
 * per-project cache is the upstream CLI's format (`cli/src/cache/schema.rs`,
 * SCHEMA_VERSION 3), so a bump upstream can break these queries silently —
 * record the version, and say so when it moved. Upstream keys the active slot
 * by `(tier, completeness)`, so a cache that carries only a partial scope
 * snapshot still answers — and under-reports callers, which the reader has to
 * know about.
 */
function c2gNote(info) {
  if (info === null) return ''
  const version = info.schemaVersion
  const partial = info.completeness === 0
  if (version === null) return `c2g cache ${info.db} (schema version unreadable)${partial ? ' — partial snapshot, callers may be under-reported' : ''}`
  if (version !== C2G_SCHEMA_VERSION) {
    return `c2g cache schema v${version}, expected v${C2G_SCHEMA_VERSION} — upstream changed the cache format; verify these queries before trusting the result`
  }
  return `c2g cache schema v${version}${partial ? ' — partial scope snapshot, callers may be under-reported' : ''}`
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
 * Open the merged c2g store (`~/Embed/c2g/graph_index.sqlite`) when enabled.
 *
 * It answers for every worktree of a repository, which covers the case the
 * per-project CLI cache leaves open; it is a snapshot, so its build time is
 * carried into the evidence.
 */
function embedStoreFor(config) {
  if (!config.embedEnabled) return null
  const path = config.embedStore && config.embedStore.length > 0 ? config.embedStore : DEFAULT_EMBED_STORE
  try {
    const store = openEmbedStore(path)
    if (store === null || !embedUsable(store.path, config.sqliteBin)) return null
    return store
  } catch {
    return null
  }
}

/** Shard -> directory overrides parsed from `shard=dir,shard=dir`. */
function embedOverrides(config) {
  const raw = config.embedRepoMap
  if (raw === undefined || raw.length === 0) return {}
  const overrides = {}
  for (const pair of raw.split(',')) {
    const [shard, dir] = pair.split('=')
    if (shard !== undefined && dir !== undefined && shard.trim() !== '' && dir.trim() !== '') overrides[shard.trim()] = dir.trim()
  }
  return overrides
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
      const store = embedStoreFor(config)
      const coverage = c2gReady
        ? 'stage 1–2: c2g cache covers this repo'
        : store !== null
          ? `stage 1–2: no per-worktree c2g cache, merged c2g store available (${embedStoreLabel(store)})${tgrepReady ? '; tgrep index ready' : ''}`
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
      const info = c2gInfo(repo, config)
      const db = info?.db ?? null

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

      // Merged-store fallback: the per-project cache has no entry for this
      // worktree, but the merged c2g store does.
      if (rows.length === 0 && typeof args.symbol === 'string' && args.symbol.length > 0) {
        const store = embedStoreFor(config)
        if (store !== null) {
          const hits = embedLocate(store.path, args.symbol, { worktree: repo, file: args.file, overrides: embedOverrides(config), limit: 10 }, config.sqliteBin)
          if (hits.length > 0) {
            const results = hits.map(h => `${h.name} [${h.kind}] ${embedDisplayPath(h)} (${h.repo}${h.exists ? '' : ', path not in this worktree'})`)
            const files = hits.filter(h => h.exists).map(h => `${h.path}:${h.line}`)
            appendEntry(paths, {
              task,
              kind: 'locate',
              stage: 'localize',
              cmd: `c2g-embed locate name=${args.symbol} store=${store.path}`,
              // Every hit lives in another shard or worktree: the store answered,
              // but this task still has no file to patch, so the record is a note
              // and the localize gate stays open (rule 8).
              ...(files.length > 0
                ? { files, text: results.join('; ').slice(0, 500) }
                : {}),
              note: files.length > 0
                ? `merged c2g store${store.builtAt !== null ? ` built ${store.builtAt}` : ''} (shard-relative paths mapped to this worktree)`
                : `merged c2g store${store.builtAt !== null ? ` built ${store.builtAt}` : ''} knows ${results.length} symbol(s) by that name, but none resolves to a file in this worktree — no localization, the localize gate stays open`,
            })
            const { evaluation } = loadTask(stateRoot, task)
            const summary = summarize(evaluation)
            return { found: true, results, source: `c2g-embed ${embedStoreLabel(store)}`, gates: summary.gates, next: summary.next }
          }
        }
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
          ...(hits.length > 0 ? { files: hits, text: `text-level candidates: ${hits.slice(0, 10).join(', ')}`.slice(0, 500) } : {}),
          note: hits.length > 0
            ? 'text-level (no code2graph answer) — confirm the site before treating it as the definition'
            : `searched ${found.engine}, no definition-shaped line for ${args.symbol} — the localize gate stays open`,
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
        ...(rows.length > 0 ? { note: c2gNote(info) } : {}),
        ...(rows.length > 0 ? { files: rows.map(r => `${r.file}:${r.line}`), text: results.join('; ').slice(0, 500) } : {}),
        ...(rows.length === 0 ? { note: db === null ? 'no c2g cache covers this worktree and no symbol was given — the localize gate stays open' : 'c2g indexed the file but no symbol contains that line' } : {}),
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
      const info = c2gInfo(repo, config)
      const db = info?.db ?? null

      const opts = { file: args.file, limit: 40 }
      let callSites = []
      let transitive = []
      let called = []
      if (db !== null) {
        callSites = c2gCallers(db, args.symbol, opts)
        transitive = c2gImpact(db, args.symbol, { ...opts, depth: args.depth ?? config.c2gDepth, limit: 60 })
        called = c2gCallees(db, args.symbol, opts)
      }

      // Merged-store fallback before falling back to text: it resolves call
      // links across every worktree of the repository.
      if (db === null || callSites.length + transitive.length + called.length === 0) {
        const store = embedStoreFor(config)
        if (store !== null) {
          const options = { worktree: repo, overrides: embedOverrides(config), limit: 40 }
          const embedCalls = embedCallers(store.path, args.symbol, options, config.sqliteBin)
          const embedImpactRows = embedImpact(store.path, args.symbol, { ...options, depth: args.depth ?? config.c2gDepth, limit: 60 }, config.sqliteBin)
          const embedCalled = embedCallees(store.path, args.symbol, options, config.sqliteBin)
          if (embedCalls.length + embedImpactRows.length + embedCalled.length > 0) {
            const callerLines = embedCalls.map(r => `${r.caller} ${embedDisplayPath(r)}`)
            const impactLines = embedImpactRows.map(r => `d${r.depth} ${r.caller} ${embedDisplayPath(r)}`)
            const calleeLines = embedCalled.map(r => `${r.callee} ${embedDisplayPath(r)}`)
            const files = [...new Set([...embedCalls, ...embedImpactRows, ...embedCalled].filter(r => r.exists).map(r => r.path))].filter(Boolean)
            appendEntry(paths, {
              task,
              kind: 'blast',
              stage: 'blast',
              cmd: `c2g-embed blast ${args.symbol} depth=${args.depth ?? config.c2gDepth} store=${store.path}`,
              symbols: [args.symbol],
              files,
              text: `${callerLines.length} resolved call sites, ${impactLines.length} transitive, ${calleeLines.length} callees`.slice(0, 500),
              note: `merged c2g store${store.builtAt !== null ? ` built ${store.builtAt}` : ''} — resolved links, snapshot not per-worktree HEAD`,
            })
            const { evaluation } = loadTask(stateRoot, task)
            const summary = summarize(evaluation)
            return { symbol: args.symbol, callers: callerLines, impact: impactLines, callees: calleeLines, fileCount: files.length, gates: summary.gates, next: summary.next }
          }
        }
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
          ...(sites.length > 0
            ? { symbols: [args.symbol], files, text: `${sites.length} text occurrences in ${files.length} files`.slice(0, 500) }
            : {}),
          note: sites.length > 0
            ? 'text-level: occurrences, not resolved call sites — a caller/callee claim still needs the graph or a read of the code'
            : `searched ${found.engine}, no occurrence of ${args.symbol} — the blast gate stays open`,
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
        note: c2gNote(info),
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
      // The gate a record feeds is chosen by `kind`, not by the stage label the
      // caller may override, so the miss note names the gate that actually
      // stays open.
      const gate = kind === 'locate' ? 'localize' : kind === 'blast' ? 'blast' : 'edge'
      const missed = found.hits.length === 0

      let recorded = ''
      if (kind !== 'none') {
        appendEntry(paths, {
          task,
          kind,
          stage,
          cmd: `${found.engine} ${args.fixed ? '-F ' : ''}${args.word ? '-w ' : ''}'${args.pattern}'${args.glob ? ` --glob '${args.glob}'` : ''} ${repo}`,
          // A search that found nothing is a note, not evidence (rule 8): with
          // no `files` and no `text` the gate it was searching for cannot close
          // on the strength of the miss itself.
          ...(missed ? {} : { files, text: hits.slice(0, 8).join(' | ').slice(0, 500) }),
          note: missed
            ? `searched ${found.engine} (text-level), no hit for ${args.pattern} — the ${gate} gate stays open`
            : 'text-level search evidence',
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
        note: found.error ?? (missed
          ? (kind === 'none' ? 'no hits' : `no hits — recorded as a note only, the ${gate} gate stays open`)
          : ''),
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
    name: 'drill_error',
    description: 'Stage 1 from a failure signal: parse a panic, backtrace, compiler diagnostic or traceback into file:line frames, resolve each frame to its symbol (per-worktree c2g cache, then the merged c2g store), and record the chain as `locate` evidence. Use this before guessing where a bug lives.',
    parameters: {
      error: { type: 'string', required: true, description: 'The raw failure text: panic, backtrace, compiler diagnostics, or a log excerpt.' },
      repo: { type: 'string', description: 'Repository or worktree to resolve against; defaults to the task repository.' },
      task: { type: 'string', description: 'Task id; defaults to the active drill task.' },
      record: { type: 'boolean', description: 'Record the frames as `locate` evidence (default true).' },
      maxResolve: { type: 'integer', description: 'Cap on frames resolved against the graph; defaults to the row configuration.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          message: { type: 'string' },
          frames: { type: 'array', items: { type: 'string' } },
          resolved: { type: 'integer' },
          unresolved: { type: 'integer' },
          external: { type: 'integer' },
          recorded: { type: 'boolean' },
          sources: { type: 'string' },
          gates: { type: 'array', items: { type: 'string' } },
          next: { type: 'string' },
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: [
          value.message === undefined ? 'no message extracted' : `message: ${value.message}`,
          `frames: ${value.frames.length} (${value.resolved} resolved, ${value.unresolved} unresolved, ${value.external} external)`,
          value.frames.slice(0, 15).join('\n'),
          `resolved via: ${value.sources}${value.recorded ? (value.frames.length > 0 && value.external === value.frames.length ? ' · recorded as a note only — no repository frame, the localize gate stays open' : ' · recorded as locate evidence') : ''}`,
          `gates: ${value.gates.join(' ')}`,
          `next: ${value.next}`,
        ].join('\n'),
      }],
    },
    async execute(args, exec) {
      const { cwd, stateRoot } = roots(exec, config)
      const task = resolveTask(args, stateRoot)
      const paths = taskPaths(stateRoot, task)
      const active = readActive(stateRoot) ?? {}
      const repo = args.repo !== undefined ? resolve(cwd, args.repo) : (active.repo !== undefined ? resolve(String(active.repo)) : cwd)
      const db = c2gDb(repo, config)
      const store = embedStoreFor(config)
      const overrides = embedOverrides(config)

      const parsed = parseFrames(args.error)
      const limit = Math.min(args.maxResolve ?? config.errorMaxResolve, MAX_FRAMES)
      let attempts = 0
      const sources = new Set()
      const frames = parsed.frames.map(frame => {
        if (frame.external) return { ...frame, source: 'external', symbol: null }
        if (attempts >= limit) return { ...frame, source: 'not-attempted', symbol: null }
        attempts += 1
        if (db !== null) {
          try {
            const hit = locateByFrame(db, frame.file, frame.line, config.sqliteBin)
            if (hit) {
              sources.add('c2g')
              return { ...frame, source: 'c2g', symbol: hit }
            }
          } catch {
            // A cache that cannot answer this frame simply falls through.
          }
        }
        if (store !== null) {
          try {
            const hit = embedSymbolAtLine(store.path, repo, frame.file, frame.line, { overrides }, config.sqliteBin)
            if (hit) {
              sources.add('c2g-embed')
              return { ...frame, source: 'c2g-embed', symbol: hit }
            }
          } catch {
            // Same: the merged store may not cover this frame.
          }
        }
        return { ...frame, source: null, symbol: null }
      })

      const rendered = frames.map(frame => {
        const where = `${frame.file}:${frame.line}${frame.column === null ? '' : `:${frame.column}`}`
        if (frame.external) return `${where} (external)`
        if (frame.symbol !== null) {
          // When the backtrace names a symbol the graph disagrees with, show both:
          // the graph answer is a position lookup, the hint is what the runtime called.
          const hint = frame.symbolHint !== undefined && !frame.symbolHint.endsWith(`::${frame.symbol.name}`) && frame.symbolHint !== frame.symbol.name
            ? ` (backtrace names ${frame.symbolHint})`
            : ''
          return `${where} → ${frame.symbol.name} [${frame.symbol.kind}] (${frame.source})${hint}`
        }
        return `${where} (unresolved${frame.symbolHint === undefined ? '' : `; backtrace hint ${frame.symbolHint}`})`
      })
      const resolved = frames.filter(f => f.symbol !== null).length
      const external = frames.filter(f => f.external).length
      const located = frames.filter(f => !f.external).map(f => `${f.file}:${f.line}`)
      const recorded = args.record !== false && parsed.frames.length > 0

      if (recorded) {
        appendEntry(paths, {
          task,
          kind: 'locate',
          stage: 'localize',
          cmd: `drill_error frames=${frames.length}`,
          // A signal made only of toolchain and dependency frames says nothing
          // about where in this repository the bug lives (rule 8): it is
          // recorded as a note, with no `files` and no `text`, so it cannot
          // close the localize gate on its own.
          ...(located.length > 0
            ? {
                files: located,
                text: [parsed.message ?? 'no message extracted', ...rendered.slice(0, 8)].join(' | ').slice(0, 500),
              }
            : {}),
          note: located.length > 0
            ? `${describeFrames(frames)}; resolved ${resolved} via ${[...sources].join('+') || 'nothing'}`
            : `${describeFrames(frames)} — no repository frame in this signal; the localize gate stays open`,
        })
      }
      const { evaluation } = loadTask(stateRoot, task)
      const summary = summarize(evaluation)
      return {
        ...(parsed.message === null ? {} : { message: parsed.message }),
        frames: rendered,
        resolved,
        unresolved: frames.filter(f => f.symbol === null && !f.external).length,
        external,
        recorded,
        sources: [...sources].join('+') || (external === frames.length ? 'all frames external' : 'none'),
        gates: summary.gates,
        next: summary.next,
      }
    },
  })

  tool({
    name: 'drill_pr',
    description: 'Stage 7 — render the pull-request body from the ledger (why, changed files, red/green/preflight evidence with exit codes and commits, Review 2 verdict, gate table), write it to a file, score it with the PR-craft core, and record it as `pr` evidence when the lint has no blockers.',
    parameters: {
      title: { type: 'string', required: true, description: 'PR subject line (conventional-commit style reads best).' },
      why: { type: 'string', description: 'One paragraph on why the change exists; defaults to an issue reference sentence.' },
      issue: { type: 'string', description: 'Issue number the PR closes; defaults to the task metadata.' },
      out: { type: 'string', description: 'Output path; defaults to <state>/PR_BODY.md.' },
      task: { type: 'string', description: 'Task id; defaults to the active drill task.' },
      record: { type: 'boolean', description: 'Record the body as `pr` evidence (default true, and only when the lint has no blockers).' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          bodyPath: { type: 'string', required: true },
          title: { type: 'string', required: true },
          lintAvailable: { type: 'boolean' },
          lintOk: { type: 'boolean' },
          lintScore: { type: 'integer' },
          lintVerdict: { type: 'string' },
          blockers: { type: 'array', items: { type: 'string' } },
          good: { type: 'array', items: { type: 'string' } },
          recorded: { type: 'boolean' },
          gates: { type: 'array', items: { type: 'string' } },
          next: { type: 'string' },
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: [
          `PR body: ${value.bodyPath}`,
          value.lintAvailable
            ? `lint: ${value.lintVerdict}${value.lintScore === null ? '' : ` (score ${value.lintScore})`}${value.lintOk ? '' : ''}`
            : 'lint: pr-craft core not available',
          value.blockers.length > 0 ? `blockers:\n- ${value.blockers.join('\n- ')}` : null,
          value.good.length > 0 ? `good: ${value.good.slice(0, 4).join('; ')}` : null,
          value.recorded ? 'recorded as pr evidence' : 'not recorded (fix the blockers first, or pass record=false to see the body only)',
          `gates: ${value.gates.join(' ')}`,
          `next: ${value.next}`,
        ].filter(Boolean).join('\n'),
      }],
    },
    async execute(args, exec) {
      const { cwd, stateRoot } = roots(exec, config)
      const task = resolveTask(args, stateRoot)
      const paths = taskPaths(stateRoot, task)
      const active = readActive(stateRoot) ?? {}
      const entries = readLedger(paths)
      const issue = args.issue ?? (active.issue === null || active.issue === undefined ? undefined : String(active.issue))

      const body = renderPrBody(task, entries, {
        title: args.title,
        ...(args.why !== undefined ? { why: args.why } : {}),
        ...(issue !== undefined ? { issue } : {}),
      })
      const out = args.out !== undefined ? resolve(args.out) : join(paths.dir, 'PR_BODY.md')
      mkdirSync(paths.dir, { recursive: true })
      writeFileSync(out, body, 'utf8')

      const lint = config.prLint
        ? lintPrBody(body, { core: config.prCore && config.prCore.length > 0 ? config.prCore : undefined, pythonBin: config.pythonBin })
        : { available: false, ok: null, score: null, verdict: 'lint disabled', blockers: [], good: [], error: null }
      // `available: true` with an `error` means the lint ran and crashed; that is
      // not a clean body, so the `pr` record must not be written on it.
      const clean = !lint.available || (lint.blockers.length === 0 && (lint.error ?? null) === null)
      const recorded = args.record !== false && clean
      if (recorded) {
        const repoDir = active.repo !== undefined ? resolve(String(active.repo)) : cwd
        const head = headSha(repoDir)
        appendEntry(paths, {
          task,
          kind: 'pr',
          stage: 'pr',
          bodyPath: out,
          text: args.title,
          ...(head !== null ? { head } : {}),
          ...(lint.available ? { note: `lint score ${lint.score ?? '?'} — ${lint.verdict}` } : {}),
        })
      }

      const { evaluation } = loadTask(stateRoot, task)
      const summary = summarize(evaluation)
      return {
        bodyPath: out,
        title: args.title,
        lintAvailable: lint.available,
        lintOk: lint.ok === true,
        ...(lint.score === null ? {} : { lintScore: lint.score }),
        lintVerdict: lint.error === null ? lint.verdict : `${lint.verdict} (${lint.error})`,
        blockers: lint.blockers,
        good: lint.good,
        recorded,
        gates: summary.gates,
        next: summary.next,
      }
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
      head: { type: 'string', description: 'Commit this evidence belongs to. A `review` or `pr` record needs it to close its gate once a green proof names a commit — an unbound record stays open, and there is no auto-fill, so name the commit you actually reviewed.' },
      branch: { type: 'string', description: 'Branch the evidence was produced on.' },
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
          signal: { type: 'string' },
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
          note: run.timedOut ? 'timed out' : (run.signal === null || run.signal === undefined ? undefined : `killed by ${run.signal}`),
        },
        { requireLog: config.requireLog },
      )
      const { evaluation } = loadTask(stateRoot, task)
      const summary = summarize(evaluation)
      return { exit: run.exit, log: run.logPath, timedOut: run.timedOut, ...(run.signal !== null && run.signal !== undefined ? { signal: run.signal } : {}), durationMs: run.durationMs, gates: summary.gates, next: summary.next }
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

      const { changed, deleted, error, fallback, fallbackCmd, fallbackReason } = diffFiles(repo, base)
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
      } else {
        const store = embedStoreFor(config)
        if (store !== null) {
          for (const file of changed.slice(0, 200)) {
            try {
              for (const row of embedDependentFiles(store.path, repo, file, { depth, overrides: embedOverrides(config) }, config.sqliteBin)) {
                if (row.exists && row.path && !changed.includes(row.path)) ripple.add(row.path)
              }
            } catch {
              // A path no shard claims contributes no dependents.
            }
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
          // When the base comparison failed, say what was compared instead of
          // labelling a worktree diff with a base that was never used.
          cmd: fallback === true ? fallbackCmd : `git diff --name-only --diff-filter=ACMR ${base}...HEAD`,
          ...(fallback === true ? {} : { base }),
          files: [...changed, ...ripple],
          text: `${changed.length} changed, ${ripple.size} dependent (depth ${depth})`.slice(0, 500),
          ...(fallback === true ? { note: fallbackReason } : {}),
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
      // `roleBudget` returns 0 for a role that says `maxToolCalls: 0`, and 0 is
      // the documented "no cap" (the counter below only aborts when budget > 0,
      // and the artifact renders 0 as "unlimited"). Only a role with *no*
      // budget falls back to the row default.
      const budget = roleMax !== null ? roleMax : config.maxReviewToolCalls

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
      // `ctx.on` returns a disposer; without keeping it, the listener outlives
      // the review and keeps holding `run`, `controller` and `budget`. Hosts
      // that return nothing are tolerated: `?.()` is a no-op, not a throw in
      // `finally` that would mask the real verdict.
      const disposeSessionListener = ctx.on('session/event', onEvent, { global: true })

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
        disposeSessionListener?.()
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
````

## `install.sh`

sha256 `d4c518a396110649a000f5bca95fac1a6916f0f196f4c9a67148c6c5e3935a0c` · 264 lines

````markdown
#!/usr/bin/env bash
# Install the drill into a DSH profile — no npm registry required.
#
#   ./install.sh --profile web                 # official plugin manager (needs pnpm)
#   ./install.sh --profile web --link          # symlink install, no pnpm, no network
#   ./install.sh --profile web --skills --frontends
#   ./install.sh --profile web --uninstall
#
# Piped form (no checkout needed):
#   curl -fsSL https://raw.githubusercontent.com/EnRaiha/dsh-drill-kit/master/install.sh | bash -s -- --profile web
#
# What it touches: $DSH_HOME/profiles/<profile>/{package.json,node_modules}, and
# with the flags below $DSH_HOME/skills, $DSH_HOME/roles, ~/.kilo/plugins,
# ~/.hermes/plugins. It never edits a profile's cordis.yml and never restarts
# anything — host-side plugin rows are composed at boot, so the last line tells
# you how to restart.
set -euo pipefail

REPO_URL="https://github.com/EnRaiha/dsh-drill-kit.git"
PACKAGE="dsh-drill"
PROFILE="web"
DSH_CLI=""
MODE="auto"          # auto | manager | link
DO_SKILLS=0
DO_FRONTENDS=0
DO_VERIFY=0
DO_UNINSTALL=0
DRY_RUN=0
FORCE=0

die() { printf 'install: %s\n' "$1" >&2; exit 1; }
say() { printf '%s\n' "$1"; }

usage() {
  sed -n '2,16p' "$0" | sed 's/^# \{0,1\}//'
  cat <<'EOF'

Flags:
  --profile <name>   DSH profile to install into (default: web)
  --dsh <path>       DSH checkout or its apps/cli/lib/bin.js (auto-detected otherwise)
  --link             symlink install: no pnpm, no network, edit the profile directly
  --manager          force the official `dsh plugin add` path
  --skills           copy the drill skill + auditor role into $DSH_HOME
  --frontends        symlink the Kilo/Hermes frontends into their plugin dirs
  --verify           wire the host packages and run the test suite
  --uninstall        remove the plugin (and the optional pieces installed above)
  --dry-run          print what would happen, change nothing
  --force            allow --skills/--frontends to replace files that already exist
EOF
  exit 0
}

while [ $# -gt 0 ]; do
  case "$1" in
    --profile) PROFILE="${2:-}"; shift 2 ;;
    --dsh) DSH_CLI="${2:-}"; shift 2 ;;
    --link) MODE="link"; shift ;;
    --manager) MODE="manager"; shift ;;
    --skills) DO_SKILLS=1; shift ;;
    --frontends) DO_FRONTENDS=1; shift ;;
    --verify) DO_VERIFY=1; shift ;;
    --uninstall) DO_UNINSTALL=1; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    --force) FORCE=1; shift ;;
    -h|--help) usage ;;
    *) die "unknown flag $1 (try --help)" ;;
  esac
done
[ -n "$PROFILE" ] || die "--profile needs a name"

DSH_HOME="${DSH_HOME:-$HOME/.dsh}"
PROFILE_DIR="$DSH_HOME/profiles/$PROFILE"

# ---------------------------------------------------------------- where is the repo
# Piped installs have no checkout: clone one into the cache and carry on.
REPO=""
if [ -n "${BASH_SOURCE[0]:-}" ] && [ -f "${BASH_SOURCE[0]}" ]; then
  REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fi
if [ -z "$REPO" ] || [ ! -f "$REPO/index.js" ]; then
  SRC_DIR="${XDG_CACHE_HOME:-$HOME/.cache}/dsh-drill-kit"
  command -v git >/dev/null 2>&1 || die "no checkout next to this script and no git to fetch one"
  if [ -d "$SRC_DIR/.git" ]; then
    run git -C "$SRC_DIR" pull --ff-only
  else
    run git clone --depth 1 "$REPO_URL" "$SRC_DIR"
  fi
  REPO="$SRC_DIR"
fi
[ -f "$REPO/cordis.patch.yml" ] || die "$REPO does not look like the drill kit (no cordis.patch.yml)"

# ------------------------------------------------------------------- where is DSH
resolve_cli() {
  if [ -n "$DSH_CLI" ]; then
    if [ -d "$DSH_CLI" ]; then printf '%s/apps/cli/lib/bin.js' "$DSH_CLI"; else printf '%s' "$DSH_CLI"; fi
    return
  fi
  for candidate in \
    "$(command -v dsh 2>/dev/null || true)" \
    "$HOME/projects/deepseek-harness/apps/cli/lib/bin.js" \
    "$(cd "$REPO/.." 2>/dev/null && pwd)/deepseek-harness/apps/cli/lib/bin.js" \
    "/usr/local/lib/node_modules/@deepseek-ai/dsh/apps/cli/lib/bin.js"
  do
    [ -n "$candidate" ] && [ -f "$candidate" ] && { printf '%s' "$candidate"; return; }
  done
  printf ''
}
CLI="$(resolve_cli)"

run() {
  if [ "$DRY_RUN" = "1" ]; then say "  [dry-run] $*"; else "$@"; fi
}

# pnpm lives in a per-user prefix that a login shell usually has and a service does not
export PATH="$PATH:$HOME/.local/share/pnpm/bin:$HOME/.local/bin"

say "drill kit      : $REPO"
say "profile        : $PROFILE ($PROFILE_DIR)"
say "home           : $HOME$([ "$DRY_RUN" = "1" ] && printf ' (dry run — nothing is written)' || true)"
say "dsh cli        : ${CLI:-<not found>}"
say "mode           : $MODE$([ "$DRY_RUN" = "1" ] && printf ' (dry run)')"
say ""

# --------------------------------------------------------------------- uninstall
if [ "$DO_UNINSTALL" = "1" ]; then
  node -e '
    const fs = require("node:fs"), p = process.argv[1];
    if (!fs.existsSync(p)) process.exit(0);
    const d = JSON.parse(fs.readFileSync(p, "utf8"));
    if (d.dependencies) delete d.dependencies["dsh-drill"];
    if (d.dsh?.profile?.bundles) d.dsh.profile.bundles = d.dsh.profile.bundles.filter(b => b !== "dsh-drill");
    fs.writeFileSync(p, JSON.stringify(d, null, 2) + "\n");
  ' "$PROFILE_DIR/package.json" && say "removed dsh-drill from $PROFILE_DIR/package.json"
  run rm -f "$PROFILE_DIR/node_modules/dsh-drill"
  if [ "$DO_SKILLS" = "1" ]; then
    run rm -rf "$DSH_HOME/skills/drill"
    run rm -f "$DSH_HOME/roles/drill-auditor.md"
  fi
  if [ "$DO_FRONTENDS" = "1" ]; then
    for runtime in kilo hermes; do
      for name in c2g pr-craft; do
        link="$HOME/.$runtime/plugins/$name"
        # only remove what this script created: a symlink into this repo
        if [ -L "$link" ]; then
          case "$(readlink "$link")" in *dsh-drill-kit*|*dsh-drill*) run rm -f "$link" ;; esac
        fi
      done
    done
  fi
  say ""
  if [ -f "$HOME/.config/systemd/user/tkg-web.service" ] && [ "$PROFILE" = "tkg-web" ]; then
    say "restart to unload it:  systemctl --user restart tkg-web.service"
  else
    say "restart your dsh web / headless process for profile '$PROFILE' to unload it"
  fi
  exit 0
fi

# ----------------------------------------------------------------- install plugin
installed=""
if [ "$MODE" != "link" ] && [ -n "$CLI" ]; then
  say "→ official plugin manager"
  if run node "$CLI" plugin --profile "$PROFILE" add "$REPO"; then
    installed="manager"
  else
    say "  the manager path failed (pnpm/network?) — falling back to a link install"
  fi
fi

if [ -z "$installed" ]; then
  [ "$MODE" = "manager" ] && die "the manager path failed and --manager was requested"
  say "→ link install (no pnpm, no network)"
  run mkdir -p "$PROFILE_DIR/node_modules"
  run ln -sfn "$REPO" "$PROFILE_DIR/node_modules/$PACKAGE"
  if [ "$DRY_RUN" = "1" ]; then
    say "  [dry-run] patch $PROFILE_DIR/package.json (dependency + bundle row)"
  else
    mkdir -p "$PROFILE_DIR"
    [ -f "$PROFILE_DIR/package.json" ] || printf '{\n  "name": "dsh-profile-%s",\n  "private": true\n}\n' "$PROFILE" > "$PROFILE_DIR/package.json"
    cp "$PROFILE_DIR/package.json" "$PROFILE_DIR/package.json.bak-drill"
    node -e '
      const fs = require("node:fs"), p = process.argv[1], repo = process.argv[2];
      const d = JSON.parse(fs.readFileSync(p, "utf8"));
      d.dependencies = d.dependencies || {};
      d.dependencies["dsh-drill"] = "link:" + repo;
      d.dsh = d.dsh || {}; d.dsh.profile = d.dsh.profile || {}; d.dsh.profile.bundles = d.dsh.profile.bundles || [];
      if (!d.dsh.profile.bundles.includes("dsh-drill")) d.dsh.profile.bundles.push("dsh-drill");
      fs.writeFileSync(p, JSON.stringify(d, null, 2) + "\n");
    ' "$PROFILE_DIR/package.json" "$REPO"
    say "  patched $PROFILE_DIR/package.json (backup: package.json.bak-drill)"
  fi
  installed="link"
fi
say "installed via $installed"
say ""

# ------------------------------------------------------------------ skill + role
install_file() {
  # $1 source, $2 destination: back up a differing file instead of clobbering it
  src="$1"; dst="$2"
  run mkdir -p "$(dirname "$dst")"
  if [ -e "$dst" ] && ! cmp -s "$src" "$dst"; then
    if [ "$FORCE" != "1" ]; then
      run cp -f "$dst" "$dst.bak-drill"
      say "  kept a copy of the existing $(basename "$dst") as $(basename "$dst").bak-drill"
    fi
  fi
  run cp -f "$src" "$dst"
}

if [ "$DO_SKILLS" = "1" ]; then
  say "→ skill + auditor role"
  install_file "$REPO/skills/drill/SKILL.md" "$DSH_HOME/skills/drill/SKILL.md"
  install_file "$REPO/roles/drill-auditor.md" "$DSH_HOME/roles/drill-auditor.md"
  say "  $DSH_HOME/skills/drill/SKILL.md, $DSH_HOME/roles/drill-auditor.md"
fi

# -------------------------------------------------------------------- frontends
if [ "$DO_FRONTENDS" = "1" ]; then
  say "→ Kilo / Hermes frontends"
  for runtime in kilo hermes; do
    parent="$HOME/.$runtime/plugins"
    [ -d "$parent" ] || { say "  skipped $parent (not installed)"; continue; }
    for name in c2g pr-craft; do
      [ -d "$REPO/frontends/$runtime/$name" ] || continue
      target="$parent/$name"
      if [ -e "$target" ] && [ ! -L "$target" ]; then
        if [ "$FORCE" != "1" ]; then
          say "  left $target alone (a real directory is already there — pass --force to replace it)"
          continue
        fi
        run mv "$target" "$target.bak-drill"
        say "  moved the existing $name to $name.bak-drill"
      fi
      run ln -sfn "$REPO/frontends/$runtime/$name" "$target"
      say "  $target → $REPO/frontends/$runtime/$name"
    done
  done
fi

# ----------------------------------------------------------------------- verify
if [ "$DO_VERIFY" = "1" ]; then
  say "→ verify (host packages + test suite)"
  mkdir -p "$REPO/node_modules/@deepseek-ai"
  for spec in llm/llm subagent/subagent core/tools; do
    target="$(dirname "${CLI:-/nonexistent}")/../../../packages/$spec"
    [ -d "$target" ] && ln -sfn "$target" "$REPO/node_modules/@deepseek-ai/dsh-$(basename "$spec")"
  done
  [ -n "$CLI" ] && [ -d "$(dirname "$CLI")/../../../vendor/schemastery" ] && \
    ln -sfn "$(dirname "$CLI")/../../../vendor/schemastery" "$REPO/node_modules/@deepseek-ai/schemastery"
  run node --test "$REPO"/test/*.test.js
fi

say ""
say "done. The plugin row is composed at boot, so restart the runtime that serves the profile:"
if [ -f "$HOME/.config/systemd/user/tkg-web.service" ] && [ "$PROFILE" = "tkg-web" ]; then
  say "  systemctl --user restart tkg-web.service"
  say "  (from inside a DSH session use: systemd-run --user --unit=dsh-restart-\$(date +%s) --collect systemctl --user restart tkg-web.service)"
else
  say "  restart your dsh web / headless process for profile '$PROFILE'"
fi
say ""
say "then check it loaded:  drill_gate  (16 tools should be registered, including drill_start)"
````

## `lib/c2g.js`

sha256 `e3e32966ff0fc0f259f3243e99721dc8938ac9ab58dd4239f9d98720b4c797c6` · 350 lines

````javascript
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

import { DEFAULT_TTL_MS, cacheRoot, drop, readCache, touch, writeCache } from './cache.js'

/**
 * Read-only access to the local code2graph (c2g) cache, used for drill stages 1–2:
 * localization (stack frame → exact symbol) and blast radius (callers/callees/impact).
 *
 * The cache lives at `<cacheDir>/<project-key>/cache.sqlite3`; the key is NOT a
 * hash of the repository path, so the database is discovered by matching
 * `meta.canonical_root` instead of being computed.
 */

/** c2g cache layout this module understands. */
export const C2G_SCHEMA_VERSION = 3

/** Name of the discovery cache file under the drill cache root. */
export const DISCOVERY_CACHE_FILE = 'c2g-discovery.json'

/**
 * Read the cached discovery map. The map records which database answered for a
 * repository path, so a call does not re-probe every c2g project directory with
 * a sqlite3 process. Entries carry their own timestamp and expire with the TTL.
 */
function readDiscovery(cacheDir, ttlMs) {
  const data = readCache(join(cacheDir, DISCOVERY_CACHE_FILE), ttlMs)
  if (data === null || typeof data !== 'object' || data === undefined) return { entries: {}, path: join(cacheDir, DISCOVERY_CACHE_FILE) }
  const entries = data.entries !== undefined && typeof data.entries === 'object' ? data.entries : {}
  // Drop expired entries while loading, so the file shrinks on the next write.
  const now = Date.now()
  for (const [key, value] of Object.entries(entries)) {
    const savedAt = Number(value?.savedAt ?? 0)
    const id = value?.snapshotId
    if (ttlMs > 0 && now - savedAt > ttlMs) delete entries[key]
    else if (value?.db === undefined || !existsSync(value.db)) delete entries[key]
    // An entry recorded before the coverage rule required an active scope
    // snapshot must not be served: it would send callers at a database that
    // resolves nothing.
    else if (id === null || id === undefined) delete entries[key]
  }
  return { entries, path: join(cacheDir, DISCOVERY_CACHE_FILE) }
}

/** Persist the discovery map, stamping every entry it keeps. */
function writeDiscovery(cache, cacheDir) {
  const stamped = {}
  for (const [key, value] of Object.entries(cache.entries)) stamped[key] = { ...value, savedAt: value.savedAt ?? Date.now() }
  writeCache(join(cacheDir, DISCOVERY_CACHE_FILE), { version: 1, entries: stamped })
}

/**
 * Forget one repository's cached discovery result (used when a cached database
 * has disappeared or a caller asks for a refresh).
 *
 * @param root Repository path.
 * @param cacheDir Drill cache root.
 * @param ttlMs Time to live in milliseconds.
 * @returns True when an entry was dropped.
 */
export function forgetDiscovery(root, cacheDir = cacheRoot(), ttlMs = DEFAULT_TTL_MS) {
  const cache = readDiscovery(cacheDir, ttlMs)
  const key = resolve(root)
  if (cache.entries[key] === undefined) return false
  delete cache.entries[key]
  writeDiscovery(cache, cacheDir)
  return true
}

/**
 * Prune the whole discovery cache.
 *
 * @param cacheDir Drill cache root.
 * @returns True when the file was removed.
 */
export function clearDiscovery(cacheDir = cacheRoot()) {
  return drop(join(cacheDir, DISCOVERY_CACHE_FILE))
}

/** Quote a value for a SQL literal, doubling embedded quotes. */
export function sqlStr(value) {
  return `'${String(value).replaceAll("'", "''")}'`
}

/**
 * Locate the c2g cache database whose `meta.canonical_root` matches a repository.
 *
 * @param root Repository path (resolved through symlinks before matching).
 * @param cacheDir c2g cache directory; defaults to `~/.cache/code2graph/projects`.
 * @param sqliteBin sqlite3 executable used for the probe query.
 * @returns `{ db, schemaVersion, snapshotId }`, or null when no cache matches.
 */
export function discoverDb(root, cacheDir = join(homedir(), '.cache', 'code2graph', 'projects'), sqliteBin = 'sqlite3', options = {}) {
  const wanted = resolve(root)
  const drillCacheDir = options.cacheDir ?? cacheRoot()
  const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS

  if (options.refresh !== true) {
    const discovery = readDiscovery(drillCacheDir, ttlMs)
    const cached = discovery.entries[wanted]
    if (cached?.db !== undefined && existsSync(cached.db)) {
      // The cache version is re-read on a hit: the upstream CLI stamps
      // PRAGMA user_version, and a bump there changes what our queries mean.
      // One cheap query keeps a stale cached version from hiding that for a week.
      let schemaVersion = cached.schemaVersion ?? null
      let completeness = cached.completeness ?? null
      try {
        schemaVersion = query(cached.db, 'PRAGMA user_version', sqliteBin)[0]?.user_version ?? schemaVersion
        completeness = query(cached.db, "SELECT completeness FROM active_snapshots WHERE resolver_tier='scope' ORDER BY completeness DESC LIMIT 1", sqliteBin)[0]?.completeness ?? completeness
      } catch {
        schemaVersion = cached.schemaVersion ?? null
        completeness = cached.completeness ?? null
      }
      if (schemaVersion !== cached.schemaVersion || completeness !== cached.completeness) {
        discovery.entries[wanted] = { ...cached, schemaVersion, completeness, savedAt: Date.now() }
        writeDiscovery(discovery, drillCacheDir)
      } else {
        touch(join(drillCacheDir, DISCOVERY_CACHE_FILE))
      }
      return { db: cached.db, schemaVersion, snapshotId: cached.snapshotId ?? null, completeness, cached: true }
    }
  }

  if (!existsSync(cacheDir)) return null
  let best = null
  for (const entry of readdirSync(cacheDir)) {
    const db = join(cacheDir, entry, 'cache.sqlite3')
    if (!existsSync(db)) continue
    let meta
    try {
      meta = query(db, 'SELECT CAST(canonical_root AS TEXT) root, CAST(application_identity AS TEXT) identity FROM meta LIMIT 1', sqliteBin)
    } catch {
      continue
    }
    const row = meta[0]
    if (!row?.root) continue
    if (row.identity !== undefined && row.identity !== 'code2graph-cache') continue
    const canonical = resolve(String(row.root))
    const matches = canonical === wanted || wanted.startsWith(`${canonical}/`)
    if (!matches) continue

    let snapshotId = null
    let completeness = null
    try {
      // Same ordered pick as SCOPE, so the snapshot this probe reports as
      // "can answer" is the one the queries will actually read.
      const snap = query(db, "SELECT snapshot_id, completeness FROM active_snapshots WHERE resolver_tier='scope' ORDER BY completeness DESC LIMIT 1", sqliteBin)
      snapshotId = snap[0]?.snapshot_id ?? null
      completeness = snap[0]?.completeness ?? null
    } catch {
      snapshotId = null
      completeness = null
    }
    // Coverage has to mean "can answer": every query this module runs resolves
    // through the active scope snapshot, so a cache without one is not a
    // candidate — a container directory indexed once (for example a cache
    // rooted at the home directory, or a /tmp fixture) would otherwise claim
    // every repository beneath it while returning nothing.
    if (snapshotId === null) continue
    // A cache indexed at a parent directory also covers its subdirectories, so
    // several caches can match one path; the most specific root wins.
    const score = [canonical.length]
    if (best === null || score[0] > best.score[0]) {
      let userVersion = null
      try {
        userVersion = query(db, 'PRAGMA user_version', sqliteBin)[0]?.user_version ?? null
      } catch {
        userVersion = null
      }
      best = { db, schemaVersion: userVersion, snapshotId, completeness, score }
    }
  }
  const discovery = readDiscovery(drillCacheDir, ttlMs)
  if (best === null) {
    delete discovery.entries[wanted]
    writeDiscovery(discovery, drillCacheDir)
    return null
  }
  discovery.entries[wanted] = { db: best.db, schemaVersion: best.schemaVersion, snapshotId: best.snapshotId, completeness: best.completeness, savedAt: Date.now() }
  writeDiscovery(discovery, drillCacheDir)
  return { db: best.db, schemaVersion: best.schemaVersion, snapshotId: best.snapshotId, completeness: best.completeness, cached: false }
}

/**
 * Run one read-only query and parse sqlite3's JSON output.
 *
 * @param db Database path.
 * @param sql SQL text; the caller owns escaping of any interpolated values.
 * @param sqliteBin sqlite3 executable.
 * @param timeoutMs Query timeout.
 * @returns Parsed rows; an empty array when the query returns nothing.
 */
export function query(db, sql, sqliteBin = 'sqlite3', timeoutMs = 30_000) {
  const out = execFileSync(sqliteBin, ['-readonly', '-json', db, sql], { encoding: 'utf8', timeout: timeoutMs, maxBuffer: 32 * 1024 * 1024 })
  const trimmed = out.trim()
  if (trimmed === '') return []
  return JSON.parse(trimmed)
}

const SYMBOL_COLUMNS = "name, replace(kind,'\"','') AS kind, file, json_extract(symbol,'$.line') AS line"

/**
 * The scope tier's snapshot id, as a subquery fragment.
 *
 * Upstream keys `active_snapshots` by `(resolver_tier, completeness)` with
 * `completeness IN (0,1)` (`cli/src/cache/schema.rs`), so one tier can hold a
 * partial snapshot and a complete one at the same time. Without `LIMIT 1` the
 * scalar subquery is ambiguous — SQLite takes an arbitrary row, and two queries
 * in the same tool call could resolve different snapshots and join symbols from
 * one to edges of the other. `ORDER BY completeness DESC` picks the complete
 * graph and falls back to a partial one only when that is all the cache has;
 * every query in this module uses this fragment, so they all agree.
 */
const SCOPE = "(SELECT snapshot_id FROM active_snapshots WHERE resolver_tier='scope' ORDER BY completeness DESC LIMIT 1)"

/**
 * Stage 1a — resolve a symbol name to its definition site(s).
 *
 * @param db Database path.
 * @param symbol Symbol name.
 * @param options `file` narrows to one file (names repeat across crates), `limit` caps rows.
 * @param sqliteBin sqlite3 executable.
 * @returns Definition rows `{name, kind, file, line}`.
 */
export function locateByName(db, symbol, options = {}, sqliteBin = 'sqlite3') {
  const limit = options.limit ?? 10
  const fileClause = options.file ? ` AND file = ${sqlStr(options.file)}` : ''
  return query(db, `SELECT ${SYMBOL_COLUMNS} FROM graph_symbols WHERE snapshot_id=${SCOPE} AND name=${sqlStr(symbol)}${fileClause} ORDER BY file, line LIMIT ${Number(limit)}`, sqliteBin)
}

/**
 * Stage 1b — resolve a stack frame to the symbol that contains it.
 *
 * A file:line is authoritative where a bare name is ambiguous, so this picks the
 * nearest definition at or above the reported line.
 *
 * @param db Database path.
 * @param file Repository-relative file path.
 * @param line 1-based line number from the stack trace.
 * @param sqliteBin sqlite3 executable.
 * @returns The containing symbol row, or undefined.
 */
export function locateByFrame(db, file, line, sqliteBin = 'sqlite3') {
  const rows = query(db, `SELECT ${SYMBOL_COLUMNS} FROM graph_symbols WHERE snapshot_id=${SCOPE} AND file=${sqlStr(file)} AND json_extract(symbol,'$.line') <= ${Number(line)} ORDER BY json_extract(symbol,'$.line') DESC LIMIT 1`, sqliteBin)
  return rows[0]
}

/**
 * Stage 2 — call sites of a symbol.
 *
 * @param db Database path.
 * @param symbol Symbol name; the first definition row is used as the target.
 * @param options `file` disambiguates duplicate names, `limit` caps rows.
 * @param sqliteBin sqlite3 executable.
 * @returns Rows `{caller, caller_file, occurrence_file, occurrence_line}`.
 */
export function callers(db, symbol, options = {}, sqliteBin = 'sqlite3') {
  const target = targetOrdinal(db, symbol, options.file, sqliteBin)
  if (target === null) return []
  return query(db, `SELECT c.name AS caller, c.file AS caller_file, e.occurrence_file, e.occurrence_line FROM graph_edges e JOIN graph_symbols c ON c.snapshot_id=e.snapshot_id AND c.ordinal=e.from_ord WHERE e.snapshot_id=${SCOPE} AND e.role='"Call"' AND e.to_ord=${target} ORDER BY c.file, e.occurrence_line LIMIT ${Number(options.limit ?? 40)}`, sqliteBin)
}

/**
 * Stage 2 — symbols this symbol calls.
 *
 * @param db Database path.
 * @param symbol Symbol name.
 * @param options `file` disambiguates duplicate names, `limit` caps rows.
 * @param sqliteBin sqlite3 executable.
 * @returns Rows `{callee, callee_file, occurrence_file, occurrence_line}`.
 */
export function callees(db, symbol, options = {}, sqliteBin = 'sqlite3') {
  const target = targetOrdinal(db, symbol, options.file, sqliteBin)
  if (target === null) return []
  return query(db, `SELECT t.name AS callee, t.file AS callee_file, e.occurrence_file, e.occurrence_line FROM graph_edges e JOIN graph_symbols t ON t.snapshot_id=e.snapshot_id AND t.ordinal=e.to_ord WHERE e.snapshot_id=${SCOPE} AND e.role='"Call"' AND e.from_ord=${target} ORDER BY t.file, e.occurrence_line LIMIT ${Number(options.limit ?? 40)}`, sqliteBin)
}

/**
 * Stage 2 — transitive callers up to a depth, via a recursive CTE over call edges.
 *
 * @param db Database path.
 * @param symbol Symbol name.
 * @param options `file` disambiguates duplicate names, `depth` bounds the walk, `limit` caps rows.
 * @param sqliteBin sqlite3 executable.
 * @returns Rows `{depth, caller, caller_file, occurrence_line}` ordered by distance.
 */
export function impact(db, symbol, options = {}, sqliteBin = 'sqlite3') {
  const target = targetOrdinal(db, symbol, options.file, sqliteBin)
  if (target === null) return []
  const depth = Math.max(1, Number(options.depth ?? 3))
  return query(db, `WITH RECURSIVE up(ordinal, depth) AS (SELECT ${target}, 0 UNION SELECT e.from_ord, up.depth + 1 FROM graph_edges e JOIN up ON e.to_ord = up.ordinal WHERE e.snapshot_id=${SCOPE} AND e.role='"Call"' AND up.depth < ${depth}) SELECT DISTINCT up.depth, s.name AS caller, s.file AS caller_file, json_extract(s.symbol,'$.line') AS line FROM up JOIN graph_symbols s ON s.snapshot_id=${SCOPE} AND s.ordinal=up.ordinal WHERE up.depth > 0 ORDER BY up.depth, s.file LIMIT ${Number(options.limit ?? 60)}`, sqliteBin)
}

/**
 * Symbols defined in one file.
 *
 * @param db Database path.
 * @param file Repository-relative file path.
 * @param options `limit` caps rows.
 * @param sqliteBin sqlite3 executable.
 * @returns Definition rows `{name, kind, file, line}`.
 */
export function symbolsInFile(db, file, options = {}, sqliteBin = 'sqlite3') {
  return query(db, `SELECT ${SYMBOL_COLUMNS} FROM graph_symbols WHERE snapshot_id=${SCOPE} AND file=${sqlStr(file)} ORDER BY json_extract(symbol,'$.line') LIMIT ${Number(options.limit ?? 200)}`, sqliteBin)
}

/**
 * Files that depend on the symbols defined in one file, walked backwards over
 * call/read/type-reference edges.
 *
 * This is a graph-level ripple estimate for a changed file, not a test plan: it
 * answers "what else can see this", not "what must be retested".
 *
 * @param db Database path.
 * @param file Repository-relative file path.
 * @param options `depth` bounds the walk, `limit` caps rows.
 * @param sqliteBin sqlite3 executable.
 * @returns Rows `{file, depth}` ordered by distance from the changed file.
 */
export function dependentFiles(db, file, options = {}, sqliteBin = 'sqlite3') {
  const depth = Math.max(1, Number(options.depth ?? 2))
  return query(db, `WITH RECURSIVE up(ordinal, depth) AS (
      SELECT ordinal, 0 FROM graph_symbols WHERE snapshot_id=${SCOPE} AND file=${sqlStr(file)}
      UNION
      SELECT e.from_ord, up.depth + 1 FROM graph_edges e JOIN up ON e.to_ord = up.ordinal
      WHERE e.snapshot_id=${SCOPE} AND e.role IN ('"Call"','"Read"','"TypeRef"') AND up.depth < ${depth}
    )
    SELECT s.file AS file, MIN(up.depth) AS depth
    FROM up JOIN graph_symbols s ON s.snapshot_id=${SCOPE} AND s.ordinal=up.ordinal
    WHERE up.depth > 0 AND s.file <> ${sqlStr(file)}
    GROUP BY s.file ORDER BY depth, s.file LIMIT ${Number(options.limit ?? 80)}`, sqliteBin)
}

/**
 * The graph ordinal of a symbol's definition, preferring an exact file match.
 *
 * @param db Database path.
 * @param symbol Symbol name.
 * @param file Optional file that disambiguates duplicate names across crates.
 * @param sqliteBin sqlite3 executable.
 * @returns The ordinal, or null when the symbol is absent.
 */
export function targetOrdinal(db, symbol, file, sqliteBin = 'sqlite3') {
  const fileClause = file ? ` AND file = ${sqlStr(file)}` : ''
  const rows = query(db, `SELECT ordinal FROM graph_symbols WHERE snapshot_id=${SCOPE} AND name=${sqlStr(symbol)}${fileClause} ORDER BY CASE WHEN replace(kind,'"','')='Function' THEN 0 ELSE 1 END, file LIMIT 1`, sqliteBin)
  return rows[0]?.ordinal ?? null
}
````

## `lib/cache.js`

sha256 `20d40379c8ebd093a9063e5ddf8020577af5f226e6fa63a74666b87d7ad3abc4` · 158 lines

````javascript
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

/**
 * Cache layer for the drill plugin.
 *
 * Everything the plugin can rebuild lives under one cache root — never `/tmp`,
 * which the host may wipe between sessions — and carries a time to live: an
 * entry that has not been used for a week is removed the next time the cache is
 * touched. Discovery results and search indexes are derived data, so expiring
 * them costs a rebuild, never evidence.
 */

/** Default cache root: `$XDG_CACHE_HOME/dsh-drill`, else `~/.cache/dsh-drill`. */
export const DEFAULT_CACHE_ROOT = join(process.env.XDG_CACHE_HOME ?? join(homedir(), '.cache'), 'dsh-drill')

/** Default time to live for cached derived data: one week. */
export const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000

/**
 * The cache root in use for one call.
 *
 * @param configured Value from the row config; an empty string means the default.
 * @returns Absolute cache root path.
 */
export function cacheRoot(configured) {
  return configured !== undefined && configured !== null && configured.length > 0 ? configured : DEFAULT_CACHE_ROOT
}

/** Ensure a directory exists. */
export function ensureDir(dir) {
  mkdirSync(dir, { recursive: true })
  return dir
}

/**
 * Read a JSON cache file, honouring its time to live.
 *
 * @param path Cache file.
 * @param ttlMs Maximum age in milliseconds; an older file reads as absent.
 * @returns Parsed value, or null when missing, expired or unreadable.
 */
export function readCache(path, ttlMs = DEFAULT_TTL_MS) {
  if (!existsSync(path)) return null
  try {
    const stat = statSync(path)
    if (ttlMs > 0 && Date.now() - stat.mtimeMs > ttlMs) return null
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return null
  }
}

/**
 * Write a JSON cache file atomically and mark it as just used.
 *
 * @param path Cache file.
 * @param value JSON-serializable value.
 * @returns The path written.
 */
export function writeCache(path, value) {
  ensureDir(dirname(path))
  const tmp = `${path}.tmp-${process.pid}`
  writeFileSync(tmp, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
  renameSync(tmp, path)
  touch(path)
  return path
}

/**
 * Mark a cache entry as used, so the TTL measures idleness rather than age.
 *
 * @param path File or directory to touch.
 */
export function touch(path) {
  try {
    const now = new Date()
    utimesSync(path, now, now)
  } catch {
    // A missing entry needs no touch; the caller rebuilds it.
  }
}

/**
 * Remove cache entries that have not been used within the time to live.
 *
 * @param dir Directory holding one entry per child.
 * @param options `ttlMs` idle limit, `keep` names never removed, `now` clock override for tests.
 * @returns `{ removed, kept, freedBytes }`.
 */
export function pruneDir(dir, options = {}) {
  const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS
  const keep = new Set(options.keep ?? [])
  const now = options.now ?? Date.now()
  if (!existsSync(dir)) return { removed: [], kept: [], freedBytes: 0 }

  const removed = []
  const kept = []
  let freedBytes = 0
  for (const entry of readdirSync(dir)) {
    if (keep.has(entry)) {
      kept.push(entry)
      continue
    }
    const path = join(dir, entry)
    let stat
    try {
      stat = statSync(path)
    } catch {
      continue
    }
    if (ttlMs > 0 && now - stat.mtimeMs > ttlMs) {
      freedBytes += sizeOf(path)
      try {
        rmSync(path, { recursive: true, force: true })
        removed.push(entry)
      } catch {
        // A concurrent removal already did the work.
      }
    } else {
      kept.push(entry)
    }
  }
  return { removed, kept, freedBytes }
}

/**
 * Recursive size of a file or directory.
 *
 * @param path Entry to measure.
 * @returns Size in bytes; unreadable entries count as zero.
 */
export function sizeOf(path) {
  let total = 0
  let stat
  try {
    stat = statSync(path)
  } catch {
    return 0
  }
  if (!stat.isDirectory()) return stat.size
  for (const entry of readdirSync(path)) total += sizeOf(join(path, entry))
  return total
}

/**
 * Remove a cache entry outright.
 *
 * @param path Entry to remove.
 * @returns True when something was removed.
 */
export function drop(path) {
  if (!existsSync(path)) return false
  rmSync(path, { recursive: true, force: true })
  return true
}
````

## `lib/embed.js`

sha256 `e668f9982e542349927cc6c1196709a6b7da9cc4878354b636efdd6674a334c4` · 291 lines

````javascript
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

import { sqlStr } from './c2g.js'

/**
 * The merged c2g graph store under `~/Embed/c2g`.
 *
 * It is a different artifact from the per-project CLI cache: one SQLite file
 * holding `nodes(id, name, kind, file, repo, line)` and `links(source, target,
 * relation)`, merged from per-crate shards and rebuilt on import. Because it is
 * merged, one store answers for every worktree of the same repository — which is
 * exactly the gap the per-project cache leaves when it has no entry for a
 * worktree.
 *
 * Paths inside the store are shard-relative (`nd_src/control/sequence/registry.rs`)
 * rather than worktree-relative, so this module maps between the two and only
 * claims a mapping it can confirm on disk.
 */

/** Default store path. */
export const DEFAULT_EMBED_STORE = join(homedir(), 'Embed', 'c2g', 'graph_index.sqlite')

/** Shard label -> worktree-relative directory, verified against NodeDB worktrees. */
export const SHARD_PREFIXES = {
  nd_src: 'nodedb/src',
  nd_tests: 'nodedb/tests',
  nd_sql: 'nodedb-sql',
  nd_cluster: 'nodedb-cluster',
  nd_types: 'nodedb-types',
  nd_vector: 'nodedb-vector',
}

/** The shard holding everything not claimed by a specific one; its paths are already worktree-relative. */
export const REST_SHARD = 'nd_rest'

/**
 * Open the merged store when it exists and looks usable.
 *
 * @param path Store path.
 * @returns `{path, builtAt, count, manifest}` or null.
 */
export function openStore(path = DEFAULT_EMBED_STORE) {
  if (!existsSync(path) || !statSync(path).isFile()) return null
  let manifest = null
  const manifestPath = join(path, '..', 'manifest.json')
  try {
    if (existsSync(manifestPath)) manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  } catch {
    manifest = null
  }
  return {
    path,
    builtAt: typeof manifest?.built_at === 'string' ? manifest.built_at : null,
    count: Number.isInteger(manifest?.count) ? manifest.count : null,
    manifest,
  }
}

/**
 * Run one read-only query against the store.
 *
 * @param path Store path.
 * @param sql SQL text.
 * @param sqliteBin sqlite3 executable.
 * @param timeoutMs Query timeout.
 * @returns Parsed rows.
 */
export function query(path, sql, sqliteBin = 'sqlite3', timeoutMs = 30_000) {
  const out = execFileSync(sqliteBin, ['-readonly', '-json', path, sql], { encoding: 'utf8', timeout: timeoutMs, maxBuffer: 32 * 1024 * 1024 })
  const trimmed = out.trim()
  return trimmed === '' ? [] : JSON.parse(trimmed)
}

/**
 * Map a stored shard file to a worktree-relative path.
 *
 * @param worktree Worktree root.
 * @param storedFile `file` column value.
 * @param repo `repo` column value (shard label).
 * @param overrides Optional shard -> directory overrides from configuration.
 * @returns `{path, exists}`; `path` is the best candidate even when it does not exist.
 */
export function toWorktreePath(worktree, storedFile, repo, overrides = {}) {
  const prefixes = { ...SHARD_PREFIXES, ...overrides }
  if (repo === REST_SHARD) return { path: storedFile, exists: existsSync(join(worktree, storedFile)) }
  const prefix = prefixes[repo]
  if (prefix === undefined) return { path: storedFile, exists: existsSync(join(worktree, storedFile)) }
  const rest = storedFile.startsWith(`${repo}/`) ? storedFile.slice(repo.length + 1) : storedFile
  const candidate = `${prefix}/${rest}`
  return { path: candidate, exists: existsSync(join(worktree, candidate)) }
}

/**
 * Map a worktree-relative path to its stored shard file name.
 *
 * @param worktreeRelative Path relative to the worktree root.
 * @param overrides Optional shard -> directory overrides from configuration.
 * @returns The stored file name, or null when no shard claims the path.
 */
export function toStoredPath(worktreeRelative, overrides = {}) {
  const prefixes = { ...SHARD_PREFIXES, ...overrides }
  for (const [shard, prefix] of Object.entries(prefixes)) {
    if (worktreeRelative === prefix) return shard
    if (worktreeRelative.startsWith(`${prefix}/`)) return `${shard}/${worktreeRelative.slice(prefix.length + 1)}`
  }
  return `${REST_SHARD}/${worktreeRelative}`
}

const NODE_COLUMNS = 'id, name, kind, file, repo, line'

/**
 * Resolve symbol definitions in the merged store.
 *
 * @param path Store path.
 * @param name Symbol name.
 * @param options `worktree` for path mapping, `file` to narrow, `limit`.
 * @param sqliteBin sqlite3 executable.
 * @returns Rows `{name, kind, file, repo, line, path, exists}`.
 */
export function locate(path, name, options = {}, sqliteBin = 'sqlite3') {
  const limit = options.limit ?? 10
  const fileClause = options.file ? ` AND file LIKE ${sqlStr(`%${options.file}%`)}` : ''
  const rows = query(path, `SELECT ${NODE_COLUMNS} FROM nodes WHERE name = ${sqlStr(name)}${fileClause} ORDER BY repo, file, line LIMIT ${Number(limit)}`, sqliteBin)
  return rows.map(row => {
    const mapped = options.worktree === undefined ? { path: row.file, exists: false } : toWorktreePath(options.worktree, row.file, row.repo, options.overrides)
    return { ...row, path: mapped.path, exists: mapped.exists }
  })
}

/**
 * The symbol that contains a worktree file position — the merged store's answer
 * to a stack frame. The nearest definition at or above the line wins.
 *
 * @param path Store path.
 * @param worktree Worktree root.
 * @param worktreeRelative File path relative to the worktree.
 * @param line 1-based line from a stack trace.
 * @param options Shard overrides.
 * @param sqliteBin sqlite3 executable.
 * @returns `{name, kind, file, repo, line, path, exists}`, or null when nothing contains the position.
 */
export function symbolAtLine(path, worktree, worktreeRelative, line, options = {}, sqliteBin = 'sqlite3') {
  const stored = toStoredPath(worktreeRelative, options.overrides)
  const rows = query(path, `SELECT ${NODE_COLUMNS} FROM nodes WHERE file = ${sqlStr(stored)} AND line <= ${Number(line)} ORDER BY line DESC LIMIT 1`, sqliteBin)
  if (rows.length === 0) return null
  const row = rows[0]
  const mapped = toWorktreePath(worktree, row.file, row.repo, options.overrides)
  return { ...row, path: mapped.path, exists: mapped.exists }
}

/**
 * Call sites of a symbol, from `links` where the relation is a call.
 *
 * @param path Store path.
 * @param name Symbol name.
 * @param options `worktree`, `limit`, `relations`.
 * @param sqliteBin sqlite3 executable.
 * @returns Rows `{caller, caller_file, caller_repo, caller_line, relation, path, exists}`.
 */
export function callers(path, name, options = {}, sqliteBin = 'sqlite3') {
  const limit = options.limit ?? 40
  const relations = options.relations ?? ['CALL']
  const clause = relations.map(r => sqlStr(r)).join(', ')
  const rows = query(path, `SELECT n.name AS caller, n.kind AS caller_kind, n.file AS caller_file, n.repo AS caller_repo, n.line AS caller_line, l.relation
    FROM links l JOIN nodes n ON n.id = l.source
    WHERE l.target IN (SELECT id FROM nodes WHERE name = ${sqlStr(name)}) AND l.relation IN (${clause})
    ORDER BY n.repo, n.file, n.line LIMIT ${Number(limit)}`, sqliteBin)
  return rows.map(row => {
    const mapped = options.worktree === undefined ? { path: row.caller_file, exists: false } : toWorktreePath(options.worktree, row.caller_file, row.caller_repo, options.overrides)
    return { ...row, path: mapped.path, exists: mapped.exists }
  })
}

/**
 * Symbols a symbol calls.
 *
 * @param path Store path.
 * @param name Symbol name.
 * @param options `worktree`, `limit`, `relations`.
 * @param sqliteBin sqlite3 executable.
 * @returns Rows `{callee, callee_file, callee_repo, callee_line, relation, path, exists}`.
 */
export function callees(path, name, options = {}, sqliteBin = 'sqlite3') {
  const limit = options.limit ?? 40
  const relations = options.relations ?? ['CALL']
  const clause = relations.map(r => sqlStr(r)).join(', ')
  const rows = query(path, `SELECT n.name AS callee, n.kind AS callee_kind, n.file AS callee_file, n.repo AS callee_repo, n.line AS callee_line, l.relation
    FROM links l JOIN nodes n ON n.id = l.target
    WHERE l.source IN (SELECT id FROM nodes WHERE name = ${sqlStr(name)}) AND l.relation IN (${clause})
    ORDER BY n.repo, n.file, n.line LIMIT ${Number(limit)}`, sqliteBin)
  return rows.map(row => {
    const mapped = options.worktree === undefined ? { path: row.callee_file, exists: false } : toWorktreePath(options.worktree, row.callee_file, row.callee_repo, options.overrides)
    return { ...row, path: mapped.path, exists: mapped.exists }
  })
}

/**
 * Transitive callers of a symbol, bounded by depth.
 *
 * @param path Store path.
 * @param name Symbol name.
 * @param options `worktree`, `depth`, `limit`, `relations`.
 * @param sqliteBin sqlite3 executable.
 * @returns Rows `{depth, caller, caller_file, caller_repo, caller_line, path, exists}`.
 */
export function impact(path, name, options = {}, sqliteBin = 'sqlite3') {
  const depth = Math.max(1, Number(options.depth ?? 3))
  const limit = options.limit ?? 60
  const relations = options.relations ?? ['CALL']
  const clause = relations.map(r => sqlStr(r)).join(', ')
  const rows = query(path, `WITH RECURSIVE up(id, depth) AS (
      SELECT id, 0 FROM nodes WHERE name = ${sqlStr(name)}
      UNION
      SELECT l.source, up.depth + 1 FROM links l JOIN up ON l.target = up.id
      WHERE l.relation IN (${clause}) AND up.depth < ${depth}
    )
    SELECT MIN(up.depth) AS depth, n.name AS caller, n.file AS caller_file, n.repo AS caller_repo, n.line AS caller_line
    FROM up JOIN nodes n ON n.id = up.id
    WHERE up.depth > 0
    GROUP BY n.id ORDER BY depth, n.repo, n.file LIMIT ${Number(limit)}`, sqliteBin)
  return rows.map(row => {
    const mapped = options.worktree === undefined ? { path: row.caller_file, exists: false } : toWorktreePath(options.worktree, row.caller_file, row.caller_repo, options.overrides)
    return { ...row, path: mapped.path, exists: mapped.exists }
  })
}

/**
 * Files that depend on the symbols defined in one worktree file, walked
 * backwards over call links.
 *
 * @param path Store path.
 * @param worktree Worktree root.
 * @param worktreeRelative File path relative to the worktree.
 * @param options `depth`, `limit`, shard overrides.
 * @param sqliteBin sqlite3 executable.
 * @returns Rows `{file, repo, depth, path, exists}`.
 */
export function dependentFiles(path, worktree, worktreeRelative, options = {}, sqliteBin = 'sqlite3') {
  const stored = toStoredPath(worktreeRelative, options.overrides)
  const depth = Math.max(1, Number(options.depth ?? 2))
  const limit = options.limit ?? 80
  const rows = query(path, `WITH RECURSIVE up(id, depth) AS (
      SELECT id, 0 FROM nodes WHERE file = ${sqlStr(stored)}
      UNION
      SELECT l.source, up.depth + 1 FROM links l JOIN up ON l.target = up.id
      WHERE up.depth < ${depth}
    )
    SELECT MIN(up.depth) AS depth, n.file AS file, n.repo AS repo
    FROM up JOIN nodes n ON n.id = up.id
    WHERE up.depth > 0 AND n.file <> ${sqlStr(stored)}
    GROUP BY n.file ORDER BY depth, n.file LIMIT ${Number(limit)}`, sqliteBin)
  return rows.map(row => {
    const mapped = toWorktreePath(worktree, row.file, row.repo, options.overrides)
    return { ...row, path: mapped.path, exists: mapped.exists }
  })
}

/**
 * Is this store a merged c2g graph we can query?
 *
 * @param path Store path.
 * @param sqliteBin sqlite3 executable.
 * @returns True when `nodes` answers.
 */
export function isUsable(path, sqliteBin = 'sqlite3') {
  try {
    query(path, 'SELECT count(*) AS n FROM nodes LIMIT 1', sqliteBin, 15_000)
    return true
  } catch {
    return false
  }
}

/**
 * Resolve a row to `path:line` for display, preferring a confirmed worktree
 * mapping. Caller and callee rows carry their line under a role-specific column.
 */
export function displayPath(row) {
  const path = row.path ?? row.file ?? row.caller_file ?? row.callee_file
  const line = row.line ?? row.caller_line ?? row.callee_line
  return `${path}${line !== undefined && line !== null ? `:${line}` : ''}`
}

/** Absolute path of the store for a worktree's repository, for logging. */
export function storeLabel(store) {
  return `${resolve(store.path)}${store.builtAt !== null ? ` (built ${store.builtAt})` : ''}`
}
````

## `lib/errors.js`

sha256 `93302e8fbf464dfbf2aecbeb79f2a6ff31ed76d8ac60eb150b49222ccd2cebfb` · 198 lines

````javascript
/**
 * Turn a failure signal into drill frames.
 *
 * The pipeline's first stage starts from "the stack trace, error logs, input
 * payload, and the specific function throwing the error" — not from a symbol
 * name. This module parses the shapes a real failure arrives in (a Rust panic,
 * a numbered backtrace, a compiler diagnostic, a Python traceback, a plain
 * `file:line` mention) into frames a resolver can look up.
 *
 * Parsing is deliberately conservative: a frame is reported only when it carries
 * an explicit `file:line`, and standard-library or dependency frames are marked
 * `external` instead of being dropped, so a caller can show why a frame was not
 * resolved.
 */

/** Source extensions a bare `file:line` mention may carry. */
const SOURCE_EXT = 'rs|py|ts|tsx|js|jsx|mjs|cjs|go|java|kt|rb|c|cc|cpp|cxx|h|hpp|sql|toml|yaml|yml|json'

/** Frame cap, so a pathological log cannot flood the ledger. */
export const MAX_FRAMES = 40

/**
 * Paths that belong to a toolchain or dependency tree rather than the repository.
 *
 * The `library/...` roots are deliberately **not** here: as substrings they also
 * match a repository path such as `src/library/std/thing.rs`, which would mark a
 * real frame external. They are matched as prefixes instead — see below.
 */
const EXTERNAL_MARKERS = ['/rustc/', '/rustlib/', '/.cargo/registry/', '/node_modules/', '/usr/lib/', '/usr/local/lib/', '/site-packages/', '/.rustup/']

/**
 * The same trees, as they appear when printed *relative* rather than absolute.
 *
 * Rust reports a panic inside the standard library as
 * `panicked at library/std/src/panicking.rs:597:5:` — no leading slash — and a
 * dependency as `at /home/<user>/.cargo/registry/...` or, in some builds,
 * `node_modules/...`. Matching only the absolute forms counted those as
 * repository frames, which turned "the bug is inside std" into a
 * localization pointing at a file that does not exist in the worktree.
 *
 * These are matched as **prefixes**, so a repository that genuinely contains
 * `src/library/std/` keeps its own file.
 */
const EXTERNAL_PREFIXES = [
  'library/core/', 'library/std/', 'library/alloc/', 'library/panic_abort/', 'library/panic_unwind/',
  'library/profiler_builtins/', 'rustc/', 'rustlib/', '.cargo/registry/', '.rustup/',
  'node_modules/', 'site-packages/', 'usr/lib/', 'usr/local/lib/',
]

/**
 * True when a path belongs to a toolchain or dependency tree, not this repository.
 *
 * @param file Path as printed, with `./` and `file://` already stripped.
 */
export function isExternalPath(file) {
  if (EXTERNAL_MARKERS.some(marker => file.includes(marker))) return true
  return EXTERNAL_PREFIXES.some(prefix => file.startsWith(prefix))
}

/**
 * Normalize a path mentioned in a log into a repository-relative path.
 *
 * @param raw Path as printed.
 * @returns `{ file, external }` — `file` has `./`, `file://` and a leading slash removed.
 */
export function normalizeFramePath(raw) {
  let file = raw.trim().replace(/^file:\/\//, '').replace(/^\.\//, '')
  const external = isExternalPath(file)
  if (file.startsWith('/') && !external) {
    // An absolute path pointing into a repository is reduced to the tail a
    // worktree can match. An absolute path elsewhere is left absolute, so the
    // output never claims a relative path that does not exist.
    const markers = ['/nodedb/', '/nodedb-sql/', '/nodedb-cluster/', '/nodedb-types/', '/nodedb-vector/']
    const hit = markers.find(marker => file.includes(marker))
    if (hit !== undefined) file = file.slice(file.indexOf(hit) + 1)
  }
  return { file, external }
}

/**
 * Extract the panic or error message that accompanies the frames.
 *
 * @param text Raw log text.
 * @returns The message line, or null when the text carries none.
 */
export function extractMessage(text) {
  // `panicked at <path>:<line>:<col>: <message>` — anchor on the line/column so
  // the lazy prefix cannot stop at the colon inside the path.
  const panic = text.match(/panicked at [^\n]*?:(\d+)(?::(\d+))?:[ \t]*([^\n]*)/)
  if (panic) {
    if (panic[3].trim() !== '') return panic[3].trim()
    const after = text.slice((text.indexOf(panic[0]) + panic[0].length)).split('\n').map(line => line.trim()).filter(Boolean)
    if (after.length > 0) return after[0]
  }
  const header = text.match(/^\s*(?:error|fatal|thread '[^']+' panicked)[^\n]*:\s*([^\n]+)$/m)
  if (header && header[1].trim() !== '') return header[1].trim()
  const err = text.match(/^\s*(?:ERROR|FATAL|Error):\s*([^\n]+)$/m)
  return err ? err[1].trim() : null
}

/**
 * Parse a failure signal into frames.
 *
 * Recognised shapes, in the order they are tried per line:
 * 1. `panicked at path/file.rs:12:5:` — the panic header.
 * 2. `  3: crate::module::function` followed by `at ./path/file.rs:12:5` — a numbered backtrace, keeping the symbol as a hint.
 * 3. `--> path/file.rs:12:5` — a compiler diagnostic.
 * 4. `File "path/file.py", line 12` — a Python traceback.
 * 5. A bare `path/file.ext:12[:5]` mention.
 *
 * @param text Raw log text.
 * @returns `{ message, frames }` with frames deduplicated by file:line, ordered as they appear, capped at {@link MAX_FRAMES}.
 */
export function parseFrames(text) {
  const source = String(text ?? '').replaceAll('\r\n', '\n')
  const frames = []
  const seen = new Set()

  const push = (rawPath, line, column, symbolHint) => {
    const { file, external } = normalizeFramePath(rawPath)
    if (file === '' || !Number.isInteger(line) || line <= 0) return
    const key = `${file}:${line}`
    if (seen.has(key)) return
    seen.add(key)
    frames.push({
      file,
      line,
      column: Number.isInteger(column) && column > 0 ? column : null,
      ...(symbolHint !== undefined && symbolHint !== '' ? { symbolHint } : {}),
      external,
    })
  }

  const lines = source.split('\n')
  let pendingSymbol = null
  for (const rawLine of lines) {
    const line = rawLine.trimEnd()

    const numbered = line.match(/^\s*\d+:\s+(?:0x[0-9a-f]+ - )?([A-Za-z_][\w:<>$]*(?:::[A-Za-z_][\w:<>$]*)+)\s*$/)
    if (numbered) {
      pendingSymbol = numbered[1]
      continue
    }

    const panic = line.match(/panicked at (.+?):(\d+)(?::(\d+))?/)
    if (panic) {
      push(panic[1], Number(panic[2]), panic[3] === undefined ? null : Number(panic[3]), pendingSymbol ?? undefined)
      pendingSymbol = null
      continue
    }

    const at = line.match(/\bat\s+(?:\.\/)?([^\s()]+?):(\d+)(?::(\d+))?\s*$/)
    if (at) {
      push(at[1], Number(at[2]), at[3] === undefined ? null : Number(at[3]), pendingSymbol ?? undefined)
      pendingSymbol = null
      continue
    }

    const arrow = line.match(/-->\s+([^\s:]+):(\d+)(?::(\d+))?/)
    if (arrow) {
      push(arrow[1], Number(arrow[2]), arrow[3] === undefined ? null : Number(arrow[3]), undefined)
      pendingSymbol = null
      continue
    }

    const python = line.match(/File "([^"]+)", line (\d+)/)
    if (python) {
      push(python[1], Number(python[2]), null, undefined)
      pendingSymbol = null
      continue
    }

    const bare = line.match(new RegExp(`(?:^|[\\s("'\`])((?:[\\w.@+-]+/)*[\\w.@+-]+\\.(?:${SOURCE_EXT})):(\\d+)(?::(\\d+))?`, 'g'))
    if (bare) {
      for (const match of bare) {
        const parts = match.match(new RegExp(`((?:[\\w.@+-]+/)*[\\w.@+-]+\\.(?:${SOURCE_EXT})):(\\d+)(?::(\\d+))?`))
        if (parts) push(parts[1], Number(parts[2]), parts[3] === undefined ? null : Number(parts[3]), undefined)
      }
      pendingSymbol = null
    }
  }

  return { message: extractMessage(source), frames: frames.slice(0, MAX_FRAMES) }
}

/**
 * Summarize frames for a ledger note.
 *
 * @param frames Parsed frames.
 * @returns A single line naming the repository frames and how many were external.
 */
export function describeFrames(frames) {
  const internal = frames.filter(frame => !frame.external)
  const external = frames.length - internal.length
  const head = internal.slice(0, 5).map(frame => `${frame.file}:${frame.line}`).join(', ')
  return `${internal.length} repository frame(s)${external > 0 ? `, ${external} external` : ''}${head === '' ? '' : `: ${head}`}`
}
````

## `lib/gates.js`

sha256 `dcc11c0d346e7ef52483f8650e54ab03641360fc5c1f1b808a2d71d8e3227f31` · 173 lines

````javascript
import { STAGES } from './ledger.js'

/**
 * One drill gate: deterministic predicate over the ledger, in stage order.
 * `requiredForDone` marks the gates that must hold before a task may be called finished.
 */
export const GATES = [
  {
    id: 'localize',
    stage: 'localize',
    label: 'Localized to file:line',
    requiredForDone: false,
    check: entries => {
      const hit = entries.filter(e => e.kind === 'locate')
      const anchored = hit.filter(e => (e.files?.length ?? 0) > 0 || Boolean(e.text))
      return { ok: anchored.length > 0, evidence: anchored.at(-1), detail: 'needs one `locate` record naming the file(s) or the exact code site' }
    },
  },
  {
    id: 'blast',
    stage: 'blast',
    label: 'Blast radius mapped',
    requiredForDone: false,
    check: entries => {
      const hit = entries.filter(e => e.kind === 'blast')
      const withSurface = hit.filter(e => (e.files?.length ?? 0) > 0 || (e.symbols?.length ?? 0) > 0 || Boolean(e.text))
      return { ok: withSurface.length > 0, evidence: withSurface.at(-1), detail: 'needs one `blast` record with callers/callees/affected files' }
    },
  },
  {
    id: 'edge',
    stage: 'edge',
    label: 'Edge cases enumerated',
    requiredForDone: false,
    check: entries => {
      const hit = entries.filter(e => e.kind === 'edge' && Boolean(e.text))
      return { ok: hit.length > 0, evidence: hit.at(-1), detail: 'needs one `edge` record stating the invariants/edge cases that must fail' }
    },
  },
  {
    id: 'red',
    stage: 'patch',
    label: 'Red proof — test fails on base',
    requiredForDone: true,
    check: entries => {
      const hit = entries.filter(e => e.kind === 'test' && e.arm === 'base')
      const red = hit.filter(e => Number.isInteger(e.exit) && e.exit !== 0 && e.sha256)
      return { ok: red.length > 0, evidence: red.at(-1), detail: 'needs a `test` record with arm=base, non-zero exit and a hashed log; a test that passes on base is a guard, not a proof' }
    },
  },
  {
    id: 'green',
    stage: 'patch',
    label: 'Green proof — test passes with fix',
    requiredForDone: true,
    check: entries => {
      const hit = entries.filter(e => e.kind === 'test' && e.arm === 'fix')
      const green = hit.filter(e => e.exit === 0 && e.sha256)
      return { ok: green.length > 0, evidence: green.at(-1), detail: 'needs a `test` record with arm=fix, exit 0 and a hashed log' }
    },
  },
  {
    id: 'hygiene',
    stage: 'patch',
    label: 'Repo preflight clean',
    requiredForDone: true,
    check: entries => {
      const hit = entries.filter(e => e.kind === 'hygiene')
      const clean = hit.filter(e => e.exit === 0 && e.sha256)
      return { ok: clean.length > 0, evidence: clean.at(-1), detail: 'needs a `hygiene` record with exit 0 (fmt/clippy/preflight) and a hashed log' }
    },
  },
  {
    id: 'review',
    stage: 'review',
    label: 'Review 2 PASS on the reviewed commit',
    requiredForDone: true,
    check: entries => {
      const hit = entries.filter(e => e.kind === 'review')
      const pass = hit.filter(e => e.verdict === 'PASS' && (e.blockers ?? 0) === 0)
      const last = hit.at(-1)
      const green = entries.filter(e => e.kind === 'test' && e.arm === 'fix' && e.exit === 0 && e.sha256).at(-1)
      const expected = green?.head ?? null
      // A review that names no commit at all is as stale as one that names the
      // wrong commit: this gate promises a verdict on the green proof's commit,
      // and a hand-written `review` record could otherwise assert PASS without
      // ever being bound to one.
      const unbindable = expected !== null && last !== undefined && last.head === undefined
      const stale = expected !== null && last !== undefined && last.head !== expected
      return {
        ok: pass.length > 0 && last === pass.at(-1) && !stale,
        evidence: last,
        detail: unbindable
          ? `the last review record names no commit, but the green proof is on ${expected.slice(0, 12)} — only a review bound to that commit closes this gate`
          : stale
            ? `the last review audited ${String(last.head).slice(0, 12)} but the green proof is on ${expected.slice(0, 12)} — re-run the review on the reviewed commit`
            : 'needs a `review` record with verdict=PASS and 0 blockers, and no later review record that failed; a review that names a different commit than the green proof reopens this gate',
      }
    },
  },
  {
    id: 'pr',
    stage: 'pr',
    label: 'PR body recorded for the reviewed commit',
    requiredForDone: false,
    check: entries => {
      const hit = entries.filter(e => e.kind === 'pr' && Boolean(e.bodyPath))
      const last = hit.at(-1)
      const green = entries.filter(e => e.kind === 'test' && e.arm === 'fix' && e.exit === 0 && e.sha256).at(-1)
      const expected = green?.head ?? null
      // Same rule as the review gate: a body that names no commit cannot be
      // shown to match the green proof.
      const unbindable = expected !== null && last !== undefined && last.head === undefined
      const stale = expected !== null && last !== undefined && last.head !== expected
      return {
        ok: hit.length > 0 && !stale,
        evidence: last,
        detail: unbindable
          ? `the PR body record names no commit, but the green proof is on ${expected.slice(0, 12)} — re-render it on the commit you are pushing`
          : stale
            ? `the body was rendered for ${String(last.head).slice(0, 12)} but the green proof is on ${expected.slice(0, 12)} — re-render it on the commit you are pushing`
            : 'needs a `pr` record pointing at the PR body file; a body rendered for another commit than the green proof reopens this gate',
      }
    },
  },
]

/**
 * Evaluate every gate against a task's ledger.
 * @param entries Entries read from the ledger, in write order.
 * @returns Per-gate verdicts, the missing required gates, the current stage and done-readiness.
 */
export function evaluate(entries) {
  const results = GATES.map(gate => {
    const { ok, evidence, detail } = gate.check(entries)
    return {
      id: gate.id,
      stage: gate.stage,
      label: gate.label,
      requiredForDone: gate.requiredForDone,
      ok,
      detail,
      evidence: evidence
        ? { ts: evidence.ts, cmd: evidence.cmd, exit: evidence.exit, log: evidence.log, sha256: evidence.sha256, verdict: evidence.verdict, blockers: evidence.blockers }
        : null,
    }
  })

  const missingForDone = results.filter(r => r.requiredForDone && !r.ok).map(r => r.id)
  const firstOpen = results.find(r => !r.ok)
  const stage = firstOpen ? firstOpen.stage : 'pr'
  const completedStage = STAGES.indexOf(stage)

  return {
    gates: results,
    stage,
    stageIndex: completedStage,
    ready: missingForDone.length === 0,
    missingForDone,
    next: firstOpen ? `${firstOpen.id}: ${firstOpen.detail}` : 'all gates hold — the task may be declared finished',
  }
}

/**
 * Render the gate table as GitHub-flavoured markdown.
 * @param evaluation Result of {@link evaluate}.
 * @returns Markdown table with one row per gate.
 */
export function gateTable(evaluation) {
  const rows = evaluation.gates.map(g => `| ${g.ok ? '✅' : '⬜'} | ${g.id} | ${g.label} | ${g.evidence?.cmd ?? '—'} |`)
  return ['| | gate | meaning | evidence |', '|---|---|---|---|', ...rows].join('\n')
}
````

## `lib/git.js`

sha256 `726f3288b7d322b2aa6940dd49a9148b8a47aa4e7a33755a53a034a5303ef8af` · 82 lines

````javascript
import { execFileSync } from 'node:child_process'

/**
 * Read-only git queries used to bind drill evidence to a commit and to turn a
 * branch diff into a blast-radius candidate list.
 *
 * Every call is `git -C <repo> <read-only verb>`; nothing here writes to a
 * repository, and a failure returns null or an empty list rather than throwing,
 * because "not a git checkout" is a normal state for a drill workspace.
 */

/**
 * Run one read-only git command.
 * @param repo Repository or worktree path.
 * @param args Git arguments.
 * @returns Trimmed stdout, or null when git fails.
 */
export function git(repo, args) {
  try {
    return execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', timeout: 30_000 }).trim()
  } catch {
    return null
  }
}

/**
 * The commit HEAD points at, used to bind evidence to a revision.
 * @param repo Repository path.
 * @returns Full object id, or null when unavailable.
 */
export function headSha(repo) {
  const out = git(repo, ['rev-parse', 'HEAD'])
  return out && /^[0-9a-f]{40}$/.test(out) ? out : null
}

/**
 * The current branch name, or null on a detached HEAD.
 * @param repo Repository path.
 * @returns Branch name, or null.
 */
export function branchName(repo) {
  return git(repo, ['symbolic-ref', '--short', '-q', 'HEAD'])
}

/**
 * Files the branch changed against a base ref.
 *
 * `--diff-filter=ACMR` mirrors the tracescope contract: added, copied, modified
 * and renamed files are in scope; deletions are reported separately because
 * they change the blast radius without being editable.
 *
 * @param repo Repository path.
 * @param base Base ref, e.g. `origin/main`.
 * @returns `{ changed, deleted, error }`; `error` names the git failure.
 */
export function diffFiles(repo, base) {
  const changed = git(repo, ['diff', '--name-only', '--diff-filter=ACMR', `${base}...HEAD`])
  if (changed === null) {
    // `${base}...HEAD` failed (unknown ref, no merge base). The uncommitted
    // worktree diff is a useful fallback, but it answers a *different*
    // question, so the caller must be able to say so instead of recording it
    // under a base that was never compared.
    const fallback = git(repo, ['diff', '--name-only', '--diff-filter=ACMR', 'HEAD'])
    if (fallback === null) return { changed: [], deleted: [], error: `git diff against ${base} failed`, fallback: false }
    return {
      changed: split(fallback),
      deleted: [],
      error: null,
      fallback: true,
      fallbackCmd: 'git diff --name-only --diff-filter=ACMR HEAD',
      fallbackReason: `git diff against ${base} failed, so this is the working-tree diff against HEAD`,
    }
  }
  const deleted = git(repo, ['diff', '--name-only', '--diff-filter=D', `${base}...HEAD`])
  return { changed: split(changed), deleted: deleted === null ? [] : split(deleted), error: null, fallback: false }
}

/** Split git's newline-separated path output into a list. */
function split(output) {
  return output === '' ? [] : output.split('\n').map(line => line.trim()).filter(Boolean)
}
````

## `lib/ledger.js`

sha256 `a7844bfdd7350b777f8e1071bb87e2521f9814050dc888a2b655ef9171e5ef5a` · 188 lines

````javascript
import { createHash } from 'node:crypto'
import { appendFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve, sep } from 'node:path'

/** Kinds of evidence a drill can record. */
export const KINDS = ['locate', 'blast', 'edge', 'test', 'hygiene', 'review', 'pr', 'note']

/** Ordered drill stages; a task advances only when its gates have evidence. */
export const STAGES = ['localize', 'blast', 'edge', 'patch', 'review', 'pr']

/** Ledger schema version written into every entry. */
export const LEDGER_VERSION = 1

const TASK_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/

/**
 * Validate a task id and reject anything that could escape the state root.
 * @param id Candidate task id.
 * @returns The same id when it is safe to use as a directory name.
 */
export function assertTaskId(id) {
  if (typeof id !== 'string' || !TASK_ID.test(id) || id.includes('..')) {
    throw new Error(`drill: invalid task id ${JSON.stringify(id)} — use [A-Za-z0-9._-], max 64 chars`)
  }
  return id
}

/**
 * Resolve the per-task directory layout under the state root.
 * @param root State root (usually `<workspace>/.drill`).
 * @param task Task id.
 * @returns Absolute-ish paths for the task's ledger, artifacts and report.
 */
export function taskPaths(root, task) {
  const dir = join(root, assertTaskId(task))
  return { dir, ledger: join(dir, 'ledger.jsonl'), logs: join(dir, 'logs'), artifacts: join(dir, 'artifacts'), report: join(dir, 'report.md') }
}

/**
 * Hash a file's bytes, or return undefined when the file cannot be read.
 *
 * An empty file hashes to the digest of the empty string on purpose: a command
 * that succeeds silently (`cargo fmt --check`) still produced a log, and the
 * proof is that the file exists and is bound to a digest.
 *
 * @param path File to hash.
 * @returns `sha256:<hex>` for an existing file, else undefined.
 */
export function hashFile(path) {
  try {
    if (!existsSync(path) || !statSync(path).isFile()) return undefined
    return `sha256:${createHash('sha256').update(readFileSync(path)).digest('hex')}`
  } catch {
    return undefined
  }
}

/**
 * Validate one evidence entry before it can reach the ledger.
 * @param entry Entry assembled by a tool call.
 * @param options `requireLog` — test entries must point at a non-empty log file;
 *   `logsDir` — when given, a hand-written test/hygiene log must live inside it.
 * @returns The normalized entry that will be written.
 */
export function normalizeEntry(entry, options = {}) {
  const requireLog = options.requireLog !== false
  if (!entry || typeof entry !== 'object') throw new Error('drill: entry must be an object')
  const { task, kind, stage } = entry
  assertTaskId(task)
  if (!KINDS.includes(kind)) throw new Error(`drill: kind must be one of ${KINDS.join(', ')}`)
  if (!STAGES.includes(stage)) throw new Error(`drill: stage must be one of ${STAGES.join(', ')}`)

  const normalized = { v: LEDGER_VERSION, ts: new Date().toISOString(), task, kind, stage }
  if (entry.arm !== undefined) {
    if (!['base', 'fix'].includes(entry.arm)) throw new Error('drill: arm must be "base" or "fix"')
    normalized.arm = entry.arm
  }
  if (entry.cmd !== undefined) normalized.cmd = String(entry.cmd)
  if (entry.exit !== undefined) {
    if (!Number.isInteger(entry.exit)) throw new Error('drill: exit must be an integer (a process exit code)')
    normalized.exit = entry.exit
  }
  if (entry.verdict !== undefined) {
    if (!['PASS', 'FAIL'].includes(entry.verdict)) throw new Error('drill: verdict must be PASS or FAIL')
    normalized.verdict = entry.verdict
  }
  if (entry.blockers !== undefined) {
    if (!Number.isInteger(entry.blockers) || entry.blockers < 0) throw new Error('drill: blockers must be a non-negative integer')
    normalized.blockers = entry.blockers
  }
  for (const field of ['note', 'text', 'bodyPath', 'base', 'repo', 'worktree', 'issue', 'head', 'branch', 'role']) {
    if (entry[field] !== undefined) normalized[field] = String(entry[field])
  }
  for (const field of ['files', 'symbols']) {
    if (entry[field] !== undefined) {
      if (!Array.isArray(entry[field])) throw new Error(`drill: ${field} must be an array of strings`)
      normalized[field] = entry[field].map(String)
    }
  }

  if (entry.log !== undefined) {
    const path = String(entry.log)
    const sha256 = hashFile(path)
    if (requireLog && (kind === 'test' || kind === 'hygiene') && sha256 === undefined) {
      throw new Error(`drill: refused — no readable log at ${path}. Evidence without captured output is a claim, not a proof.`)
    }
    // Rule 3: only the executor produces a proof. A hand-written test/hygiene
    // record may point at the run's log, but not at any readable file on the
    // machine — otherwise `drill_record kind=test log=README.md` is a green
    // proof. The executor writes into the task's own logs directory.
    if (
      (kind === 'test' || kind === 'hygiene') &&
      options.logsDir !== undefined &&
      sha256 !== undefined &&
      !resolve(path).startsWith(`${resolve(options.logsDir)}${sep}`)
    ) {
      throw new Error(`drill: refused — a ${kind} log must be captured by the drill under ${options.logsDir} (use drill_run); ${path} is not.`)
    }
    if (sha256 !== undefined) normalized.sha256 = sha256
    normalized.log = path
  } else if (requireLog && (kind === 'test' || kind === 'hygiene')) {
    throw new Error(`drill: refused — a ${kind} record must carry \`log\` (the captured output of the run)`)
  }
  // An unarmed test record closes neither red nor green (the gates read `arm`),
  // so accepting it only adds a row that looks like proof and proves nothing.
  if (kind === 'test' && entry.arm === undefined) {
    throw new Error('drill: refused — a test record must carry `arm`: "base" before the fix, "fix" after it')
  }

  return normalized
}

/**
 * Append one validated entry to a task's ledger.
 * @param paths Result of {@link taskPaths}.
 * @param entry Entry to validate and append.
 * @param options Forwarded to {@link normalizeEntry}.
 * @returns The normalized entry as written.
 */
export function appendEntry(paths, entry, options = {}) {
  const normalized = normalizeEntry(entry, {
    ...options,
    ...(paths.logs !== undefined ? { logsDir: paths.logs } : {}),
  })
  mkdirSync(paths.dir, { recursive: true })
  appendFileSync(paths.ledger, `${JSON.stringify(normalized)}\n`, 'utf8')
  return normalized
}

/**
 * Read a task's ledger.
 * @param paths Result of {@link taskPaths}.
 * @returns Parsed entries in write order; a missing ledger reads as empty.
 */
export function readLedger(paths) {
  if (!existsSync(paths.ledger)) return []
  const raw = readFileSync(paths.ledger, 'utf8')
  // A record is one synchronous O_APPEND write ending in a newline, so a writer
  // that died mid-write leaves an unterminated final line. Only that shape is
  // tolerated; a complete line that does not parse is corruption and must fail.
  const tornLastLine = raw !== '' && !raw.endsWith('\n')
  const lines = raw.split('\n')
  const entries = []
  for (const [index, line] of lines.entries()) {
    const trimmed = line.trim()
    if (!trimmed) continue
    try {
      entries.push(JSON.parse(trimmed))
    } catch {
      if (tornLastLine && index === lines.length - 1) continue
      throw new Error(`drill: ledger line ${index + 1} is not valid JSON — refusing to evaluate a corrupted ledger`)
    }
  }
  return entries
}

/**
 * Write a task's markdown report to disk.
 * @param paths Result of {@link taskPaths}.
 * @param markdown Rendered report body.
 * @returns The report path.
 */
export function writeReport(paths, markdown) {
  mkdirSync(paths.dir, { recursive: true })
  writeFileSync(paths.report, markdown, 'utf8')
  return paths.report
}
````

## `lib/pr.js`

sha256 `6eb4c8b520ce3dfe65dd19d5db12578d7abf6fe26ebf10120cf4f744c6ab8c9b` · 141 lines

````javascript
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { evaluate, gateTable } from './gates.js'

/**
 * Assemble a pull-request body from a drill ledger, then score it with the
 * existing PR-craft core (`~/scripts/pr_craft.py`) instead of re-implementing
 * review rules here.
 *
 * The body is only as good as the evidence: every verification line comes from a
 * ledger record with an exit code and a hashed log, so a body cannot claim a test
 * that never ran.
 */

/**
 * Where the PR-craft core lives.
 *
 * Resolution order: the `PR_CRAFT_CORE` override, then the copy shipped inside
 * this package (`core/pr_craft.py`, which is what an npm install gets), then the
 * home-directory install the Kilo and Hermes frontends use. Without the middle
 * step a published package would silently lint nothing on a machine that never
 * had the core, and `drill_pr` would record a body nobody scored.
 */
const BUNDLED_PR_CORE = fileURLToPath(new URL('../core/pr_craft.py', import.meta.url))
export const DEFAULT_PR_CORE = process.env.PR_CRAFT_CORE
  ?? (existsSync(BUNDLED_PR_CORE) ? BUNDLED_PR_CORE : `${process.env.HOME ?? ''}/scripts/pr_craft.py`)

/**
 * Render the PR body.
 *
 * @param task Task id.
 * @param entries Ledger entries in write order.
 * @param options `title`, `why`, plus task metadata (issue, repo, base).
 * @returns Markdown body whose first line is the subject.
 */
export function renderPrBody(task, entries, options = {}) {
  const evaluation = evaluate(entries)
  const tests = entries.filter(e => e.kind === 'test')
  const red = tests.filter(t => t.arm === 'base').at(-1)
  const green = tests.filter(t => t.arm === 'fix' && t.exit === 0).at(-1)
  const hygiene = entries.filter(e => e.kind === 'hygiene').at(-1)
  const review = entries.filter(e => e.kind === 'review').at(-1)
  const blasts = entries.filter(e => e.kind === 'blast')
  const changed = [...new Set(blasts.flatMap(b => b.files ?? []))]
  const lines = []

  lines.push(options.title ?? `fix: ${task}`)
  lines.push('')
  lines.push('## Why')
  lines.push('')
  lines.push(options.why ?? (options.issue !== undefined && options.issue !== null ? `Fixes the defect tracked in #${options.issue}.` : 'Fixes the defect described in the linked issue.'))
  lines.push('')

  lines.push('## What changed')
  lines.push('')
  if (changed.length === 0) lines.push('- (no blast-radius evidence recorded)')
  else for (const file of changed.slice(0, 15)) lines.push(`- \`${file}\``)
  lines.push('')

  lines.push('## How it was verified')
  lines.push('')
  lines.push('| step | command | exit | log | commit |')
  lines.push('|---|---|---|---|---|')
  const row = (label, record) => {
    if (record === undefined) return `| ${label} | — | — | — | — |`
    const log = record.log === undefined ? '—' : `\`${logName(record.log)}\``
    return `| ${label} | \`${record.cmd ?? '—'}\` | ${record.exit ?? '—'} | ${log} | ${record.head === undefined ? '—' : record.head.slice(0, 12)} |`
  }
  lines.push(row('red (fails on base)', red))
  lines.push(row('green (passes with fix)', green))
  lines.push(row('preflight', hygiene))
  lines.push('')
  if (red === undefined) lines.push('> No red proof is recorded: the failing-on-base run is missing, so this claim is unverified.')
  if (green === undefined) lines.push('> No green proof is recorded.')
  lines.push('')

  lines.push('## Review')
  lines.push('')
  if (review === undefined) {
    lines.push('Review 2 has not run yet.')
  } else {
    lines.push(`Review 2 verdict: **${review.verdict}**${review.blockers === undefined ? '' : ` (${review.blockers} blockers)`}${review.role === undefined ? '' : ` · role \`${review.role}\``}${review.head === undefined ? '' : ` · commit \`${review.head.slice(0, 12)}\``}`)
    if (review.text !== undefined) lines.push('', review.text)
  }
  lines.push('')

  lines.push('## Gates')
  lines.push('')
  lines.push(gateTable(evaluation))
  lines.push('')

  if (options.issue !== undefined && options.issue !== null && options.issue !== '') {
    lines.push(`Closes #${options.issue}`)
    lines.push('')
  }
  return lines.join('\n')
}

/** Basename of a log path, for a table cell that stays readable. */
function logName(path) {
  const parts = String(path).split('/')
  return parts[parts.length - 1]
}

/**
 * Score a rendered body with the PR-craft core.
 *
 * @param text Rendered body.
 * @param options `core` path to `pr_craft.py`, `pythonBin`, `timeoutMs`.
 * @returns `{ available, ok, score, verdict, blockers, good, error }`.
 */
export function lintPrBody(text, options = {}) {
  const core = options.core ?? DEFAULT_PR_CORE
  const python = options.pythonBin ?? 'python3'
  if (core === '' || !existsSync(core)) {
    return { available: false, ok: null, score: null, verdict: 'pr-craft core not installed', blockers: [], good: [], error: null }
  }
  try {
    const stdout = execFileSync(python, [core, 'lint-desc', '--stdin'], {
      input: JSON.stringify({ text }),
      encoding: 'utf8',
      timeout: options.timeoutMs ?? 20_000,
    })
    const parsed = JSON.parse(stdout)
    const issues = Array.isArray(parsed.issues) ? parsed.issues : []
    return {
      available: true,
      ok: parsed.ok === true,
      score: typeof parsed.score === 'number' ? parsed.score : null,
      verdict: typeof parsed.verdict === 'string' ? parsed.verdict : '',
      blockers: issues.filter(issue => issue?.level === 'blocker').map(issue => `${issue.rule}: ${issue.msg}`),
      good: Array.isArray(parsed.good) ? parsed.good : [],
      error: null,
    }
  } catch (error) {
    return { available: true, ok: null, score: null, verdict: 'lint failed', blockers: [], good: [], error: String(error?.message ?? error).slice(0, 300) }
  }
}
````

## `lib/report.js`

sha256 `67dea8b82fbfc52ce6d31e27f46c1cb36fe0081b766f5398db27936b48d17083` · 64 lines

````javascript
import { evaluate, gateTable } from './gates.js'

/**
 * Render a task's drill report as GitHub-flavoured markdown.
 * @param task Task id.
 * @param entries Ledger entries in write order.
 * @param meta Optional task metadata recorded at `drill_start` (repo, worktree, base, issue).
 * @returns Markdown report body.
 */
export function renderReport(task, entries, meta = {}) {
  const evaluation = evaluate(entries)
  const tests = entries.filter(e => e.kind === 'test')
  const lines = []

  lines.push(`# Drill report — ${task}`)
  lines.push('')
  const facts = [
    meta.repo ? `repo \`${meta.repo}\`` : null,
    meta.worktree ? `worktree \`${meta.worktree}\`` : null,
    meta.base ? `base \`${meta.base}\`` : null,
    meta.issue ? `issue \`${meta.issue}\`` : null,
  ].filter(Boolean)
  if (facts.length) lines.push(facts.join(' · '))
  const heads = [...new Set(entries.map(e => e.head).filter(Boolean))]
  if (heads.length === 1) lines.push(`Evidence bound to commit \`${heads[0]}\`.`)
  else if (heads.length > 1) lines.push(`Evidence spans ${heads.length} commits: ${heads.map(h => `\`${h.slice(0, 12)}\``).join(', ')}.`)
  lines.push(`**Verdict: ${evaluation.ready ? 'READY — every required gate holds' : `INCOMPLETE — ${evaluation.missingForDone.join(', ')}`}**`)
  lines.push('')
  lines.push('## Gates')
  lines.push('')
  lines.push(gateTable(evaluation))
  lines.push('')

  if (tests.length) {
    lines.push('## Test evidence')
    lines.push('')
    lines.push('| when | arm | exit | commit | command | log | sha256 |')
    lines.push('|---|---|---|---|---|---|---|')
    for (const t of tests) {
      lines.push(`| ${t.ts} | ${t.arm ?? '—'} | ${t.exit ?? '—'} | ${t.head ? t.head.slice(0, 12) : '—'} | \`${t.cmd ?? '—'}\` | ${t.log ? `\`${t.log}\`` : '—'} | ${t.sha256 ? `${t.sha256.slice(0, 19)}…` : '—'} |`)
    }
    lines.push('')
  }

  const others = entries.filter(e => !['test'].includes(e.kind))
  if (others.length) {
    lines.push('## Other evidence')
    lines.push('')
    lines.push('| when | stage | kind | detail | log |')
    lines.push('|---|---|---|---|---|')
    for (const e of others) {
      const detail = e.text ?? e.note ?? e.verdict ?? e.bodyPath ?? (e.files ?? []).join(', ') ?? '—'
      lines.push(`| ${e.ts} | ${e.stage} | ${e.kind}${e.arm ? `/${e.arm}` : ''} | ${String(detail).replaceAll('|', '\\|').slice(0, 160)} | ${e.log ? `\`${e.log}\`` : '—'} |`)
    }
    lines.push('')
  }

  lines.push('## Next')
  lines.push('')
  lines.push(evaluation.next)
  lines.push('')
  return lines.join('\n')
}
````

## `lib/role.js`

sha256 `a598d2bca4a2b564da39f602153c6316e568ade060b96f8a0dbcd1b3de3d0c9d` · 161 lines

````javascript
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

import { git } from './git.js'

/**
 * Role files for `drill_review`, in the format `dsh-plugin-subagent-roles`
 * established: YAML frontmatter carries routing, tool policy and budget; the
 * body is the persona.
 *
 * This parser covers the subset a role file actually needs — scalars, booleans,
 * numbers, inline arrays, inline maps and block lists — so the plugin keeps zero
 * runtime dependencies. Unknown keys are reported rather than silently applied,
 * because a typo in `maxToolCalls` must not quietly remove a budget.
 */

const KNOWN_KEYS = new Set([
  'name', 'displayName', 'description', 'whenToUse', 'provider', 'model', 'reasoningEffort',
  'tools', 'toolFilter', 'maxToolCalls', 'maxToolCallsScope', 'onToolCallBudget', 'graceToolCalls',
])

/** Coerce one scalar token: quoted string, boolean, number, null, or raw string. */
function scalar(token) {
  const text = token.trim()
  if (text === '') return ''
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    return text.slice(1, -1)
  }
  if (text === 'true') return true
  if (text === 'false') return false
  if (text === 'null' || text === '~') return null
  if (/^-?\d+$/.test(text)) return Number(text)
  return text
}

/** Parse `[a, b, "c"]` into an array of scalars. */
function inlineList(text) {
  const inner = text.slice(1, -1).trim()
  if (inner === '') return []
  return inner.split(',').map(scalar)
}

/** Parse `{ allow: [read, grep], deny: [bash] }` into a plain object. */
function inlineMap(text) {
  const inner = text.slice(1, -1).trim()
  if (inner === '') return {}
  const out = {}
  for (const entry of inner.split(',')) {
    const [key, ...rest] = entry.split(':')
    if (rest.length === 0) continue
    const raw = rest.join(':').trim()
    out[key.trim()] = raw.startsWith('[') && raw.endsWith(']') ? inlineList(raw) : scalar(raw)
  }
  return out
}

/**
 * Split a role file into frontmatter data and persona body.
 *
 * @param text Raw file contents.
 * @returns `{ data, body, unknownKeys }`.
 */
export function parseRoleFile(text) {
  const normalized = text.replaceAll('\r\n', '\n')
  if (!normalized.startsWith('---\n')) return { data: {}, body: normalized.trim(), unknownKeys: [] }
  const end = normalized.indexOf('\n---', 4)
  if (end === -1) return { data: {}, body: normalized.trim(), unknownKeys: [] }

  const front = normalized.slice(4, end)
  const body = normalized.slice(end + 4).trim()
  const data = {}
  const unknownKeys = []
  let currentKey = null

  for (const line of front.split('\n')) {
    if (line.trim() === '' || line.trimStart().startsWith('#')) continue
    const blockItem = line.match(/^\s+-\s+(.*)$/)
    if (blockItem && currentKey !== null) {
      const list = Array.isArray(data[currentKey]) ? data[currentKey] : []
      list.push(scalar(blockItem[1]))
      data[currentKey] = list
      continue
    }
    const match = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/)
    if (!match) continue
    const [, key, rawValue] = match
    currentKey = key
    if (!KNOWN_KEYS.has(key)) unknownKeys.push(key)
    const value = rawValue.trim()
    if (value === '') {
      data[key] = []
      continue
    }
    if (value.startsWith('[') && value.endsWith(']')) data[key] = inlineList(value)
    else if (value.startsWith('{') && value.endsWith('}')) data[key] = inlineMap(value)
    else data[key] = scalar(value)
  }

  return { data, body, unknownKeys }
}

/**
 * Find the role file for an id, mirroring the delegated-roles precedence:
 * project `.dsh/roles` first, then `~/.dsh/roles`, then the bundled copy.
 *
 * @param id Role id (file stem).
 * @param options `cwd` session working directory, `dshHome` harness home, `bundledDir` plugin roles directory.
 * @returns `{ id, path, data, body, unknownKeys, source }`, or null when nothing matches.
 */
export function resolveRole(id, options = {}) {
  const candidates = []
  const repoRoot = options.cwd === undefined ? null : git(options.cwd, ['rev-parse', '--show-toplevel'])
  if (repoRoot) candidates.push({ path: join(repoRoot, '.dsh', 'roles', `${id}.md`), source: 'project' })
  const home = options.dshHome ?? process.env.DSH_HOME ?? join(homedir(), '.dsh')
  candidates.push({ path: join(home, 'roles', `${id}.md`), source: 'user' })
  if (options.bundledDir) candidates.push({ path: join(options.bundledDir, `${id}.md`), source: 'bundled' })

  for (const candidate of candidates) {
    if (!existsSync(candidate.path)) continue
    const parsed = parseRoleFile(readFileSync(candidate.path, 'utf8'))
    return { id, path: candidate.path, source: candidate.source, ...parsed }
  }
  return null
}

/**
 * Expand a role's tool policy into a restriction the subagent seam accepts.
 *
 * Names the current agent cannot see are dropped: `tools.restrict()` throws on
 * an unknown name, and a role should degrade to the visible subset rather than
 * fail the delegation.
 *
 * @param role Parsed role.
 * @param visibleNames Names the spawning agent can see.
 * @returns `{ allow }` the caller passes as `toolFilter`, or undefined when the role names no tools.
 */
export function roleToolFilter(role, visibleNames) {
  const visible = new Set(visibleNames)
  const requested = Array.isArray(role.data.tools)
    ? role.data.tools
    : Array.isArray(role.data.toolFilter?.allow) ? role.data.toolFilter.allow : []
  const deny = Array.isArray(role.data.toolFilter?.deny) ? new Set(role.data.toolFilter.deny) : null
  if (requested.length === 0) return undefined
  const allow = requested
    .flatMap(entry => entry === '*' ? [...visible] : [entry])
    .filter(name => visible.has(name) && !(deny?.has(name) ?? false))
  return allow.length === 0 ? undefined : { allow }
}

/**
 * Read a role's numeric budget.
 * @param role Parsed role.
 * @returns The budget as a non-negative integer, or null when the role sets none.
 */
export function roleBudget(role) {
  const raw = role.data.maxToolCalls
  if (typeof raw !== 'number' || !Number.isInteger(raw) || raw < 0) return null
  return raw
}
````

## `lib/runner.js`

sha256 `c4c1b3d80baba0e8f1601cd911276a9ec3b028d3829e13c74fb0efa93324c8af` · 91 lines

````javascript
import { spawn } from 'node:child_process'
import { createWriteStream, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

/**
 * Run one command, stream its combined output into a log file, and report the exit code.
 *
 * The drill's red/green proofs are only evidence when the plugin itself ran the command:
 * a caller that hands in a pre-written log is recording an assertion.
 *
 * @param options Run request.
 * @param options.command Shell command line.
 * @param options.logPath File that receives combined stdout/stderr.
 * @param options.cwd Working directory for the command.
 * @param options.timeoutMs Hard timeout; on expiry the process group is killed and `timedOut` is true.
 * @param options.signal Caller cancellation; kills the process group like the timeout does.
 * @param options.shell Shell used to interpret the command line.
 * @returns Exit code (`124` on timeout, `128 + signo` when killed by a signal), log path,
 *   duration, the killing signal when there was one, and the timeout flag.
 */
/** Signal name → number, for the 128 + signo exit code a shell would report. */
const SIGNAL_NUMBER = {
  SIGHUP: 1, SIGINT: 2, SIGQUIT: 3, SIGILL: 4, SIGTRAP: 5, SIGABRT: 6, SIGBUS: 7, SIGFPE: 8,
  SIGKILL: 9, SIGUSR1: 10, SIGSEGV: 11, SIGUSR2: 12, SIGPIPE: 13, SIGALRM: 14, SIGTERM: 15,
}

export async function runCapture({ command, logPath, cwd, timeoutMs = 900_000, signal, shell = '/bin/bash' }) {
  mkdirSync(dirname(logPath), { recursive: true })
  const stream = createWriteStream(logPath, { flags: 'w' })
  const started = Date.now()

  return await new Promise((resolve, reject) => {
    const child = spawn(shell, ['-lc', command], { cwd, detached: true, stdio: ['ignore', 'pipe', 'pipe'] })
    let timedOut = false
    let settled = false

    const kill = () => {
      try {
        process.kill(-child.pid, 'SIGTERM')
      } catch {
        // The group is already gone; nothing to signal.
      }
      setTimeout(() => {
        try {
          process.kill(-child.pid, 'SIGKILL')
        } catch {
          // Same: the group exited between the two signals.
        }
      }, 3_000).unref()
    }

    const onAbort = () => {
      timedOut = false
      kill()
    }
    signal?.addEventListener('abort', onAbort, { once: true })

    const timer = timeoutMs > 0
      ? setTimeout(() => {
          timedOut = true
          kill()
        }, timeoutMs)
      : null

    child.stdout.pipe(stream, { end: false })
    child.stderr.pipe(stream, { end: false })

    const finish = (code, signalName) => {
      if (settled) return
      settled = true
      if (timer) clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)
      stream.end(() => {
        // A child killed by a signal reports code null. That is exactly the
        // canonical red proof (a test that segfaults or aborts on base), so it
        // must still produce an integer exit — shells report 128 + signo.
        const exit = timedOut ? 124 : code ?? 128 + (SIGNAL_NUMBER[signalName] ?? 0)
        resolve({ exit, timedOut, signal: signalName ?? null, logPath, durationMs: Date.now() - started })
      })
    }

    child.on('error', error => {
      if (settled) return
      settled = true
      if (timer) clearTimeout(timer)
      stream.end(() => reject(error))
    })
    child.on('close', finish)
  })
}
````

## `lib/search.js`

sha256 `e973f0abbc09846d677e3c10b9b3fe2c09b64b9c47a568fdc3db705860105587` · 303 lines

````javascript
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { delimiter, join } from 'node:path'

import { DEFAULT_TTL_MS, cacheRoot, pruneDir, sizeOf, touch } from './cache.js'

/**
 * Text-search engines for drill evidence.
 *
 * Stage 1–2 prefer the code2graph cache, which resolves symbols. When no cache
 * covers the repository — or the symbol is not in it — the drill still needs an
 * answer, so this module falls back to a text search and labels the result as
 * text-level rather than pretending it is a resolved call graph.
 *
 * `tgrep` is a trigram-indexed grep with a ripgrep-compatible `--json` stream;
 * `rg` is ripgrep itself. Both are parsed by the same reader.
 *
 * A tgrep index normally lives at `<root>/.tgrep`, which would add untracked
 * files to a drill worktree and show up in `git status`. `--index-path` moves it
 * out of the repository, so indexes are kept under a cache directory keyed by
 * the root path and the worktree stays clean.
 */

/** Extra directories searched for a bare binary name, in order after PATH. */
const EXTRA_BIN_DIRS = [join(homedir(), '.local', 'bin'), join(homedir(), '.cargo', 'bin'), '/usr/local/bin']

/** Default directory holding out-of-tree tgrep indexes, under the drill cache root. */
export const DEFAULT_INDEX_DIR = join(cacheRoot(), 'tgrep')

/** Legacy index location used before the cache root was unified. */
const LEGACY_INDEX_DIR = join(homedir(), '.cache', 'tgrep-index')

/**
 * Stable directory name for one indexed root.
 *
 * @param root Absolute root path.
 * @returns A filesystem-safe slug that is stable across runs.
 */
export function indexSlug(root) {
  return root.replace(/^\/+/, '').replaceAll(/[^A-Za-z0-9._-]+/g, '-')
}

/**
 * The out-of-tree index directory for a root.
 *
 * @param root Absolute root path.
 * @param baseDir Index base directory; defaults to {@link DEFAULT_INDEX_DIR}.
 * @returns Absolute index directory path.
 */
export function indexDirFor(root, baseDir = DEFAULT_INDEX_DIR) {
  return join(baseDir, indexSlug(root))
}

/**
 * Read a tgrep index's metadata.
 *
 * @param dir Index directory.
 * @returns `{rootPath, files, trigrams, updatedAt}` or null when the directory holds no index.
 */
export function readIndexMeta(dir) {
  const metaPath = join(dir, 'meta.json')
  if (!existsSync(metaPath)) return null
  try {
    const raw = JSON.parse(readFileSync(metaPath, 'utf8'))
    return {
      rootPath: typeof raw.root_path === 'string' ? raw.root_path : null,
      files: Number.isInteger(raw.num_files) ? raw.num_files : null,
      trigrams: Number.isInteger(raw.num_trigrams) ? raw.num_trigrams : null,
      updatedAt: Number.isInteger(raw.updated_at) ? raw.updated_at : null,
    }
  } catch {
    return null
  }
}

/**
 * Whether an out-of-tree index covers a root.
 *
 * @param root Root the search will run against.
 * @param baseDir Index base directory.
 * @returns The index directory when a matching index exists, else null.
 */
export function indexFor(root, baseDir = DEFAULT_INDEX_DIR, options = {}) {
  const dir = indexDirFor(root, baseDir)
  const meta = readIndexMeta(dir)
  if (meta === null || meta.rootPath === null) return null
  if (meta.rootPath !== root) return null
  // Touching on use makes the time to live measure idleness, so indexes for
  // worktrees still being drilled survive while abandoned ones expire.
  if (options.touch !== false) touch(dir)
  return dir
}

/**
 * Remove tgrep indexes that have not been used within the time to live.
 *
 * @param options `baseDir`, `ttlMs`, `keepRoots`.
 * @returns `{ removed, freedBytes, kept }`.
 */
export function pruneIndexes(options = {}) {
  const baseDir = options.baseDir ?? DEFAULT_INDEX_DIR
  const keep = (options.keepRoots ?? []).map(root => indexSlug(root))
  const result = pruneDir(baseDir, { ttlMs: options.ttlMs ?? DEFAULT_TTL_MS, keep, now: options.now })
  return { removed: result.removed, freedBytes: result.freedBytes, kept: result.kept }
}

/**
 * Total size of the index cache.
 *
 * @param baseDir Index base directory.
 * @returns Size in bytes.
 */
export function indexesSize(baseDir = DEFAULT_INDEX_DIR) {
  return existsSync(baseDir) ? sizeOf(baseDir) : 0
}

/**
 * Absolute path of the pre-unification index cache, when it still exists.
 *
 * @returns The legacy directory path or null.
 */
export function legacyIndexDir() {
  return existsSync(LEGACY_INDEX_DIR) ? LEGACY_INDEX_DIR : null
}

/**
 * Build or refresh the out-of-tree index for a root.
 *
 * The index directory is created outside the repository, so the worktree gains
 * no untracked files and `git status` stays clean for the drill's own checks.
 *
 * @param options `root`, `baseDir`, `tgrepBin`, `force`, `pathEnv`, `timeoutMs`.
 * @returns `{ok, dir, meta, error}`.
 */
export function indexRoot(options) {
  const root = options.root
  const dir = indexDirFor(root, options.baseDir ?? DEFAULT_INDEX_DIR)
  const bin = resolveBin(options.tgrepBin ?? 'tgrep', options.pathEnv)
  if (bin === null) return { ok: false, dir, meta: null, error: 'tgrep is not available' }
  mkdirSync(dir, { recursive: true })
  const args = ['index', '--index-path', dir]
  if (options.force) args.push('--force')
  args.push(root)
  try {
    const stdout = execFileSync(bin, args, { encoding: 'utf8', timeout: options.timeoutMs ?? 600_000, maxBuffer: 8 * 1024 * 1024 })
    return { ok: true, dir, meta: readIndexMeta(dir), error: null, stdout: stdout.trim() }
  } catch (error) {
    return { ok: false, dir, meta: readIndexMeta(dir), error: String(error?.stderr ?? error?.message ?? error).trim().slice(0, 400) }
  }
}

/**
 * Resolve a configured binary name to an executable path.
 *
 * @param name Bare name or absolute path.
 * @param pathEnv PATH-like string; defaults to `process.env.PATH`.
 * @returns The resolved path, or null when nothing executable exists.
 */
export function resolveBin(name, pathEnv = process.env.PATH ?? '') {
  if (name.includes('/')) return existsSync(name) && statSync(name).isFile() ? name : null
  const dirs = [...pathEnv.split(delimiter).filter(Boolean), ...EXTRA_BIN_DIRS]
  for (const dir of dirs) {
    const candidate = join(dir, name)
    try {
      if (statSync(candidate).isFile()) return candidate
    } catch {
      // Not in this directory; keep looking.
    }
  }
  return null
}

/**
 * Choose the text-search engine for a root.
 *
 * `auto` prefers tgrep only when an index actually covers that root — in-tree
 * (`<root>/.tgrep`) or out-of-tree (`<indexDir>/<slug>`) — because an unindexed
 * tgrep run scans every file, warns, and is slower than ripgrep.
 *
 * @param options `engine`, `root`, `rgBin`, `tgrepBin`, `indexDir`, optional PATH override.
 * @returns `{ engine, bin, indexDir }` or null when neither engine is available.
 */
export function resolveEngine(options = {}) {
  const requested = options.engine ?? 'auto'
  const rg = resolveBin(options.rgBin ?? 'rg', options.pathEnv)
  const tgrep = resolveBin(options.tgrepBin ?? 'tgrep', options.pathEnv)
  const root = options.root
  const external = root === undefined ? null : indexFor(root, options.indexDir ?? DEFAULT_INDEX_DIR)
  const inTree = root !== undefined && existsSync(join(root, '.tgrep')) ? join(root, '.tgrep') : null
  const indexDir = external ?? inTree

  if (requested === 'rg') return rg === null ? null : { engine: 'rg', bin: rg, indexDir: null }
  if (requested === 'tgrep') return tgrep === null ? null : { engine: 'tgrep', bin: tgrep, indexDir }
  if (tgrep !== null && indexDir !== null) return { engine: 'tgrep', bin: tgrep, indexDir }
  if (rg !== null) return { engine: 'rg', bin: rg, indexDir: null }
  return tgrep === null ? null : { engine: 'tgrep', bin: tgrep, indexDir: null }
}

/**
 * Parse one ripgrep-compatible JSON line into a hit, or null for other events.
 *
 * Both rg and tgrep emit `{type:'match', data:{path:{text}, line_number, lines:{text}, submatches:[{start}]}}`.
 *
 * @param line One JSON line.
 * @returns `{file, line, column, text}` or null.
 */
export function parseJsonLine(line) {
  const trimmed = line.trim()
  if (trimmed === '' || !trimmed.startsWith('{')) return null
  let event
  try {
    event = JSON.parse(trimmed)
  } catch {
    return null
  }
  if (event?.type !== 'match') return null
  const file = event.data?.path?.text
  if (typeof file !== 'string') return null
  const text = typeof event.data?.lines?.text === 'string' ? event.data.lines.text.replace(/\n$/, '') : ''
  const start = event.data?.submatches?.[0]?.start
  return {
    file,
    line: Number.isInteger(event.data?.line_number) ? event.data.line_number : null,
    column: Number.isInteger(start) ? start + 1 : null,
    text: text.split('\n')[0].slice(0, 400),
  }
}

/**
 * Run a text search and return labelled hits.
 *
 * @param options Search request.
 * @param options.pattern Regex or literal pattern.
 * @param options.root Directory to search.
 * @param options.glob Optional glob filter (repeatable in the underlying engine).
 * @param options.fixed Treat the pattern as a literal string.
 * @param options.word Whole-word matching.
 * @param options.ignoreCase Case-insensitive matching.
 * @param options.maxCount Cap on returned hits.
 * @param options.engine `auto` | `rg` | `tgrep`.
 * @param options.rgBin, options.tgrepBin Binary names or paths.
 * @param options.pathEnv PATH override used to resolve binaries.
 * @param options.timeoutMs Command timeout.
 * @returns `{ engine, bin, hits, truncated, error }`.
 */
export function searchText(options) {
  const root = options.root
  const resolved = resolveEngine({ engine: options.engine, root, rgBin: options.rgBin, tgrepBin: options.tgrepBin, indexDir: options.indexDir, pathEnv: options.pathEnv })
  if (resolved === null) return { engine: null, bin: null, hits: [], truncated: false, error: 'neither rg nor tgrep is available' }

  const args = ['--json', '--no-heading', '--with-filename']
  if (resolved.engine === 'tgrep' && resolved.indexDir !== null) args.push('--index-path', resolved.indexDir)
  if (options.fixed) args.push('--fixed-strings')
  if (options.word) args.push('--word-regexp')
  if (options.ignoreCase) args.push('--ignore-case')
  if (options.glob) args.push('--glob', options.glob)
  if (options.maxCount) args.push('--max-count', String(options.maxCount))
  args.push('--', options.pattern, root ?? '.')

  let raw = ''
  try {
    raw = execFileSync(resolved.bin, args, { encoding: 'utf8', timeout: options.timeoutMs ?? 30_000, maxBuffer: 32 * 1024 * 1024 })
  } catch (error) {
    // rg exits 1 when nothing matched; that is an empty result, not a failure.
    if (error?.status === 1 && typeof error.stdout === 'string') raw = error.stdout
    else if (error?.status === 2) return { engine: resolved.engine, bin: resolved.bin, indexDir: resolved.indexDir, hits: [], truncated: false, error: String(error.stderr ?? error.message).trim().slice(0, 300) }
    else if (typeof error?.stdout === 'string') raw = error.stdout
    else return { engine: resolved.engine, bin: resolved.bin, indexDir: resolved.indexDir, hits: [], truncated: false, error: String(error?.message ?? error).slice(0, 300) }
  }

  if (resolved.engine === 'tgrep' && resolved.indexDir !== null) touch(resolved.indexDir)

  const hits = []
  for (const line of raw.split('\n')) {
    const hit = parseJsonLine(line)
    if (hit) hits.push(hit)
  }
  const max = options.maxHits ?? 200
  const truncated = hits.length > max
  return { engine: resolved.engine, bin: resolved.bin, indexDir: resolved.indexDir, hits: truncated ? hits.slice(0, max) : hits, truncated, error: null }
}

/** Rust definition keywords used by the localization fallback. */
export const RUST_DEFINITION_KEYWORDS = ['fn', 'struct', 'enum', 'trait', 'union', 'impl', 'mod', 'type', 'const', 'static', 'macro_rules!']

/**
 * Build a definition-site pattern for a symbol name.
 *
 * This is deliberately loose: it is a text heuristic that produces candidates
 * for a human or the model to confirm, never a claim about the resolved symbol.
 *
 * @param symbol Symbol name.
 * @param language `rust` (default) or `generic`.
 * @returns A regex string.
 */
export function definitionPattern(symbol, language = 'rust') {
  const escaped = symbol.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&')
  if (language !== 'rust') return `\\b${escaped}\\b`
  const keywords = RUST_DEFINITION_KEYWORDS.map(keyword => keyword.replace('!', '\\!')).join('|')
  return `^\\s*(?:pub(?:\\([^)]*\\))?\\s+)?(?:async\\s+)?(?:unsafe\\s+)?(?:const\\s+)?(?:${keywords})\\s+${escaped}\\b`
}
````

## `package.json`

sha256 `4a51ec81014972df5c681034f7740e3a7f69e3cbd1d16b68adcb517d06dbe011` · 70 lines

````json
{
  "name": "dsh-drill",
  "version": "0.8.3",
  "description": "Evidence-gated bug-fix drill for DeepSeek Harness: failure signal to symbols, stage gates that a negative lookup cannot satisfy, plugin-run red/green proofs bound to a commit, c2g localization with a tgrep fallback, and a PR body rendered from the ledger.",
  "type": "module",
  "main": "./index.js",
  "exports": {
    ".": "./index.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "index.js",
    "lib",
    "skills",
    "roles",
    "cordis.patch.yml",
    "core/pr_craft.py",
    "README.md"
  ],
  "dsh": {
    "manifestVersion": 1,
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "scripts": {
    "test": "node --test test/*.test.js",
    "bundle": "node tools/build-source-bundle.mjs",
    "prepublishOnly": "npm test"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-tools": ">=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0",
    "@deepseek-ai/dsh-llm": ">=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0",
    "@deepseek-ai/dsh-subagent": ">=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0",
    "@deepseek-ai/schemastery": ">=3.18.0 <4.0.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-subagent": {
      "optional": true
    }
  },
  "engines": {
    "node": ">=22.19"
  },
  "keywords": [
    "dsh",
    "deepseek-harness",
    "plugin",
    "code-review",
    "bug-fix",
    "code2graph",
    "evidence",
    "drill"
  ],
  "license": "MIT",
  "author": "EnRaiha",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/EnRaiha/dsh-drill-kit.git"
  },
  "homepage": "https://github.com/EnRaiha/dsh-drill-kit#readme",
  "bugs": {
    "url": "https://github.com/EnRaiha/dsh-drill-kit/issues"
  },
  "publishConfig": {
    "access": "public"
  }
}
````

## `roles/drill-auditor.md`

sha256 `107e089732dc15796a068e014f009b9654c05cf5606907e42eb3e2734b1c16c2` · 55 lines

````markdown
---
name: drill-auditor
displayName: Drill Auditor (Review 2)
description: "Read-only parity auditor for one drill branch before push: test-inventory parity, caller closure, producer/consumer enumeration, invariant chokepoints, module contracts, repo norms, PR format. Returns a verdict table with command evidence."
whenToUse: "Delegate after the green proof and preflight pass, before the PR is pushed. The auditor must never be the agent that wrote the code."
tools: [read, grep, glob, bash]
maxToolCalls: 80
maxToolCallsScope: delegation
onToolCallBudget: wrap-up
graceToolCalls: 2
---

You are **Review 2**: a fresh-session, read-only structural auditor for one NodeDB drill branch. You did not write this code, so never trust the branch narrative or the PR description — count things, run commands, and report evidence.

## Mandate

- **Read-only.** No edits, no commits, no pushes, no branch changes, no `git checkout`, no writes anywhere. You may run read-only `git`, `cargo check`/`nextest list`, `grep`, and `gh` reads.
- **Evidence, not opinion.** Every verdict needs the command and its output. If something cannot be verified, write `UNVERIFIED` and say why. A plausible reading is not a verdict.
- **Report incrementally.** Print each checklist section as it finishes, then repeat the table in your final message. Do not save the whole report for a closing call that may fail.

## Input

- `repo` — the drill worktree (not the main checkout).
- `base` — usually `origin/main`.
- scope — the files/modules the branch changed (`git diff --name-only <base>...HEAD`).

## Checklist

Follow `~/.hermes/skills/devops/nodedb-parity-audit/SKILL.md` exactly:

1. **Test inventory parity** — no `mod` removed from `nodedb/tests/wire/cases/mod.rs`, no test file deleted or renamed away.
2. **Caller closure** — for every moved or changed function, enumerate its callers and confirm each still resolves.
3. **Producer/consumer enumeration** — for every changed type, list producers and consumers; a changed invariant must reach all of them.
4. **Invariant chokepoints** — must-fail combinations actually fail; run them, do not reason about them.
5. **Module contracts** — `balanced_gate`, cursors, `mod.rs` registration, the 500-line cap.
6. **Repo norms** — `bash ~/scripts/nodedb-preflight.sh <repo> <base>` must exit 0; report its VIOLATION lines verbatim.
7. **PR format** — one issue per PR, red-on-main test stated, exclusions stated, no issue numbers inside code or commit messages.

## Output

```text
## Verdict: PASS | FAIL (n blockers)

| # | item | verdict | command | evidence |
|---|------|---------|---------|----------|

## Blockers
- <one line each, with file:line and the command that shows it>

## Unverified
- <item + why it could not be verified>
```

Rules for the verdict: any blocker means `FAIL`. Do not soften a FAIL into a warning. Do not list style nits as blockers. If a checklist item is out of scope for this branch, say so explicitly rather than marking it PASS.
````

## `skills/drill/SKILL.md`

sha256 `5b4c9a06a6dc254b60798f2f3a4538de3b04a17b2e62a01dfc17c85c0e3429c5` · 68 lines

````markdown
---
name: drill
description: "Evidence-gated bug-fix drill for one issue: localize, map blast radius, enumerate edge cases, prove red, prove green, pass preflight and Review 2, then build the PR. Writes a per-task evidence ledger and refuses completion claims without proofs. Trigger on 'drill', 'bug drill', 'red proof', 'red/green', 'fix issue', 'issue drill', 'drill task'."
---

# Drill — evidence-gated bug fixing

Satu issue, satu worktree, satu rantaian bukti. Skill ini mengikat gate kepada **artifak**, bukan kepada naratif: setiap fasa mesti tinggalkan rekod dalam ledger, dan `drill_gate` menolak "siap" yang tak ada bukti.

Sebab ia wujud: kerja drill lama bergantung pada disiplin — red proof ditulis tangan, log hilang, review dua pusingan lupa, dan laporan test phase ditulis dari ingatan. Empat defect itu semua hidup di persimpangan antara fasa, bukan dalam kod yang dibaiki.

## Bila guna

- Ada nombor issue + repo (worktree) + base (`origin/main`).
- Kerja akan berakhir sebagai satu PR.
- Kamu sanggup tunjuk bukti untuk setiap dakwaan.

Kalau kerja itu penerokaan atau spike, **jangan** guna drill — tak ada gate yang berguna.

## Fasa (jangan lompat)

| # | Fasa | Rekod yang wajib | Tool |
|---|---|---|---|
| 1 | **Localize** — cari tapak sebenar dari stack trace/log | `drill_record kind=locate` dengan `files` (path:line) | **`drill_error`** (signal → frame → symbol) · `drill_locate` · `drill_search` |
| 2 | **Blast radius** — pemanggil, callee, jenis terjejas | `drill_record kind=blast` dengan `files`/`symbols` | `drill_blast` (symbol) + `drill_diff` (fail berubah + dependent) |
| 3 | **Edge cases** — invarian yang mesti gagal | `drill_record kind=edge` dengan `text` | fikir, senaraikan (checklist dari `drill_diff` sebagai input) |
| 4 | **Patch** — red dulu, baru hijau | `drill_run arm=base` (mesti **exit ≠ 0**), kemudian `drill_run arm=fix` (mesti exit 0) | `nodedb-cargo.sh` |
| 5 | **Hygiene** — fmt, clippy, preflight | `drill_run kind=hygiene` exit 0 | `nodedb-preflight.sh` |
| 6 | **Review 2** — auditor segar, read-only | `drill_review` (role `drill-auditor`) | subagent + role file |
| 7 | **PR** — badan PR dijana dari ledger, lint bersih, baru push | `drill_record kind=pr bodyPath=…` | **`drill_pr`** (jana + lint `pr_craft.py`) · `gh` |

## Perintah asas

```
drill_start   task=issue296 repo=~/projects/nodedb-296 base=origin/main issue=296
drill_status  task=issue296
drill_run     task=issue296 arm=base cmd="bash ~/scripts/nodedb-cargo.sh . nextest run -p nodedb --test wire -E 'test(~graph_cursor)'"
drill_gate    task=issue296            # apa lagi tinggal sebelum boleh kata siap
drill_report  task=issue296            # tulis .drill/issue296/report.md
```

`drill_run` **menjalankan** perintah itu sendiri, menangkap output ke `.drill/<task>/logs/`, dan merekod exit code + sha256 log. Kamu tak boleh "lapor" red proof — sama ada perintah itu gagal, atau gate kekal tertutup.

## Kontrak keras

1. **Red dulu, hijau kemudian.** Test yang lulus atas base ialah *guard*, bukan bukti. Kalau `drill_gate` tunjuk `red` masih ⬜, jangan tulis fix.
2. **Log atau tak wujud.** Rekod `test`/`hygiene` tanpa fail log bukan kosong — ia ditolak.
3. **Bukti diikat pada commit.** `drill_run` dan `drill_review` merekod `head` (SHA). Kalau HEAD bergerak selepas review, gate `review` **terbuka semula** — review semula commit yang kau nak push.
4. **Jangan lapor siap semasa gate terbuka.** Panggil `drill_gate`; kalau `ready=false`, sebut gate mana yang tinggal, jangan ganti dengan ayat "should work".
5. **Review 2 dalam sesi segar, ikut role file.** Auditor tak boleh jadi penulis kod. `drill_review` baca role `drill-auditor` (project `.dsh/roles` → `~/.dsh/roles` → bundled), jadi persona, tool policy (read-only) dan budget datang dari fail, bukan dari ingatan.
6. **Mula dari signal, bukan tekaan.** Ada panic/backtrace/log? `drill_error` dulu — ia resolve setiap frame jadi symbol. Frame `/rustc/`, `~/.cargo/registry/` ditanda *external*, bukan direka.
7. **Badan PR dari bukti.** `drill_pr` jana badan dari ledger dan lint guna `~/scripts/pr_craft.py`; gate `pr` cuma tertutup bila lint takde blocker. Jangan tulis badan PR dari ingatan.
8. **Satu issue satu PR.** Badan PR: defect + fix + cara uji + bukti regresi. `Fixes #<n>`. Nombor issue tak muncul dalam kod atau mesej commit.
7. **Fallback dilabel ikut lapisan.** Kalau cache c2g per-worktree tiada, plugin guna **merged store `~/Embed/c2g/graph_index.sqlite`** — itu graf sebenar (link resolved), tapi **snapshot**, bukan HEAD worktree kau; rekod bawa masa build dia. Lepas tu baru tgrep/rg: itu *occurrence*, bukan call site — jangan dakwa "caller" dari hasil teks.
9. **Env repo dihormati.** Guna `~/scripts/nodedb-cargo.sh <worktree> …` (target per-worktree, sccache, `RUST_MIN_STACK`), bukan `cargo` kosong.

## Bentuk laporan

`drill_report` menjana jadual gate + jadual bukti test (arm, exit, cmd, log, sha256) + verdict. Salin ke `Bumi-Hijau/wiki/nodedb/NODEDB-TEST-PHASE-REPORT-<date>.md` bila fasa patch selesai, dan verdict Review 2 ke `NODEDB-REVIEW2-<NNN>-<date>.md` seperti biasa.

## Mod kegagalan yang skill ini tutup

- Fix ditulis sebelum red proof wujud → gate `red` kekal ⬜.
- "Test lulus" tanpa log → rekod ditolak (`no readable, non-empty log`).
- Review 2 dilangkau → gate `review` kekal ⬜.
- Review 2 lepas kemudian FAIL → gate dibuka semula (rekod terakhir yang menang).
- Preflight dilangkau → gate `hygiene` kekal ⬜.
````

## `tools/build-source-bundle.mjs`

sha256 `7bc478d7e66691927b554f4eedcebfc4595507ab543beb074e06cfc21a783295` · 98 lines

````javascript
#!/usr/bin/env node
/**
 * Regenerate docs/DRILL-PLUGIN-SOURCE-BUNDLE-<date>.md from the committed revision.
 *
 * The bundle exists so a reviewer who cannot clone the repo can still audit the
 * plugin: every tracked file inline, each with its sha256 and line count, plus
 * the declared test count per test file and the recorded `node --test` run.
 *
 * Usage: node tools/build-source-bundle.mjs
 */
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { appendFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = join(dirname(fileURLToPath(import.meta.url)), '..')
const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' }).trim()

// `--others --exclude-standard` keeps this usable before the first commit; docs/ is skipped
// except its index, so the bundle never embeds itself or the specification it describes.
const tracked = git('ls-files', '--cached', '--others', '--exclude-standard')
  .split('\n').filter(Boolean)
  .filter(p => !p.startsWith('docs/') || p === 'docs/README.md')
  .sort()
const tests = tracked.filter(p => p.startsWith('test/') && p.endsWith('.test.js'))
const files = [
  ...tracked.filter(p => !p.startsWith('test/')),
  ...tests,
]

const sha = p => createHash('sha256').update(readFileSync(join(repo, p))).digest('hex')
const lines = p => readFileSync(join(repo, p), 'utf8').split('\n').length
const declaredTests = p => readFileSync(join(repo, p), 'utf8').split('\n').filter(l => l.startsWith('test(')).length

// Record the revision that last touched the *sources*, not HEAD: committing the
// bundle moves HEAD, which would make every regeneration differ by construction.
const commit = git('log', '-1', '--format=%H', '--', '.', ':(exclude)docs/DRILL-PLUGIN-SOURCE-BUNDLE-*.md')
const branch = git('branch', '--show-current')
// The bundle is a generated artifact that lives in the repo, so it always shows up
// as dirty while being regenerated. Ignore its own path when judging the tree, or
// every bundle would claim it was built from a dirty checkout.
const bundlePath = `docs/DRILL-PLUGIN-SOURCE-BUNDLE-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}.md`
const dirty = git('status', '--porcelain').split('\n').filter(l => l.trim() !== '' && !l.endsWith(bundlePath)).join('\n')
const version = JSON.parse(readFileSync(join(repo, 'package.json'), 'utf8')).version

const suite = (() => {
  const out = execFileSync('node', ['--test', ...tests.map(p => join(repo, p))], { encoding: 'utf8' })
  // duration_ms is omitted on purpose: it changes every run, and a generated artifact
  // that differs on every regeneration cannot be verified by diff.
  return out.split('\n').filter(l => /^# (tests|pass|fail)/.test(l) || l.startsWith('not ok')).join('\n')
})()

const totalTests = tests.reduce((sum, p) => sum + declaredTests(p), 0)
const date = new Date().toISOString().slice(0, 10).replaceAll('-', '')
const out = join(repo, 'docs', `DRILL-PLUGIN-SOURCE-BUNDLE-${date}.md`)

const lang = p => p.endsWith('.js') || p.endsWith('.mjs') ? 'javascript'
  : p.endsWith('.yml') ? 'yaml'
  : p.endsWith('.json') ? 'json'
  : 'markdown'

const head = `# dsh-drill-kit — complete source bundle for review

*Revision: **v${version}**, source revision \`${commit.slice(0, 12)}\` on branch \`${branch}\`, tree ${dirty === '' ? 'clean' : 'DIRTY'} (the revision that last touched the files below, not HEAD — the bundle itself is committed after them). Generated ${date}. Every file below is the exact committed content at that revision; the sha256 in the inventory lets a reviewer confirm the exact bytes.*

**Why this file exists.** A review that only receives \`index.js\` cannot judge the twelve \`lib/*.js\` modules the host imports, the nine test files that pin the behaviour, or the skill/role text the reviewer subagent is driven by — that is where the gates, the ledger, the c2g resolver and the audit persona actually live. This bundle carries every tracked file, so a line-by-line review can cover the whole kit, and it records the test run so a read-only reviewer does not have to execute anything.

## Inventory

| File | Lines | Bytes | sha256 (first 16) | Tests declared |
|---|---|---|---|---|
${files.map(p => `| \`${p}\` | ${lines(p)} | ${readFileSync(join(repo, p)).length} | \`${sha(p).slice(0, 16)}\` | ${p.startsWith('test/') ? declaredTests(p) : '—'} |`).join('\n')}

**Totals:** ${files.reduce((s, p) => s + lines(p), 0)} lines across ${files.length} files; ${totalTests} tests declared across ${tests.length} test files.

## The test run, recorded

\`\`\`text
$ node --test test/*.test.js
${suite}
$ exit 0
\`\`\`

All ${totalTests} pass, 0 fail. The suite needs the host packages reachable from this checkout (\`@deepseek-ai/dsh-tools\`); when they are not, \`integration.test.js\` skips itself instead of failing, so a consumer running it standalone sees a smaller count rather than a false red.

---

`

writeFileSync(out, head)
for (const p of files) {
  appendFileSync(out, `## \`${p}\`\n\nsha256 \`${sha(p)}\` · ${lines(p)} lines\n\n\`\`\`\`${lang(p)}\n${readFileSync(join(repo, p), 'utf8').replace(/\n$/, '')}\n\`\`\`\`\n\n`)
}
console.log(`wrote ${out}`)
console.log(`${files.length} files, ${totalTests} tests declared`)
````

## `test/c2g.test.js`

sha256 `eda73b53ef16bf6131bae37e2efa1fb341e5fa944cc37f7ff961701b82febe93` · 162 lines

````javascript
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'

import { callers, callees, discoverDb, impact, locateByFrame, locateByName, query, sqlStr } from '../lib/c2g.js'

const root = mkdtempSync(join(tmpdir(), 'drill-c2g-'))
after(() => rmSync(root, { recursive: true, force: true }))

const projectDir = join(root, 'projects', 'deadbeef')
const dbPath = join(projectDir, 'cache.sqlite3')
mkdirSync(projectDir, { recursive: true })

const REPO = '/tmp/fake-nodedb'

const sql = `
CREATE TABLE meta (singleton INTEGER PRIMARY KEY, application_identity TEXT NOT NULL, canonical_root BLOB NOT NULL, project_key BLOB NOT NULL);
CREATE TABLE graph_snapshots (snapshot_id INTEGER PRIMARY KEY, resolver_tier TEXT NOT NULL, created_at_ns INTEGER NOT NULL);
CREATE TABLE active_snapshots (resolver_tier TEXT NOT NULL, completeness INTEGER NOT NULL, snapshot_id INTEGER NOT NULL, PRIMARY KEY (resolver_tier, completeness));
CREATE TABLE graph_symbols (snapshot_id INTEGER NOT NULL, ordinal INTEGER NOT NULL, id BLOB NOT NULL, scip TEXT NOT NULL, name TEXT NOT NULL, file TEXT NOT NULL, span_start INTEGER NOT NULL, span_end INTEGER NOT NULL, kind TEXT NOT NULL, symbol BLOB NOT NULL, PRIMARY KEY (snapshot_id, ordinal));
CREATE TABLE graph_edges (snapshot_id INTEGER NOT NULL, from_ord INTEGER NOT NULL, to_ord INTEGER NOT NULL, role TEXT NOT NULL, occurrence_file TEXT NOT NULL, occurrence_line INTEGER NOT NULL, confidence REAL NOT NULL);
INSERT INTO meta VALUES (1, 'code2graph-cache', '${REPO}', x'00');
INSERT INTO graph_snapshots VALUES (7, 'scope', 0);
INSERT INTO active_snapshots VALUES ('scope', 1, 7);
INSERT INTO graph_symbols VALUES
  (7, 1, x'01', 'a', 'caller_fn',  'src/a.rs', 10, 40, '"Function"', '{"line":10}'),
  (7, 2, x'02', 'b', 'target_fn',  'src/b.rs', 5,  30, '"Function"', '{"line":5}'),
  (7, 3, x'03', 'c', 'leaf_fn',    'src/c.rs', 1,   9, '"Function"', '{"line":1}'),
  (7, 4, x'04', 'd', 'target_fn',  'other/b.rs', 3, 20, '"Function"', '{"line":3}');
INSERT INTO graph_edges VALUES
  (7, 1, 2, '"Call"', 'src/a.rs', 22, 0.9),
  (7, 2, 3, '"Call"', 'src/b.rs', 12, 0.8),
  (7, 1, 3, '"Read"', 'src/a.rs', 25, 0.5);
`

execFileSync('sqlite3', [dbPath], { input: sql })

test('sqlStr escapes single quotes', () => {
  assert.equal(sqlStr("o'brien"), "'o''brien'")
})

test('discoverDb finds the cache by canonical_root, not by path hash', () => {
  const found = discoverDb(REPO, join(root, 'projects'))
  assert.ok(found, 'cache should be discovered')
  assert.equal(found.db, dbPath)
  assert.equal(found.snapshotId, 7)
})

test('discoverDb matches a subdirectory of the indexed root', () => {
  const found = discoverDb(`${REPO}/crates/inner`, join(root, 'projects'))
  assert.equal(found?.db, dbPath)
})

test('discoverDb returns null for an unindexed repository', () => {
  assert.equal(discoverDb('/tmp/somewhere-else', join(root, 'projects')), null)
})

test('locateByName decodes the JSON-encoded kind and reads the line from the symbol blob', () => {
  const rows = locateByName(dbPath, 'target_fn')
  assert.equal(rows.length, 2, 'duplicate names across crates are both returned')
  assert.equal(rows[0].kind, 'Function', 'kind arrives JSON-quoted in the db and must be decoded')
  assert.equal(rows.find(r => r.file === 'src/b.rs').line, 5, 'line lives in the symbol json, not the span offsets')
})

test('locateByName narrows to one file when the name repeats', () => {
  const rows = locateByName(dbPath, 'target_fn', { file: 'other/b.rs' })
  assert.equal(rows.length, 1)
  assert.equal(rows[0].file, 'other/b.rs')
})

test('locateByFrame picks the nearest definition at or above the frame line', () => {
  const hit = locateByFrame(dbPath, 'src/a.rs', 27)
  assert.equal(hit.name, 'caller_fn')
  assert.equal(hit.line, 10)
  assert.equal(locateByFrame(dbPath, 'src/a.rs', 5), undefined, 'a line above every definition has no owner')
})

test('callers and callees walk call edges only, not read edges', () => {
  const up = callers(dbPath, 'target_fn', { file: 'src/b.rs' })
  assert.deepEqual(up.map(r => r.caller), ['caller_fn'])
  const down = callees(dbPath, 'target_fn', { file: 'src/b.rs' })
  assert.deepEqual(down.map(r => r.callee), ['leaf_fn'])
  const leaf = callees(dbPath, 'caller_fn')
  assert.deepEqual(leaf.map(r => r.callee), ['target_fn'], 'the Read edge to leaf_fn must not appear as a callee')
})

test('impact walks transitive callers to a bounded depth', () => {
  const rows = impact(dbPath, 'leaf_fn', { depth: 2 })
  const byDepth = rows.map(r => `${r.depth}:${r.caller}`).sort()
  assert.deepEqual(byDepth, ['1:target_fn', '2:caller_fn'])
  const shallow = impact(dbPath, 'leaf_fn', { depth: 1 })
  assert.deepEqual(shallow.map(r => r.caller), ['target_fn'])
})

test('unknown symbols resolve to no rows rather than throwing', () => {
  assert.deepEqual(callers(dbPath, 'nope'), [])
  assert.deepEqual(impact(dbPath, 'nope'), [])
})

test('query refuses to write through the read-only connection', () => {
  assert.throws(() => query(dbPath, "INSERT INTO meta VALUES (2,'x','y',x'00')"), /readonly|attempt to write/i)
})

// Upstream keys `active_snapshots` by (resolver_tier, completeness) with
// completeness IN (0,1), so a tier can hold a partial snapshot and a complete
// one at once. The queries must read exactly one of them, and prefer the
// complete graph.
const twoSlotDir = join(root, 'projects', 'twoslot')
const twoSlotDb = join(twoSlotDir, 'cache.sqlite3')
mkdirSync(twoSlotDir, { recursive: true })
const REPO_TWO = '/tmp/fake-two-slot'
execFileSync('sqlite3', [twoSlotDb], { input: `
CREATE TABLE meta (singleton INTEGER PRIMARY KEY, application_identity TEXT NOT NULL, canonical_root BLOB NOT NULL, project_key BLOB NOT NULL);
CREATE TABLE graph_snapshots (snapshot_id INTEGER PRIMARY KEY, resolver_tier TEXT NOT NULL, created_at_ns INTEGER NOT NULL);
CREATE TABLE active_snapshots (resolver_tier TEXT NOT NULL, completeness INTEGER NOT NULL, snapshot_id INTEGER NOT NULL, PRIMARY KEY (resolver_tier, completeness));
CREATE TABLE graph_symbols (snapshot_id INTEGER NOT NULL, ordinal INTEGER NOT NULL, id BLOB NOT NULL, scip TEXT NOT NULL, name TEXT NOT NULL, file TEXT NOT NULL, span_start INTEGER NOT NULL, span_end INTEGER NOT NULL, kind TEXT NOT NULL, symbol BLOB NOT NULL, PRIMARY KEY (snapshot_id, ordinal));
CREATE TABLE graph_edges (snapshot_id INTEGER NOT NULL, from_ord INTEGER NOT NULL, to_ord INTEGER NOT NULL, role TEXT NOT NULL, occurrence_file TEXT NOT NULL, occurrence_line INTEGER NOT NULL, confidence REAL NOT NULL);
INSERT INTO meta VALUES (1, 'code2graph-cache', '${REPO_TWO}', x'00');
INSERT INTO graph_snapshots VALUES (8, 'scope', 1), (9, 'scope', 2);
INSERT INTO active_snapshots VALUES ('scope', 0, 8), ('scope', 1, 9);
INSERT INTO graph_symbols VALUES
  (8, 1, x'11', 'p', 'partial_only', 'src/partial.rs', 1, 9, '"Function"', '{"line":1}'),
  (9, 1, x'21', 'q', 'shared_fn',   'src/shared.rs', 1, 9, '"Function"', '{"line":1}'),
  (9, 2, x'22', 'r', 'complete_only','src/complete.rs', 1, 9, '"Function"', '{"line":1}');
INSERT INTO graph_edges VALUES (9, 1, 2, '"Call"', 'src/shared.rs', 4, 0.9);
` })

test('a tier with a partial and a complete snapshot resolves to the complete one', () => {
  const found = discoverDb(REPO_TWO, join(root, 'projects'))
  assert.equal(found?.snapshotId, 9, 'the complete snapshot (completeness 1) is the one that answers')
  assert.equal(found?.completeness, 1)

  assert.deepEqual(locateByName(twoSlotDb, 'complete_only').map(r => r.file), ['src/complete.rs'])
  assert.deepEqual(locateByName(twoSlotDb, 'shared_fn').map(r => r.file), ['src/shared.rs'])
  assert.deepEqual(locateByName(twoSlotDb, 'partial_only'), [], 'rows from the partial snapshot never leak into an answer')
  assert.deepEqual(callers(twoSlotDb, 'complete_only').map(r => r.caller), ['shared_fn'], 'edges resolve inside the same snapshot')
})

test('a cache holding only a partial snapshot still answers, and says it is partial', () => {
  const partialDir = join(root, 'projects', 'partialonly')
  const partialDb = join(partialDir, 'cache.sqlite3')
  mkdirSync(partialDir, { recursive: true })
  execFileSync('sqlite3', [partialDb], { input: `
CREATE TABLE meta (singleton INTEGER PRIMARY KEY, application_identity TEXT NOT NULL, canonical_root BLOB NOT NULL, project_key BLOB NOT NULL);
CREATE TABLE graph_snapshots (snapshot_id INTEGER PRIMARY KEY, resolver_tier TEXT NOT NULL, created_at_ns INTEGER NOT NULL);
CREATE TABLE active_snapshots (resolver_tier TEXT NOT NULL, completeness INTEGER NOT NULL, snapshot_id INTEGER NOT NULL, PRIMARY KEY (resolver_tier, completeness));
CREATE TABLE graph_symbols (snapshot_id INTEGER NOT NULL, ordinal INTEGER NOT NULL, id BLOB NOT NULL, scip TEXT NOT NULL, name TEXT NOT NULL, file TEXT NOT NULL, span_start INTEGER NOT NULL, span_end INTEGER NOT NULL, kind TEXT NOT NULL, symbol BLOB NOT NULL, PRIMARY KEY (snapshot_id, ordinal));
CREATE TABLE graph_edges (snapshot_id INTEGER NOT NULL, from_ord INTEGER NOT NULL, to_ord INTEGER NOT NULL, role TEXT NOT NULL, occurrence_file TEXT NOT NULL, occurrence_line INTEGER NOT NULL, confidence REAL NOT NULL);
INSERT INTO meta VALUES (1, 'code2graph-cache', '/tmp/fake-partial-only', x'00');
INSERT INTO graph_snapshots VALUES (5, 'scope', 1);
INSERT INTO active_snapshots VALUES ('scope', 0, 5);
INSERT INTO graph_symbols VALUES (5, 1, x'31', 's', 'lonely_fn', 'src/lonely.rs', 1, 9, '"Function"', '{"line":1}');
` })
  const found = discoverDb('/tmp/fake-partial-only', join(root, 'projects'))
  assert.equal(found?.snapshotId, 5, 'a partial snapshot is still coverage')
  assert.equal(found?.completeness, 0, 'and it reports itself as partial')
  assert.deepEqual(locateByName(partialDb, 'lonely_fn').map(r => r.file), ['src/lonely.rs'])
})
````

## `test/cache.test.js`

sha256 `4fbd474745ef55fe4608713de7f9cf25c74c6379d67b89c35c7dcda52cf5889b` · 218 lines

````javascript
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'

import { DEFAULT_TTL_MS, cacheRoot, pruneDir, readCache, sizeOf, touch, writeCache } from '../lib/cache.js'
import { clearDiscovery, discoverDb, forgetDiscovery } from '../lib/c2g.js'
import { indexDirFor, indexFor, indexRoot, pruneIndexes, resolveBin } from '../lib/search.js'

const root = mkdtempSync(join(tmpdir(), 'drill-cache-'))
after(() => rmSync(root, { recursive: true, force: true }))

const DAY = 24 * 60 * 60 * 1000
/** Backdate a path so the TTL sees it as idle. */
const age = (path, ms) => {
  const when = new Date(Date.now() - ms)
  utimesSync(path, when, when)
}

test('the cache root defaults away from /tmp and honours an override', () => {
  assert.equal(cacheRoot(''), join(process.env.XDG_CACHE_HOME ?? join(process.env.HOME, '.cache'), 'dsh-drill'))
  assert.ok(!cacheRoot('').startsWith('/tmp'), 'derived data must not live in a wiped directory')
  assert.equal(cacheRoot('/custom/cache'), '/custom/cache')
})

test('a cache entry expires by idleness, and a touch extends its life', () => {
  const path = join(root, 'entry.json')
  writeCache(path, { hello: 'world' })
  assert.deepEqual(readCache(path, DEFAULT_TTL_MS), { hello: 'world' })

  age(path, 8 * DAY)
  assert.equal(readCache(path, DEFAULT_TTL_MS), null, 'idle for more than a week reads as absent')

  touch(path)
  assert.deepEqual(readCache(path, DEFAULT_TTL_MS), { hello: 'world' }, 'a touch resets the idle clock')

  assert.deepEqual(readCache(path, 0), { hello: 'world' }, 'ttl 0 disables expiry')
  assert.equal(readCache(join(root, 'missing.json'), DEFAULT_TTL_MS), null)
})

test('pruneDir removes only idle entries and protects the keep list', () => {
  const dir = join(root, 'entries')
  mkdirSync(join(dir, 'stale'), { recursive: true })
  writeFileSync(join(dir, 'stale', 'blob.bin'), 'x'.repeat(2048))
  mkdirSync(join(dir, 'fresh'), { recursive: true })
  writeFileSync(join(dir, 'fresh', 'blob.bin'), 'y'.repeat(512))
  mkdirSync(join(dir, 'protected'), { recursive: true })
  age(join(dir, 'stale'), 10 * DAY)
  age(join(dir, 'protected'), 10 * DAY)

  const result = pruneDir(dir, { ttlMs: DEFAULT_TTL_MS, keep: ['protected'] })
  assert.deepEqual(result.removed, ['stale'])
  assert.ok(result.freedBytes >= 2048, 'the freed size is reported')
  assert.ok(result.kept.includes('fresh'))
  assert.ok(result.kept.includes('protected'))
  assert.equal(existsSync(join(dir, 'stale')), false)
  assert.equal(existsSync(join(dir, 'protected')), true)
  assert.ok(sizeOf(dir) >= 512)
})

test('c2g discovery is cached, expires, and can be forgotten', () => {
  const c2gDir = join(root, 'c2g-projects', 'proj')
  const drillCache = join(root, 'drill-cache')
  mkdirSync(c2gDir, { recursive: true })
  const db = join(c2gDir, 'cache.sqlite3')
  execFileSync('sqlite3', [db], { input: `
    CREATE TABLE meta (singleton INTEGER PRIMARY KEY, application_identity TEXT NOT NULL, canonical_root BLOB NOT NULL, project_key BLOB NOT NULL);
    CREATE TABLE graph_snapshots (snapshot_id INTEGER PRIMARY KEY, resolver_tier TEXT NOT NULL, created_at_ns INTEGER NOT NULL);
    CREATE TABLE active_snapshots (resolver_tier TEXT NOT NULL, completeness INTEGER NOT NULL, snapshot_id INTEGER NOT NULL, PRIMARY KEY (resolver_tier, completeness));
    INSERT INTO meta VALUES (1, 'code2graph-cache', '${root}/repo', x'00');
    INSERT INTO graph_snapshots VALUES (3, 'scope', 0);
    INSERT INTO active_snapshots VALUES ('scope', 1, 3);
  ` })

  const options = { cacheDir: drillCache, ttlMs: DEFAULT_TTL_MS }
  const first = discoverDb(`${root}/repo`, join(root, 'c2g-projects'), 'sqlite3', options)
  assert.equal(first.cached, false, 'the first call scans')
  assert.equal(first.snapshotId, 3)
  const discoveryFile = join(drillCache, 'c2g-discovery.json')
  assert.equal(existsSync(discoveryFile), true, 'the result is written to the cache root')
  const saved = JSON.parse(readFileSync(discoveryFile, 'utf8'))
  assert.equal(saved.entries[`${root}/repo`].db, db)

  const second = discoverDb(`${root}/repo`, join(root, 'c2g-projects'), 'sqlite3', options)
  assert.equal(second.cached, true, 'the second call answers from the cache')
  assert.equal(second.db, db)

  // A cached database that disappeared must not be served.
  const moved = `${db}.moved`
  execFileSync('mv', [db, moved])
  assert.equal(discoverDb(`${root}/repo`, join(root, 'c2g-projects'), 'sqlite3', options), null)
  execFileSync('mv', [moved, db])
  assert.equal(discoverDb(`${root}/repo`, join(root, 'c2g-projects'), 'sqlite3', options).db, db, 'the entry is re-established once the database is back')

  // Expired entries are dropped on read, so the file shrinks on the next write.
  const stale = JSON.parse(readFileSync(discoveryFile, 'utf8'))
  stale.entries[`${root}/repo`].savedAt = Date.now() - 8 * DAY
  writeFileSync(discoveryFile, JSON.stringify(stale))
  const refreshed = discoverDb(`${root}/repo`, join(root, 'c2g-projects'), 'sqlite3', options)
  assert.equal(refreshed.cached, false, 'an expired entry triggers a rescan')

  assert.equal(forgetDiscovery(`${root}/repo`, drillCache), true)
  assert.equal(discoverDb(`${root}/repo`, join(root, 'c2g-projects'), 'sqlite3', options).cached, false)
  clearDiscovery(drillCache)
  assert.equal(existsSync(discoveryFile), false)
})

test('tgrep indexes are pruned by idleness and kept when in use', { skip: resolveBin('tgrep') === null }, () => {
  const repoA = join(root, 'repoA')
  const repoB = join(root, 'repoB')
  for (const repo of [repoA, repoB]) {
    mkdirSync(repo, { recursive: true })
    writeFileSync(join(repo, 'a.rs'), 'pub fn f() {}\n')
  }
  const baseDir = join(root, 'tgrep')
  assert.equal(indexRoot({ root: repoA, baseDir }).ok, true)
  assert.equal(indexRoot({ root: repoB, baseDir }).ok, true)
  assert.equal(indexFor(repoA, baseDir), indexDirFor(repoA, baseDir))

  age(indexDirFor(repoA, baseDir), 9 * DAY)
  const pruned = pruneIndexes({ baseDir, ttlMs: DEFAULT_TTL_MS, keepRoots: [] })
  assert.deepEqual(pruned.removed, [indexDirFor(repoA, baseDir).split('/').pop()])
  assert.equal(existsSync(indexDirFor(repoA, baseDir)), false)
  assert.equal(existsSync(indexDirFor(repoB, baseDir)), true, 'the recently used index survives')

  // A kept root is protected even when idle.
  age(indexDirFor(repoB, baseDir), 9 * DAY)
  const kept = pruneIndexes({ baseDir, ttlMs: DEFAULT_TTL_MS, keepRoots: [repoB] })
  assert.deepEqual(kept.removed, [])
  assert.equal(existsSync(indexDirFor(repoB, baseDir)), true)

  // ttl 0 disables pruning entirely.
  const disabled = pruneIndexes({ baseDir, ttlMs: 0 })
  assert.deepEqual(disabled.removed, [])
})

test('indexFor touches the index so idleness tracks use', { skip: resolveBin('tgrep') === null }, () => {
  const repo = join(root, 'repoTouch')
  mkdirSync(repo, { recursive: true })
  writeFileSync(join(repo, 'a.rs'), 'pub fn f() {}\n')
  const baseDir = join(root, 'tgrep-touch')
  indexRoot({ root: repo, baseDir })
  const dir = indexDirFor(repo, baseDir)
  age(dir, 3 * DAY)
  const before = statSync(dir).mtimeMs
  assert.equal(indexFor(repo, baseDir), dir)
  assert.ok(statSync(dir).mtimeMs > before, 'a lookup refreshes the idle clock')
})

test('a parent-directory cache without an active snapshot does not claim coverage', () => {
  const c2gDir = join(root, 'c2g-parent', 'proj')
  const drillCache = join(root, 'drill-cache-2')
  mkdirSync(c2gDir, { recursive: true })
  const db = join(c2gDir, 'cache.sqlite3')
  execFileSync('sqlite3', [db], { input: `
    CREATE TABLE meta (singleton INTEGER PRIMARY KEY, application_identity TEXT NOT NULL, canonical_root BLOB NOT NULL, project_key BLOB NOT NULL);
    CREATE TABLE graph_snapshots (snapshot_id INTEGER PRIMARY KEY, resolver_tier TEXT NOT NULL, created_at_ns INTEGER NOT NULL);
    CREATE TABLE active_snapshots (resolver_tier TEXT NOT NULL, completeness INTEGER NOT NULL, snapshot_id INTEGER NOT NULL, PRIMARY KEY (resolver_tier, completeness));
    INSERT INTO meta VALUES (1, 'code2graph-cache', '${root}', x'00');
  ` })
  // Rooted at a parent, but no active scope snapshot: it cannot answer queries.
  assert.equal(discoverDb(`${root}/some/worktree`, join(root, 'c2g-parent'), 'sqlite3', { cacheDir: drillCache, ttlMs: DEFAULT_TTL_MS }), null)

  // Add the snapshot and it becomes a candidate for everything beneath it.
  execFileSync('sqlite3', [db], { input: `
    INSERT INTO graph_snapshots VALUES (9, 'scope', 0);
    INSERT INTO active_snapshots VALUES ('scope', 1, 9);
  ` })
  const found = discoverDb(`${root}/some/worktree`, join(root, 'c2g-parent'), 'sqlite3', { cacheDir: drillCache, ttlMs: DEFAULT_TTL_MS })
  assert.equal(found.snapshotId, 9)
  assert.equal(found.db, db)
})

test('a cached discovery entry without a snapshot is never served', () => {
  const drillCache = join(root, 'drill-cache-3')
  const c2gDir = join(root, 'c2g-nosnap')
  mkdirSync(c2gDir, { recursive: true })
  const db = join(c2gDir, 'cache.sqlite3')
  writeFileSync(db, 'not-a-database')
  mkdirSync(drillCache, { recursive: true })
  writeFileSync(join(drillCache, 'c2g-discovery.json'), JSON.stringify({
    version: 1,
    entries: { [`${root}/legacy`]: { db, snapshotId: null, savedAt: Date.now() } },
  }))
  // The entry is dropped on read, so the caller rescans instead of trusting it.
  assert.equal(discoverDb(`${root}/legacy`, c2gDir, 'sqlite3', { cacheDir: drillCache, ttlMs: DEFAULT_TTL_MS }), null)
  const after = JSON.parse(readFileSync(join(drillCache, 'c2g-discovery.json'), 'utf8'))
  assert.deepEqual(Object.keys(after.entries), [], 'the stale entry is gone from the map')
})

test('a cache-schema bump is visible on the next call, not after the TTL', () => {
  const c2gDir = join(root, 'c2g-schema', 'proj')
  const drillCache = join(root, 'drill-cache-schema')
  mkdirSync(c2gDir, { recursive: true })
  const db = join(c2gDir, 'cache.sqlite3')
  execFileSync('sqlite3', [db], { input: `
    CREATE TABLE meta (singleton INTEGER PRIMARY KEY, application_identity TEXT NOT NULL, canonical_root BLOB NOT NULL, project_key BLOB NOT NULL);
    CREATE TABLE graph_snapshots (snapshot_id INTEGER PRIMARY KEY, resolver_tier TEXT NOT NULL, created_at_ns INTEGER NOT NULL);
    CREATE TABLE active_snapshots (resolver_tier TEXT NOT NULL, completeness INTEGER NOT NULL, snapshot_id INTEGER NOT NULL, PRIMARY KEY (resolver_tier, completeness));
    INSERT INTO meta VALUES (1, 'code2graph-cache', '${root}/repo-schema', x'00');
    INSERT INTO graph_snapshots VALUES (1, 'scope', 0);
    INSERT INTO active_snapshots VALUES ('scope', 1, 1);
    PRAGMA user_version = 3;
  ` })
  const options = { cacheDir: drillCache, ttlMs: DEFAULT_TTL_MS }
  assert.equal(discoverDb(`${root}/repo-schema`, join(root, 'c2g-schema'), 'sqlite3', options).schemaVersion, 3)

  // Upstream bumps the cache schema while our entry is still fresh.
  execFileSync('sqlite3', [db], { input: 'PRAGMA user_version = 4;' })
  const after = discoverDb(`${root}/repo-schema`, join(root, 'c2g-schema'), 'sqlite3', options)
  assert.equal(after.cached, true, 'still served from the discovery cache')
  assert.equal(after.schemaVersion, 4, 'but the version is re-read, so the drift shows up immediately')
  const persisted = JSON.parse(readFileSync(join(drillCache, 'c2g-discovery.json'), 'utf8'))
  assert.equal(persisted.entries[`${root}/repo-schema`].schemaVersion, 4, 'and the refreshed version is persisted')
})
````

## `test/core.test.js`

sha256 `d71387054522f89d314abeff35fe5b14ff60f879b9cea733e1e1077d45e71b2a` · 266 lines

````javascript
import assert from 'node:assert/strict'
import { appendFileSync, mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'

import { appendEntry, assertTaskId, normalizeEntry, readLedger, taskPaths } from '../lib/ledger.js'
import { evaluate } from '../lib/gates.js'
import { renderReport } from '../lib/report.js'
import { runCapture } from '../lib/runner.js'

const root = mkdtempSync(join(tmpdir(), 'drill-test-'))
after(() => rmSync(root, { recursive: true, force: true }))

/**
 * Write a captured log where the drill itself would put it: under the task's
 * own logs directory. The ledger refuses a test/hygiene record whose log lives
 * anywhere else, because otherwise any readable file is a "proof".
 */
const logFor = (name, text = 'output\n', task = 'fixtures') => {
  const dir = join(root, task, 'logs')
  mkdirSync(dir, { recursive: true })
  const path = join(dir, name)
  writeFileSync(path, text)
  return path
}

test('task ids reject traversal and unsafe characters', () => {
  assert.equal(assertTaskId('issue296'), 'issue296')
  assert.throws(() => assertTaskId('../etc'), /invalid task id/)
  assert.throws(() => assertTaskId('a/b'), /invalid task id/)
  assert.throws(() => assertTaskId(''), /invalid task id/)
  assert.throws(() => assertTaskId('x'.repeat(65)), /invalid task id/)
})

test('test evidence without a readable log is refused', () => {
  assert.throws(
    () => normalizeEntry({ task: 't1', kind: 'test', stage: 'patch', arm: 'base', exit: 101 }),
    /must carry `log`/,
  )
  assert.throws(
    () => normalizeEntry({ task: 't1', kind: 'test', stage: 'patch', arm: 'base', exit: 101, log: join(root, 'nope.log') }),
    /no readable log/,
  )
  const empty = logFor('empty.log', '')
  const silent = normalizeEntry({ task: 't1', kind: 'test', stage: 'patch', arm: 'base', exit: 101, log: empty })
  assert.match(silent.sha256, /^sha256:[0-9a-f]{64}$/, 'a command that prints nothing still produced a log, and it is hashed')
})

test('normalizeEntry validates kind, stage, arm, exit and lists', () => {
  assert.throws(() => normalizeEntry({ task: 't1', kind: 'nope', stage: 'patch' }), /kind must be one of/)
  assert.throws(() => normalizeEntry({ task: 't1', kind: 'note', stage: 'nowhere' }), /stage must be one of/)
  assert.throws(() => normalizeEntry({ task: 't1', kind: 'test', stage: 'patch', arm: 'side', log: logFor('a.log') }), /arm must be/)
  assert.throws(() => normalizeEntry({ task: 't1', kind: 'note', stage: 'patch', exit: '1' }), /exit must be an integer/)
  assert.throws(() => normalizeEntry({ task: 't1', kind: 'locate', stage: 'localize', files: 'x.rs' }), /files must be an array/)
  const ok = normalizeEntry({ task: 't1', kind: 'locate', stage: 'localize', files: ['a.rs'] })
  assert.equal(ok.v, 1)
  assert.deepEqual(ok.files, ['a.rs'])
  assert.match(ok.ts, /^\d{4}-\d{2}-\d{2}T/)
})

test('ledger round-trips and hashes logs', () => {
  const paths = taskPaths(root, 'roundtrip')
  const log = logFor('round.log', 'red proof\n', 'roundtrip')
  appendEntry(paths, { task: 'roundtrip', kind: 'test', stage: 'patch', arm: 'base', exit: 101, cmd: 'cargo test', log })
  const entries = readLedger(paths)
  assert.equal(entries.length, 1)
  assert.equal(entries[0].exit, 101)
  assert.match(entries[0].sha256, /^sha256:[0-9a-f]{64}$/)
  assert.deepEqual(readLedger(taskPaths(root, 'missing')), [], 'a missing ledger reads as empty')
})

test('a torn final line is skipped, but a complete bad line is refused', () => {
  const paths = taskPaths(root, 'torn')
  appendEntry(paths, { task: 'torn', kind: 'note', stage: 'localize', text: 'first' })
  // A writer that died mid-append leaves no trailing newline.
  appendFileSync(paths.ledger, '{"v":1,"task":"torn","kind":"note"')
  const entries = readLedger(paths)
  assert.equal(entries.length, 1, 'the complete record survives the torn tail')
  assert.equal(entries[0].text, 'first')

  // A complete line that does not parse is corruption, not a torn write.
  appendFileSync(paths.ledger, '\n{not json}\n')
  assert.throws(() => readLedger(paths), /not valid JSON/)
})

test('a corrupted ledger refuses evaluation', () => {
  const paths = taskPaths(root, 'corrupt')
  appendEntry(paths, { task: 'corrupt', kind: 'note', stage: 'localize', text: 'ok' })
  writeFileSync(paths.ledger, '{not json}\n')
  assert.throws(() => readLedger(paths), /not valid JSON/)
})

test('gates require a real red proof, then green, hygiene and review', () => {
  const paths = taskPaths(root, 'gates')
  const red = logFor('gates-red.log', 'FAILED\n', 'gates')
  const green = logFor('gates-green.log', 'ok\n', 'gates')
  const hygiene = logFor('gates-hygiene.log', 'clean\n', 'gates')

  appendEntry(paths, { task: 'gates', kind: 'test', stage: 'patch', arm: 'fix', exit: 0, log: green })
  let evaluation = evaluate(readLedger(paths))
  assert.equal(evaluation.gates.find(g => g.id === 'red').ok, false)
  assert.equal(evaluation.ready, false)
  assert.ok(evaluation.missingForDone.includes('red'))

  appendEntry(paths, { task: 'gates', kind: 'test', stage: 'patch', arm: 'base', exit: 101, log: red })
  appendEntry(paths, { task: 'gates', kind: 'hygiene', stage: 'patch', exit: 0, log: hygiene })
  evaluation = evaluate(readLedger(paths))
  assert.equal(evaluation.gates.find(g => g.id === 'red').ok, true)
  assert.equal(evaluation.gates.find(g => g.id === 'green').ok, true)
  assert.equal(evaluation.ready, false, 'review still missing')

  appendEntry(paths, { task: 'gates', kind: 'review', stage: 'review', verdict: 'PASS', blockers: 0 })
  assert.equal(evaluate(readLedger(paths)).ready, true)

  appendEntry(paths, { task: 'gates', kind: 'review', stage: 'review', verdict: 'FAIL', blockers: 2 })
  const after = evaluate(readLedger(paths))
  assert.equal(after.gates.find(g => g.id === 'review').ok, false, 'a later failing review reopens the gate')
  assert.equal(after.ready, false)
})

test('a passing test on base is not a red proof', () => {
  const paths = taskPaths(root, 'guardnotproof')
  const log = logFor('guard.log', 'all tests passed\n', 'guardnotproof')
  appendEntry(paths, { task: 'guardnotproof', kind: 'test', stage: 'patch', arm: 'base', exit: 0, log })
  assert.equal(evaluate(readLedger(paths)).gates.find(g => g.id === 'red').ok, false)
})

test('report renders verdict, gate table and test evidence', () => {
  const paths = taskPaths(root, 'report')
  const log = logFor('report-red.log', 'boom\n', 'report')
  appendEntry(paths, { task: 'report', kind: 'test', stage: 'patch', arm: 'base', exit: 1, cmd: 'cargo nextest run', log })
  const md = renderReport('report', readLedger(paths), { repo: '/x/nodedb', base: 'origin/main' })
  assert.match(md, /# Drill report — report/)
  assert.match(md, /INCOMPLETE/)
  assert.match(md, /cargo nextest run/)
  assert.match(md, /repo `\/x\/nodedb`/)
})

test('runner captures exit codes, output and timeouts', async () => {
  const ok = await runCapture({ command: 'echo hello && exit 0', logPath: join(root, 'run-ok.log') })
  assert.equal(ok.exit, 0)
  assert.equal(ok.timedOut, false)

  const bad = await runCapture({ command: 'echo boom >&2; exit 7', logPath: join(root, 'run-bad.log') })
  assert.equal(bad.exit, 7)
  const { readFileSync } = await import('node:fs')
  assert.match(readFileSync(bad.logPath, 'utf8'), /boom/)

  const slow = await runCapture({ command: 'sleep 30', logPath: join(root, 'run-slow.log'), timeoutMs: 300 })
  assert.equal(slow.timedOut, true)
  assert.equal(slow.exit, 124)
})

test('the review gate reopens when the reviewed commit is not the green commit', () => {
  const paths = taskPaths(root, 'headbind')
  appendEntry(paths, { task: 'headbind', kind: 'test', stage: 'patch', arm: 'base', exit: 101, log: logFor('headbind-red.log', 'boom\n', 'headbind') })
  const green = logFor('headbind-green.log', 'ok\n', 'headbind')
  appendEntry(paths, { task: 'headbind', kind: 'test', stage: 'patch', arm: 'fix', exit: 0, log: green, head: 'a'.repeat(40) })
  appendEntry(paths, { task: 'headbind', kind: 'hygiene', stage: 'patch', exit: 0, log: logFor('headbind-hyg.log', 'clean\n', 'headbind') })

  appendEntry(paths, { task: 'headbind', kind: 'review', stage: 'review', verdict: 'PASS', blockers: 0, head: 'b'.repeat(40) })
  let evaluation = evaluate(readLedger(paths))
  const review = evaluation.gates.find(g => g.id === 'review')
  assert.equal(review.ok, false, 'a review of another commit cannot close the gate')
  assert.match(review.detail, /re-run the review/)
  assert.equal(evaluation.ready, false)

  appendEntry(paths, { task: 'headbind', kind: 'review', stage: 'review', verdict: 'PASS', blockers: 0, head: 'a'.repeat(40) })
  evaluation = evaluate(readLedger(paths))
  assert.equal(evaluation.gates.find(g => g.id === 'review').ok, true, 'the matching commit closes it')
  assert.equal(evaluation.ready, true)
})

test('reports name the commit evidence is bound to', () => {
  const paths = taskPaths(root, 'headreport')
  appendEntry(paths, { task: 'headreport', kind: 'test', stage: 'patch', arm: 'base', exit: 1, cmd: 'cargo test', log: logFor('headreport-red.log', 'boom\n', 'headreport'), head: 'c'.repeat(40) })
  const md = renderReport('headreport', readLedger(paths), {})
  assert.match(md, /Evidence bound to commit `c{40}`/)
  assert.match(md, /cccccccccccc/)
})

test('the pr gate reopens when the body describes another commit', () => {
  const paths = taskPaths(root, 'prhead')
  appendEntry(paths, { task: 'prhead', kind: 'test', stage: 'patch', arm: 'fix', exit: 0, log: logFor('prhead-green.log', 'ok\n', 'prhead'), head: 'a'.repeat(40) })
  appendEntry(paths, { task: 'prhead', kind: 'pr', stage: 'pr', bodyPath: '/tmp/x/PR_BODY.md', head: 'a'.repeat(40) })
  assert.equal(evaluate(readLedger(paths)).gates.find(g => g.id === 'pr').ok, true)

  // New commits land: the same body now describes a stale commit.
  appendEntry(paths, { task: 'prhead', kind: 'test', stage: 'patch', arm: 'fix', exit: 0, log: logFor('prhead-green2.log', 'ok again\n', 'prhead'), head: 'b'.repeat(40) })
  const reopened = evaluate(readLedger(paths)).gates.find(g => g.id === 'pr')
  assert.equal(reopened.ok, false, 'a body for an older commit cannot describe the new one')
  assert.match(reopened.detail, /re-render it on the commit you are pushing/)
})

test('a review record that names no commit cannot close the review gate', () => {
  // Rule 4: review evidence is bound to a commit. A hand-written `review` record
  // passed through drill_record without a `head` used to slip past the
  // "reviewed the green proof" check, because a missing head read as "not stale".
  const green = { kind: 'test', stage: 'patch', arm: 'fix', exit: 0, sha256: 'sha256:aa', head: 'a'.repeat(40) }
  const unbound = evaluate([green, { kind: 'review', stage: 'review', verdict: 'PASS', blockers: 0 }])
  assert.equal(unbound.gates.find(g => g.id === 'review').ok, false, 'no commit named, no gate closed')
  assert.match(unbound.gates.find(g => g.id === 'review').detail, /names no commit/)

  const wrong = evaluate([green, { kind: 'review', stage: 'review', verdict: 'PASS', blockers: 0, head: 'b'.repeat(40) }])
  assert.equal(wrong.gates.find(g => g.id === 'review').ok, false, 'a review of another commit stays open')

  const bound = evaluate([green, { kind: 'review', stage: 'review', verdict: 'PASS', blockers: 0, head: 'a'.repeat(40) }])
  assert.equal(bound.gates.find(g => g.id === 'review').ok, true, 'the same commit closes it')

  // Without a green proof there is no commit to bind to: behaviour is unchanged.
  const noGreen = evaluate([{ kind: 'review', stage: 'review', verdict: 'PASS', blockers: 0 }])
  assert.equal(noGreen.gates.find(g => g.id === 'review').ok, true)
})

test('the ledger refuses an unarmed test, a logless hygiene run, and a foreign log', () => {
  // An unarmed test record closes neither red nor green, so it is noise that
  // looks like proof.
  assert.throws(
    () => normalizeEntry({ task: 't1', kind: 'test', stage: 'patch', exit: 0, log: logFor('unarmed.log', 'ok\n', 't1') }, { logsDir: join(root, 't1', 'logs') }),
    /must carry `arm`/,
  )
  // `hygiene` needs a log too, not only `test`.
  assert.throws(
    () => normalizeEntry({ task: 't1', kind: 'hygiene', stage: 'patch', exit: 0 }, { logsDir: join(root, 't1', 'logs') }),
    /must carry `log`/,
  )

  // Rule 3: only the executor produces a proof. A readable file elsewhere is
  // not a run's captured output.
  const paths = taskPaths(root, 'provenance')
  const foreign = logFor('elsewhere.log', 'all green\n', 'somewhere-else')
  assert.throws(
    () => appendEntry(paths, { task: 'provenance', kind: 'test', stage: 'patch', arm: 'fix', exit: 0, log: foreign }),
    /must be captured by the drill/,
  )

  // The same record with the log where drill_run writes it is accepted.
  const own = logFor('own.log', 'all green\n', 'provenance')
  const ok = appendEntry(paths, { task: 'provenance', kind: 'test', stage: 'patch', arm: 'fix', exit: 0, log: own })
  assert.match(ok.sha256, /^sha256:[0-9a-f]{64}$/)
})

test('a test killed by a signal is still recordable as a red proof', async () => {
  // The canonical red proof can be a segfault: the child reports code null and
  // a signal name, and the ledger needs an integer exit code.
  const killed = await runCapture({ command: 'kill -SEGV $$', logPath: join(root, 'sigsegv.log') })
  assert.equal(killed.signal, 'SIGSEGV')
  assert.equal(killed.exit, 139, '128 + SIGSEGV(11), the code a shell reports')

  const paths = taskPaths(root, 'signal-red')
  const log = logFor('signal-red.log', 'Segmentation fault\n', 'signal-red')
  const normalized = appendEntry(paths, {
    task: 'signal-red',
    kind: 'test',
    stage: 'patch',
    arm: 'base',
    exit: killed.exit,
    cmd: 'cargo test',
    log,
    note: `killed by ${killed.signal}`,
  })
  assert.equal(normalized.exit, 139)
  assert.equal(evaluate(readLedger(paths)).gates.find(g => g.id === 'red').ok, true, 'a signal-killed run is a valid red proof')
})
````

## `test/embed.test.js`

sha256 `f348358148cebd433c6c1ad3116f7fec7d8218cbfe7497e81afa4cb3e9e7d2d6` · 112 lines

````javascript
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'

import { SHARD_PREFIXES, callers, callees, dependentFiles, impact, isUsable, locate, openStore, toStoredPath, toWorktreePath } from '../lib/embed.js'

const root = mkdtempSync(join(tmpdir(), 'drill-embed-'))
after(() => rmSync(root, { recursive: true, force: true }))

const store = join(root, 'Embed', 'c2g', 'graph_index.sqlite')
mkdirSync(join(root, 'Embed', 'c2g'), { recursive: true })
writeFileSync(join(root, 'Embed', 'c2g', 'manifest.json'), JSON.stringify({ source: 'c2g', count: 5, built_at: '2026-09-24T05:24:54+0800' }))

execFileSync('sqlite3', [store], { input: `
  CREATE TABLE nodes(id TEXT PRIMARY KEY, name TEXT, kind TEXT, file TEXT, repo TEXT, line INTEGER);
  CREATE TABLE links(source TEXT, target TEXT, relation TEXT);
  INSERT INTO nodes VALUES
    ('n1','target_fn','Function','nd_src/control/a.rs','nd_src',10),
    ('n2','target_fn','Function','nd_sql/src/b.rs','nd_sql',5),
    ('n3','caller_fn','Function','nd_src/control/c.rs','nd_src',20),
    ('n4','root_fn','Function','nd_tests/wire.rs','nd_tests',1),
    ('n5','loose_fn','Function','scripts/tool.py','nd_rest',3);
  INSERT INTO links VALUES
    ('n3','n1','CALL'),
    ('n4','n3','CALL'),
    ('n5','n1','CALL'),
    ('n1','n2','CALL'),
    ('n3','n1','IMPORT');
` })

// A worktree carrying the mapped files; nd_sql/src/b.rs deliberately missing.
const worktree = join(root, 'nodedb-296')
for (const file of ['nodedb/src/control/a.rs', 'nodedb/src/control/c.rs', 'nodedb/tests/wire.rs', 'scripts/tool.py']) {
  mkdirSync(join(worktree, file, '..'), { recursive: true })
  writeFileSync(join(worktree, file), '// fixture\n')
}

test('openStore reads the manifest and refuses a missing path', () => {
  const opened = openStore(store)
  assert.equal(opened.builtAt, '2026-09-24T05:24:54+0800')
  assert.equal(opened.count, 5)
  assert.equal(openStore(join(root, 'nope.sqlite')), null)
  assert.equal(isUsable(store), true)
})

test('shard paths map both ways', () => {
  assert.equal(SHARD_PREFIXES.nd_src, 'nodedb/src')
  assert.deepEqual(toWorktreePath(worktree, 'nd_src/control/a.rs', 'nd_src'), { path: 'nodedb/src/control/a.rs', exists: true })
  assert.deepEqual(toWorktreePath(worktree, 'nd_sql/src/b.rs', 'nd_sql'), { path: 'nodedb-sql/src/b.rs', exists: false })
  assert.deepEqual(toWorktreePath(worktree, 'scripts/tool.py', 'nd_rest'), { path: 'scripts/tool.py', exists: true })
  assert.deepEqual(toWorktreePath(worktree, 'somewhere/x.go', 'other_repo'), { path: 'somewhere/x.go', exists: false })

  assert.equal(toStoredPath('nodedb/src/control/a.rs'), 'nd_src/control/a.rs')
  assert.equal(toStoredPath('nodedb-sql/src/b.rs'), 'nd_sql/src/b.rs')
  assert.equal(toStoredPath('scripts/tool.py'), 'nd_rest/scripts/tool.py')

  const overridden = toWorktreePath(worktree, 'nd_src/control/a.rs', 'nd_src', { nd_src: 'crates/server/src' })
  assert.equal(overridden.path, 'crates/server/src/control/a.rs')
})

test('locate maps shard rows into the worktree and flags paths that are not there', () => {
  const rows = locate(store, 'target_fn', { worktree })
  assert.equal(rows.length, 2)
  const src = rows.find(r => r.repo === 'nd_src')
  assert.equal(src.path, 'nodedb/src/control/a.rs')
  assert.equal(src.exists, true)
  const sql = rows.find(r => r.repo === 'nd_sql')
  assert.equal(sql.path, 'nodedb-sql/src/b.rs')
  assert.equal(sql.exists, false, 'a shard path missing from this worktree is not claimed as present')
  assert.equal(locate(store, 'target_fn', { worktree, file: 'nd_sql' }).length, 1)
  assert.deepEqual(locate(store, 'no_such_symbol', { worktree }), [])
})

test('callers, callees and impact walk resolved CALL links only', () => {
  const up = callers(store, 'target_fn', { worktree })
  // The fixture names two nodes target_fn: the nd_src definition is called by
  // caller_fn, loose_fn and by the nd_sql definition across a CALL edge, while
  // the nd_src -> nd_sql IMPORT edge is not a call and must not appear twice.
  assert.deepEqual(up.map(r => r.caller).sort(), ['caller_fn', 'loose_fn', 'target_fn'])
  assert.equal(up.filter(r => r.caller === 'caller_fn').length, 1, 'the IMPORT edge is not a second call site')
  assert.equal(up.find(r => r.caller === 'caller_fn').path, 'nodedb/src/control/c.rs')
  assert.equal(up.find(r => r.caller === 'loose_fn').path, 'scripts/tool.py')

  const imports = callers(store, 'target_fn', { worktree, relations: ['IMPORT'] })
  assert.deepEqual(imports.map(r => r.caller), ['caller_fn'], 'the relation filter is honoured')

  const down = callees(store, 'target_fn', { worktree })
  assert.deepEqual(down.map(r => r.callee), ['target_fn'], 'the nd_sql definition is a separate node')

  const transitive = impact(store, 'target_fn', { worktree, depth: 2 })
  const pairs = transitive.map(r => `${r.depth}:${r.caller}`).sort()
  assert.deepEqual(pairs, ['1:caller_fn', '1:loose_fn', '1:target_fn', '2:root_fn'])
  const shallow = impact(store, 'target_fn', { worktree, depth: 1 })
  assert.equal(shallow.some(r => r.caller === 'root_fn'), false, 'depth 1 stops before the second hop')
})

test('dependentFiles walks back from a worktree file', () => {
  const rows = dependentFiles(store, worktree, 'nodedb/src/control/a.rs', { depth: 2 })
  const names = rows.map(r => r.path).sort()
  assert.deepEqual(names, ['nodedb/src/control/c.rs', 'nodedb/tests/wire.rs', 'scripts/tool.py'])
  assert.ok(rows.every(r => r.exists), 'every dependent exists in the fixture worktree')
})

test('a non-store file is not usable', () => {
  const bogus = join(root, 'bogus.sqlite')
  writeFileSync(bogus, 'not a database')
  assert.equal(isUsable(bogus), false)
})
````

## `test/errors.test.js`

sha256 `96e8696dd4f94a2353800fa505d188004e8d8b1cf46debc7893967120df43324` · 135 lines

````javascript
import assert from 'node:assert/strict'
import { test } from 'node:test'

import { MAX_FRAMES, describeFrames, extractMessage, normalizeFramePath, parseFrames } from '../lib/errors.js'

const MODERN_PANIC = `thread 'main' panicked at nodedb/src/control/sequence/registry.rs:227:13:
called \`Option::unwrap()\` on a \`None\` value
note: run with \`RUST_BACKTRACE=1\` environment variable to display a backtrace`

const BACKTRACE = `thread 'tokio-runtime-worker' panicked at nodedb/src/control/sequence/registry.rs:227:13:
called \`Option::unwrap()\` on a \`None\` value
stack backtrace:
   0: rust_begin_unwind
             at /rustc/abc123/library/std/src/panicking.rs:597:5
   1: core::panicking::panic_fmt
             at /rustc/abc123/library/core/src/panicking.rs:67:14
   2: nodedb::control::sequence::registry::nextval_batch
             at ./nodedb/src/control/sequence/registry.rs:231:5
   3: nodedb_sql::executor::apply::apply_put
             at ./nodedb-sql/src/executor/apply.rs:88:9
   4: tokio::runtime::task::raw::poll
             at /home/user/.cargo/registry/src/index.crates.io/tokio-1.40.0/src/runtime/task/raw.rs:271:5`

const RUSTC = `error[E0308]: mismatched types
  --> nodedb/src/control/catalog/types.rs:41:9
   |
41 |     let x: u64 = catalog_err();
   |            ---   ^^^^^^^^^^^^^ expected \`u64\`, found \`CatalogError\``

const PYTHON = `Traceback (most recent call last):
  File "/home/user/scripts/state-query.py", line 42, in <module>
    main()
  File "/home/user/scripts/state-query.py", line 31, in main
    get_conn()`

test('a modern panic yields the message and the file:line:column frame', () => {
  const { message, frames } = parseFrames(MODERN_PANIC)
  assert.equal(message, 'called `Option::unwrap()` on a `None` value')
  assert.equal(frames.length, 1)
  assert.deepEqual({ file: frames[0].file, line: frames[0].line, column: frames[0].column }, { file: 'nodedb/src/control/sequence/registry.rs', line: 227, column: 13 })
  assert.equal(frames[0].external, false)
})

test('a numbered backtrace keeps the symbol hint and marks toolchain frames external', () => {
  const { frames } = parseFrames(BACKTRACE)
  const internal = frames.filter(f => !f.external)
  assert.deepEqual(internal.map(f => `${f.file}:${f.line}`), [
    'nodedb/src/control/sequence/registry.rs:227',
    'nodedb/src/control/sequence/registry.rs:231',
    'nodedb-sql/src/executor/apply.rs:88',
  ])
  assert.equal(internal[0].symbolHint, undefined, 'the panic header carries no backtrace symbol')
  assert.equal(internal[1].symbolHint, 'nodedb::control::sequence::registry::nextval_batch')
  assert.equal(frames.filter(f => f.external).length, 3, 'rustc and cargo-registry frames are external, not dropped')
  assert.equal(frames[0].file, 'nodedb/src/control/sequence/registry.rs', 'the panic header frame is the repository one and comes first')
})

test('the panic header is deduplicated against the frame that repeats it', () => {
  const { frames } = parseFrames(`panicked at src/a.rs:10:1:\nboom\n   0: x::y\n             at ./src/a.rs:10:1\n`)
  assert.equal(frames.filter(f => f.file === 'src/a.rs' && f.line === 10).length, 1)
  assert.equal(describeFrames(frames), '1 repository frame(s): src/a.rs:10')
})

test('compiler diagnostics and tracebacks are parsed', () => {
  const rustc = parseFrames(RUSTC)
  assert.equal(rustc.message, 'mismatched types')
  assert.deepEqual(rustc.frames.map(f => `${f.file}:${f.line}:${f.column}`), ['nodedb/src/control/catalog/types.rs:41:9'])

  const python = parseFrames(PYTHON)
  assert.deepEqual(python.frames.map(f => `${f.file}:${f.line}`), [
    '/home/user/scripts/state-query.py:42',
    '/home/user/scripts/state-query.py:31',
  ], 'a traceback keeps both frames, and an absolute path outside a repository stays absolute')
})

test('bare file:line mentions are picked up from log prose', () => {
  const { frames } = parseFrames('see src/engine/array.rs:107 and nodedb-lite/src/nodedb/array.rs:33 for the first write')
  assert.deepEqual(frames.map(f => `${f.file}:${f.line}`), ['src/engine/array.rs:107', 'nodedb-lite/src/nodedb/array.rs:33'])
})

test('a pathological backtrace is capped and stays ordered', () => {
  const many = Array.from({ length: MAX_FRAMES + 25 }, (_, index) => `             at ./nodedb/src/f${index}.rs:${index + 1}:1`).join('\n')
  const { frames } = parseFrames(many)
  assert.equal(frames.length, MAX_FRAMES)
  assert.equal(frames[0].file, 'nodedb/src/f0.rs')
  assert.equal(frames.at(-1).file, `nodedb/src/f${MAX_FRAMES - 1}.rs`, 'the first frames are kept, not the last')
})

test('path normalization strips noise and keeps external marking', () => {
  assert.deepEqual(normalizeFramePath('./src/a.rs'), { file: 'src/a.rs', external: false })
  assert.deepEqual(normalizeFramePath('file:///home/user/projects/nodedb/src/a.rs'), { file: 'nodedb/src/a.rs', external: false })
  assert.equal(normalizeFramePath('/rustc/abc/library/core/src/panicking.rs').external, true)
  assert.equal(normalizeFramePath('/home/user/.cargo/registry/src/x/tokio/src/a.rs').external, true)
})

test('text without frames yields an empty result rather than a wrong one', () => {
  const { message, frames } = parseFrames('tests passed, nothing to see')
  assert.deepEqual(frames, [])
  assert.equal(message, null)
  assert.equal(extractMessage('ERROR: relation "x" does not exist'), 'relation "x" does not exist')
  assert.equal(describeFrames([]), '0 repository frame(s)')
})

test('toolchain and dependency paths are external even when printed relative', () => {
  // Rust prints a std-internal panic without a leading slash. Reading that as a
  // repository file localizes the bug to a path that does not exist.
  assert.equal(normalizeFramePath('library/std/src/panicking.rs').external, true)
  assert.equal(normalizeFramePath('library/core/src/panicking.rs').external, true)
  assert.equal(normalizeFramePath('rustc/9c3b/library/std/src/panicking.rs').external, true)
  assert.equal(normalizeFramePath('node_modules/left-pad/index.js').external, true)
  assert.equal(normalizeFramePath('.cargo/registry/src/index.crates.io-6f17d22bba15001f/rand-0.8.5/src/rngs/thread.rs').external, true)
  // The absolute forms keep working.
  assert.equal(normalizeFramePath('/rustc/abc123/library/std/src/panicking.rs').external, true)
  assert.equal(normalizeFramePath('/home/user/.cargo/registry/src/x/rand-0.8.5/src/lib.rs').external, true)
  assert.equal(normalizeFramePath('/usr/lib/python3.12/site-packages/x.py').external, true)
  // And a repository that happens to contain such a directory still owns its file:
  // the prefixes only match at the start of the path.
  assert.equal(normalizeFramePath('src/library/std/thing.rs').external, false)
  assert.equal(normalizeFramePath('nodedb/src/control/sequence/registry.rs').external, false)
})

test('a panic header naming only the standard library yields no repository frame', () => {
  const onlyExternal = `thread 'main' panicked at library/std/src/panicking.rs:597:5:
attempt to divide by zero
stack backtrace:
   0: std::panicking::begin_panic_handler
             at /rustc/abc123/library/std/src/panicking.rs:597:5
   1: core::panicking::panic_fmt
             at /rustc/abc123/library/core/src/panicking.rs:67:14`
  const parsed = parseFrames(onlyExternal)
  assert.ok(parsed.frames.length > 0, 'the frames are parsed, not dropped')
  assert.equal(parsed.frames.every(f => f.external), true, 'every frame is external')
  assert.match(describeFrames(parsed.frames), /^0 repository frame\(s\)/)
})
````

## `test/git-role.test.js`

sha256 `36f78867e90a4799d59098f2386e0feb8a788113157fb2b8a391df444eaa61ee` · 136 lines

````javascript
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'

import { branchName, diffFiles, headSha } from '../lib/git.js'
import { parseRoleFile, resolveRole, roleBudget, roleToolFilter } from '../lib/role.js'

const root = mkdtempSync(join(tmpdir(), 'drill-git-'))
after(() => rmSync(root, { recursive: true, force: true }))

const repo = join(root, 'repo')
mkdirSync(repo, { recursive: true })
const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' }).trim()
git('init', '-q', '-b', 'main')
git('config', 'user.email', 'drill@test')
git('config', 'user.name', 'drill test')
writeFileSync(join(repo, 'a.rs'), 'fn a() {}\n')
writeFileSync(join(repo, 'gone.rs'), 'fn gone() {}\n')
git('add', '.')
git('commit', '-q', '-m', 'base')
const baseSha = git('rev-parse', 'HEAD')
git('checkout', '-q', '-b', 'fix/thing')
writeFileSync(join(repo, 'a.rs'), 'fn a() { let x = 1; }\n')
writeFileSync(join(repo, 'new.rs'), 'fn new() {}\n')
git('rm', '-q', 'gone.rs')
git('add', '.')
git('commit', '-q', '-m', 'fix')
const headAfter = git('rev-parse', 'HEAD')

test('headSha and branchName read the checked-out revision', () => {
  assert.equal(headSha(repo), headAfter)
  assert.equal(branchName(repo), 'fix/thing')
})

test('diffFiles separates changed from deleted files', () => {
  const { changed, deleted, error } = diffFiles(repo, baseSha)
  assert.equal(error, null)
  assert.deepEqual(changed.sort(), ['a.rs', 'new.rs'])
  assert.deepEqual(deleted, ['gone.rs'])
})

test('a non-repository answers null instead of throwing', () => {
  const plain = join(root, 'plain')
  mkdirSync(plain, { recursive: true })
  assert.equal(headSha(plain), null)
  assert.equal(branchName(plain), null)
  const { changed, error } = diffFiles(plain, 'origin/main')
  assert.deepEqual(changed, [])
  assert.match(error, /git diff/)
})

test('parseRoleFile reads scalars, inline lists and the persona body', () => {
  const parsed = parseRoleFile(`---
name: drill-auditor
displayName: Drill Auditor
description: "Read-only auditor, verdict with evidence."
tools: [read, grep, glob, bash]
maxToolCalls: 80
maxToolCallsScope: delegation
onToolCallBudget: wrap-up
graceToolCalls: 2
unknownThing: nope
---
You are the auditor.
`)
  assert.deepEqual(parsed.data.tools, ['read', 'grep', 'glob', 'bash'])
  assert.equal(parsed.data.maxToolCalls, 80)
  assert.equal(parsed.data.description, 'Read-only auditor, verdict with evidence.')
  assert.equal(parsed.body, 'You are the auditor.')
  assert.deepEqual(parsed.unknownKeys, ['unknownThing'])
})

test('parseRoleFile tolerates a block list and a file with no frontmatter', () => {
  const block = parseRoleFile('---\ndescription: x\ntools:\n  - read\n  - grep\n---\nbody\n')
  assert.deepEqual(block.data.tools, ['read', 'grep'])
  const bare = parseRoleFile('no frontmatter here')
  assert.deepEqual(bare.data, {})
  assert.equal(bare.body, 'no frontmatter here')
})

test('resolveRole prefers project, then user, then bundled', () => {
  const project = join(repo, '.dsh', 'roles')
  const userHome = join(root, 'home')
  const bundled = join(root, 'bundled')
  mkdirSync(project, { recursive: true })
  mkdirSync(join(userHome, 'roles'), { recursive: true })
  mkdirSync(bundled, { recursive: true })
  writeFileSync(join(project, 'auditor.md'), '---\ndescription: project\n---\nproject body\n')
  writeFileSync(join(userHome, 'roles', 'auditor.md'), '---\ndescription: user\n---\nuser body\n')
  writeFileSync(join(bundled, 'auditor.md'), '---\ndescription: bundled\n---\nbundled body\n')
  writeFileSync(join(bundled, 'only-bundled.md'), '---\ndescription: only\n---\nbundled only\n')

  const found = resolveRole('auditor', { cwd: repo, dshHome: userHome, bundledDir: bundled })
  assert.equal(found.source, 'project')
  assert.equal(found.data.description, 'project')
  assert.equal(found.body, 'project body')

  rmSync(join(project, 'auditor.md'))
  assert.equal(resolveRole('auditor', { cwd: repo, dshHome: userHome, bundledDir: bundled }).source, 'user')

  rmSync(join(userHome, 'roles', 'auditor.md'))
  assert.equal(resolveRole('auditor', { cwd: repo, dshHome: userHome, bundledDir: bundled }).source, 'bundled')
  assert.equal(resolveRole('only-bundled', { cwd: repo, dshHome: userHome, bundledDir: bundled }).source, 'bundled')
  assert.equal(resolveRole('absent', { cwd: repo, dshHome: userHome, bundledDir: bundled }), null)
})

test('the bundled auditor role parses and carries a read-only budget', () => {
  const parsed = parseRoleFile(readFileSync(new URL('../roles/drill-auditor.md', import.meta.url), 'utf8'))
  assert.equal(parsed.data.name, 'drill-auditor')
  assert.deepEqual(parsed.unknownKeys, [], 'the bundled role must only use known keys')
  assert.ok(parsed.data.tools.includes('read'))
  assert.ok(!parsed.data.tools.includes('write'), 'the auditor never gets a write tool')
  assert.equal(roleBudget({ data: parsed.data }), 80)
  assert.match(parsed.body, /Read-only/)
})

test('roleToolFilter drops names the spawning agent cannot see, and honours deny', () => {
  const role = { data: { tools: ['read', 'grep', 'bash', 'imaginary'] } }
  assert.deepEqual(roleToolFilter(role, ['read', 'grep', 'bash', 'write']).allow, ['read', 'grep', 'bash'])
  const denied = { data: { tools: ['read', 'bash'], toolFilter: { deny: ['bash'] } } }
  assert.deepEqual(roleToolFilter(denied, ['read', 'bash']).allow, ['read'])
  assert.equal(roleToolFilter({ data: { tools: [] } }, ['read']), undefined)
  assert.equal(roleToolFilter({ data: { tools: ['imaginary'] } }, ['read']), undefined)
  assert.deepEqual(roleToolFilter({ data: { tools: ['*'] } }, ['read', 'grep']).allow, ['read', 'grep'])
})

test('roleBudget reports only a real non-negative integer cap', () => {
  assert.equal(roleBudget({ data: { maxToolCalls: 12 } }), 12)
  assert.equal(roleBudget({ data: { maxToolCalls: 0 } }), 0, 'zero means explicitly unlimited')
  assert.equal(roleBudget({ data: { maxToolCalls: 'lots' } }), null)
  assert.equal(roleBudget({ data: {} }), null)
})
````

## `test/integration.test.js`

sha256 `be244980d46c33a2681bc041a21409fd1a0259df3163f7c91936d4054a3157ae` · 882 lines

````javascript
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
    '             at /home/user/.cargo/registry/src/index.crates.io-6f17d22bba15001f/rand-0.8.5/src/rngs/thread.rs:64:9',
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
````

## `test/pr.test.js`

sha256 `13c93f92f822c7608bc72af519dc1f8492cd26b31506635ef96eb139aab5a1e5` · 97 lines

````javascript
import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'

import { DEFAULT_PR_CORE, lintPrBody, renderPrBody } from '../lib/pr.js'

const root = mkdtempSync(join(tmpdir(), 'drill-pr-'))
after(() => rmSync(root, { recursive: true, force: true }))

const entries = [
  { v: 1, ts: '2026-09-25T00:00:00Z', task: 'issue314', kind: 'note', stage: 'localize', text: 'drill-start', issue: '314' },
  { v: 1, ts: '2026-09-25T00:01:00Z', task: 'issue314', kind: 'locate', stage: 'localize', files: ['nodedb/src/control/sequence/registry.rs:227'] },
  { v: 1, ts: '2026-09-25T00:02:00Z', task: 'issue314', kind: 'blast', stage: 'blast', files: ['nodedb/src/control/sequence/types.rs'] },
  { v: 1, ts: '2026-09-25T00:03:00Z', task: 'issue314', kind: 'test', stage: 'patch', arm: 'base', exit: 101, cmd: 'nextest run -p nodedb', log: '/tmp/x/red.log', sha256: 'sha256:aa', head: 'a'.repeat(40) },
  { v: 1, ts: '2026-09-25T00:04:00Z', task: 'issue314', kind: 'test', stage: 'patch', arm: 'fix', exit: 0, cmd: 'nextest run -p nodedb', log: '/tmp/x/green.log', sha256: 'sha256:bb', head: 'b'.repeat(40) },
  { v: 1, ts: '2026-09-25T00:05:00Z', task: 'issue314', kind: 'hygiene', stage: 'patch', exit: 0, cmd: 'preflight', log: '/tmp/x/hyg.log', sha256: 'sha256:cc' },
  { v: 1, ts: '2026-09-25T00:06:00Z', task: 'issue314', kind: 'review', stage: 'review', verdict: 'PASS', blockers: 0, role: 'drill-auditor', head: 'b'.repeat(40), text: 'parity audit clean' },
]

test('the body leads with the subject and carries every proof row', () => {
  const body = renderPrBody('issue314', entries, { title: 'fix: guard the empty sequence registry', why: 'A missing sequence panicked the shard.', issue: '314' })
  const lines = body.split('\n')
  assert.equal(lines[0], 'fix: guard the empty sequence registry')
  assert.match(body, /## Why\n\nA missing sequence panicked the shard\./)
  assert.match(body, /nodedb\/src\/control\/sequence\/types\.rs/, 'changed files come from blast evidence')
  assert.match(body, /red \(fails on base\).*nextest run -p nodedb.*101.*red\.log.*a{12}/)
  assert.match(body, /green \(passes with fix\).*0.*green\.log.*b{12}/)
  assert.match(body, /preflight.*0.*hyg\.log/)
  assert.match(body, /Review 2 verdict: \*\*PASS\*\* \(0 blockers\) · role `drill-auditor`/)
  assert.match(body, /Evidence bound to commit|README|✅/)
  assert.match(body, /Closes #314/)
})

test('a body without a red proof says so instead of implying one', () => {
  const greenOnly = entries.filter(e => !(e.kind === 'test' && e.arm === 'base'))
  const body = renderPrBody('issue314', greenOnly, { title: 'fix: x', issue: '314' })
  assert.match(body, /No red proof is recorded/)
  assert.doesNotMatch(body, /No green proof is recorded/, 'the green run is still in the ledger')
  assert.match(body, /\| red \(fails on base\) \| — \| — \| — \| — \|/)
  assert.match(body, /\| green \(passes with fix\) \| `nextest run -p nodedb` \| 0 \|/)
})

test('lintPrBody reports an absent core instead of failing', () => {
  const result = lintPrBody('fix: x\n\nbody', { core: join(root, 'no-such-core.py') })
  assert.equal(result.available, false)
  assert.deepEqual(result.blockers, [])
})

test('lintPrBody surfaces blockers and good notes from a core', () => {
  const core = join(root, 'fake-core.py')
  writeFileSync(core, `import json,sys
payload = json.load(sys.stdin)
print(json.dumps({"ok": False, "score": 50, "subject": "fix: x", "verdict": "fix blockers first",
  "issues": [{"level": "blocker", "rule": "why-missing", "msg": "body does not explain why"},
             {"level": "nit", "rule": "typo", "msg": "minor"}],
  "good": ["subject length ok"]}))
`)
  const result = lintPrBody('fix: x', { core })
  assert.equal(result.available, true)
  assert.equal(result.ok, false)
  assert.equal(result.score, 50)
  assert.deepEqual(result.blockers, ['why-missing: body does not explain why'])
  assert.deepEqual(result.good, ['subject length ok'])
})

test('lintPrBody tolerates a core that crashes', () => {
  const core = join(root, 'crash-core.py')
  writeFileSync(core, 'import sys\nsys.exit(3)\n')
  const result = lintPrBody('fix: x', { core })
  assert.equal(result.available, true)
  assert.equal(result.ok, null)
  assert.match(result.error, /./)
})

test('the real pr-craft core scores a rendered body', { skip: !existsSync(DEFAULT_PR_CORE) }, () => {
  const body = renderPrBody('issue314', entries, { title: 'fix: guard the empty sequence registry', why: 'A missing sequence panicked the shard.', issue: '314' })
  const result = lintPrBody(body, { core: DEFAULT_PR_CORE })
  assert.equal(result.available, true)
  assert.equal(result.error, null)
  assert.equal(typeof result.score, 'number')
  assert.equal(typeof result.verdict, 'string')
  assert.ok(Array.isArray(result.blockers))
})

test('the PR-craft core resolves inside the package before falling back to $HOME', () => {
  // A published install has no ~/scripts/pr_craft.py, so the core has to come
  // from the package itself — otherwise drill_pr writes a body nobody scored.
  assert.match(DEFAULT_PR_CORE, /core[/\\]pr_craft\.py$/, 'the bundled core wins when it exists')
  assert.ok(existsSync(DEFAULT_PR_CORE), 'and it exists in this checkout')

  const lint = lintPrBody('fix(seq): keep the batch ordered\n\n## What changed\n\n- a\n', { core: DEFAULT_PR_CORE })
  assert.equal(lint.available, true, 'the bundled core runs')
  assert.equal(lint.error, null)
})
````

## `test/search.test.js`

sha256 `bf1a0d746a4b8c32ba399a26d6fd7af3fce507a0120f94cf99bbfbab81e9a822` · 135 lines

````javascript
import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'

import { definitionPattern, indexDirFor, indexFor, indexRoot, indexSlug, parseJsonLine, readIndexMeta, resolveBin, resolveEngine, searchText } from '../lib/search.js'

const root = mkdtempSync(join(tmpdir(), 'drill-search-'))
after(() => rmSync(root, { recursive: true, force: true }))

const repo = join(root, 'repo')
mkdirSync(join(repo, 'src'), { recursive: true })
writeFileSync(join(repo, 'src', 'a.rs'), 'pub fn target_fn(x: u32) -> u32 {\n    x + 1\n}\n\nfn other() {}\n')
writeFileSync(join(repo, 'src', 'b.rs'), 'use crate::a::target_fn;\n\nfn caller() { let _ = target_fn(1); }\n')

test('resolveBin finds a real binary and rejects a missing one', () => {
  const rg = resolveBin('rg')
  assert.ok(rg !== null && rg.endsWith('rg'), 'ripgrep is expected on this host')
  assert.equal(resolveBin('definitely-not-a-real-binary-xyz'), null)
})

test('resolveEngine prefers tgrep only when the root carries an index', () => {
  const auto = resolveEngine({ engine: 'auto', root: repo, indexDir: join(root, 'no-indexes') })
  assert.equal(auto.engine, 'rg', 'no index anywhere for this root')

  // A separate root so the in-tree marker cannot leak into the other cases.
  const indexedRoot = join(root, 'root-with-intree-index')
  mkdirSync(join(indexedRoot, '.tgrep'), { recursive: true })
  const indexed = resolveEngine({ engine: 'auto', root: indexedRoot, indexDir: join(root, 'no-indexes') })
  if (resolveBin('tgrep') === null) {
    assert.equal(indexed.engine, 'rg', 'tgrep is not installed here, so auto falls back to rg')
  } else {
    assert.equal(indexed.engine, 'tgrep', 'an in-tree index switches auto to tgrep')
    assert.equal(indexed.indexDir, join(indexedRoot, '.tgrep'))
  }

  assert.equal(resolveEngine({ engine: 'rg', root: repo }).engine, 'rg')
  assert.equal(resolveEngine({ engine: 'rg', root: repo, rgBin: 'nope-xyz' }), null)
})

test('parseJsonLine reads a match event and ignores everything else', () => {
  const line = JSON.stringify({
    type: 'match',
    data: { path: { text: 'src/a.rs' }, line_number: 12, lines: { text: 'fn target_fn() {}\n' }, submatches: [{ start: 3, end: 12, match: { text: 'target_fn' } }] },
  })
  assert.deepEqual(parseJsonLine(line), { file: 'src/a.rs', line: 12, column: 4, text: 'fn target_fn() {}' })
  assert.equal(parseJsonLine('{"type":"begin","data":{}}'), null)
  assert.equal(parseJsonLine('not json'), null)
  assert.equal(parseJsonLine(''), null)
})

test('definitionPattern escapes regex metacharacters and only matches definitions', () => {
  const pattern = definitionPattern('nextval_batch')
  assert.match(pattern, /fn\|struct/)
  assert.ok(!definitionPattern('a.b').includes('a.b'), 'the dot is escaped')
  assert.match(definitionPattern('a.b'), /a\\\.b/)
})

test('searchText returns labelled hits and an empty result for a miss', () => {
  const hit = searchText({ pattern: definitionPattern('target_fn'), root: repo, engine: 'rg' })
  assert.equal(hit.engine, 'rg')
  assert.equal(hit.error, null)
  assert.equal(hit.hits.length, 1)
  assert.equal(hit.hits[0].file, join(repo, 'src', 'a.rs'))
  assert.equal(hit.hits[0].line, 1)

  const miss = searchText({ pattern: 'no_such_symbol_anywhere', root: repo, engine: 'rg' })
  assert.deepEqual(miss.hits, [])
  assert.equal(miss.error, null, 'a no-match exit code is an empty result, not a failure')

  const wordy = searchText({ pattern: 'target', word: true, fixed: true, root: repo, engine: 'rg' })
  assert.deepEqual(wordy.hits, [], 'whole-word matching excludes target_fn')

  const occurrences = searchText({ pattern: 'target_fn', word: true, fixed: true, root: repo, engine: 'rg' })
  assert.equal(occurrences.hits.length, 3, 'definition, use statement and call site')
})

test('searchText reports an unavailable engine instead of throwing', () => {
  const result = searchText({ pattern: 'x', root: repo, engine: 'rg', rgBin: 'definitely-missing-xyz' })
  assert.equal(result.engine, null)
  assert.match(result.error, /neither rg nor tgrep/)
})

const hasTgrep = resolveBin('tgrep') !== null

test('index paths are stable and root-specific', () => {
  const a = indexSlug('/home/user/projects/nodedb-296')
  assert.equal(a, 'home-user-projects-nodedb-296')
  assert.equal(indexDirFor('/home/user/projects/nodedb-296', '/cache'), join('/cache', a))
  assert.notEqual(indexSlug('/a/b'), indexSlug('/a/c'))
})

test('readIndexMeta reports nothing for an empty directory', () => {
  const empty = join(root, 'empty-idx')
  mkdirSync(empty, { recursive: true })
  assert.equal(readIndexMeta(empty), null)
  assert.equal(indexFor(repo, join(root, 'no-such-base')), null)
})

test('indexRoot builds outside the worktree and leaves no .tgrep inside it', { skip: !hasTgrep }, () => {
  const baseDir = join(root, 'idx-base')
  const built = indexRoot({ root: repo, baseDir })
  assert.equal(built.ok, true, built.error ?? '')
  assert.ok(built.dir.startsWith(baseDir), 'the index lives in the cache base')
  assert.equal(existsSync(join(repo, '.tgrep')), false, 'the worktree stays clean')
  const meta = readIndexMeta(built.dir)
  assert.ok(meta.files >= 2, 'both source files are indexed')
  assert.equal(indexFor(repo, baseDir), built.dir, 'the index is matched back to its root')
  assert.equal(indexFor(join(root, 'other-repo'), baseDir), null, 'a different root does not borrow it')
})

test('auto picks tgrep once an out-of-tree index exists, and searches through it', { skip: !hasTgrep }, () => {
  const baseDir = join(root, 'idx-base')
  const resolved = resolveEngine({ engine: 'auto', root: repo, indexDir: baseDir })
  assert.equal(resolved.engine, 'tgrep')
  assert.equal(resolved.indexDir, indexDirFor(repo, baseDir))

  const found = searchText({ pattern: definitionPattern('target_fn'), root: repo, engine: 'auto', indexDir: baseDir })
  assert.equal(found.engine, 'tgrep')
  assert.equal(found.error, null)
  assert.equal(found.hits.length, 1)
  assert.equal(found.hits[0].line, 1)

  const forced = resolveEngine({ engine: 'rg', root: repo, indexDir: baseDir })
  assert.equal(forced.engine, 'rg')
  assert.equal(forced.indexDir, null, 'forcing rg ignores the index')
})

test('indexRoot reports a missing tgrep binary instead of throwing', () => {
  const built = indexRoot({ root: repo, baseDir: join(root, 'x'), tgrepBin: 'definitely-missing-xyz' })
  assert.equal(built.ok, false)
  assert.match(built.error, /tgrep is not available/)
})
````


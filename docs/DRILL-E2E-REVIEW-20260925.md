# The drill — end-to-end review, 2026-09-25

*Scope: `~/projects/dsh-drill` (the DSH plugin, 16 tools) and `~/projects/DRILL-BUG-FULL-DOC-20260925.md` (429 lines after the corrections below), from §0 to Appendix D. The document now covers the plugin and its specification only — the §7 porting plan was removed on request, and the audit that checked it is recorded in §1 for the record. Method: three independent read-only audits of the document against the source and the machine, plus a source-level audit of every tool's ledger writes. Every finding below was reproduced before it was fixed, and every fix carries a test. Result: **v0.8.0**, 88 → 97 tests, 0 failures.*

---

## 1. How this was reviewed

| Audit | Question | Verdict summary |
|---|---|---|
| **A. Tool ↔ ledger** | for each of the 16 tools, what does it *actually* append, and does the doc's `Writes` column say so? | 9 match, 7 mismatch — 6 of them real defects |
| **B. Resolution layers (§4)** | do the c2g claims hold against the real databases? | 14 verified; 3 precision defects; nothing contradicted |
| **C. Layout, appendices, counts** | §3.2/§3.3, Appendices A–D, tool/test counts | 6 defects, including the gate-binding hole and stale counts |

A fourth audit checked the §7 porting plan against the installed Claude Code, Codex, opencode/Kilo and Gemini surfaces; it found four wrong-or-stale claims (`--max-turns` does not exist in Claude Code 2.1.138, the `codex`/`kilo`/`gemini` CLIs are not installed here, two path errors). Those corrections lived only in §7, so removing the section retired them; the audit is noted here for the record rather than dropped silently.

Each audit was told to cite file:line or a command's raw output, and to mark anything it could not settle as *unverified* rather than guess. Findings that rested on another agent's reading were re-checked by hand before being written into the doc (the shard roots `rp_engine` and `maya`, the relative toolchain panic header, the gate predicate).

---

## 2. Defects found and fixed (v0.8.0)

Ordered by what they could have done to a real drill, not by where they live.

### 2.1 A required gate could close with no commit bound to it

`lib/gates.js` skipped its staleness test whenever the record carried no `head`:

```js
const stale = expected !== null && last?.head !== undefined && last.head !== expected
```

So `drill_record {kind: 'review', verdict: 'PASS', blockers: 0}` — no `head`, because the tool had no such parameter — closed the `review` gate while the green proof sat on another commit. The same hole existed for `pr`. Proof at HEAD `95864cb`: `evaluate()` on a green-with-head plus a head-less review+pr printed `review ok= true | pr ok= true`.

**Fix.** A missing `head` is now as stale as a wrong one, for both gates; the detail string says which case it is. `drill_record` gained an explicit `head` (and `branch`) parameter — no auto-fill, because filling it in for the caller would defeat the binding. Two-sided test: a hand-written review closes the gate only when it names the green commit.

### 2.2 A red proof could disappear, and a green proof could be hand-written

- **Disappear.** A test killed by a signal reports `exit: null` to Node, and the ledger refuses a non-integer exit — so "it segfaults on base", the canonical red proof, produced **no record at all**, with an orphaned log. `runCapture` now maps a signal to `128 + signo` (SIGSEGV → 139) and reports the signal; `drill_run` names it in `note`. Test kills a shell with `SIGSEGV` and asserts the `red` gate closes on it.
- **Hand-written.** `drill_record {kind: 'test', arm: 'fix', exit: 0, log: '.../README.md'}` closed `green`: the write-time check only proved the file existed and hashed. A `test`/`hygiene` log must now live under that task's own `logs/` directory, which only the executor writes. `test` records also require an `arm`, and `hygiene` now requires a log at all (previously only `test` did).

The residual trust boundary is now stated in the doc instead of implied: someone who copies a file into `logs/` can still forge a record. The ledger is a local file, not a signed log; `pre-push` and Review 2 are what stand behind it.

### 2.3 Rule 8 ("a miss is a note") still had two holes

The v0.7.1/v0.7.3 fixes covered `drill_locate`, `drill_blast` and `drill_search`. The audit found two more paths writing evidence for a non-answer:

- **`drill_error`**: `files` was `frames.filter(f => !f.external)` (empty for a toolchain-only signal) while `text` was unconditional — and `lib/errors.js` matched toolchain paths only when absolute, so a panic header reading `library/std/src/panicking.rs:597` was treated as a *repository* file. Two fixes: relative toolchain/dependency prefixes (`library/std/`, `node_modules/`, `.cargo/registry/`, …) are external too, matched as prefixes so a repo that genuinely contains `src/library/std/` keeps its own file; and a signal with no repository frame records a note, not evidence.
- **`drill_locate`'s merged-store fallback**: it wrote `text` whenever the store knew the name, even when every hit lived in another shard or worktree. Now note-only: the store answered, but this task has no file to patch.

### 2.4 Evidence could be labelled with a base that was never compared

`diffFiles` retried `git diff --diff-filter=ACMR HEAD` when `${base}...HEAD` failed and returned `error: null`, so `drill_diff` recorded `base: 'origin/main'` and `cmd: 'git diff … origin/main...HEAD'` for files that came from the worktree diff. That wrong label reaches the PR body's "what changed". The fallback is now flagged, recorded as its own command, and carries no `base`.

### 2.5 A crashed lint counted as a clean PR body

`clean = !lint.available || lint.blockers.length === 0`, and the PR core reports `available: true` with an `error` when it crashes — so a `pr` record was written for a body nobody scored. `clean` now requires the lint to have run without error.

### 2.6 Nine documentation defects

| Where | Was | Now |
|---|---|---|
| §0 vs §5.1 vs Appendix C | three different versions of "current" (`v0.7.0`, `v0.7.2`, `v0.7.3`) and three different test counts | one version, one count, measured |
| §4 shard map | seven `nd_*` shards | plus `rp_engine` → `~/Bumi-Hijau/rp-engine-py` (5,354 nodes) and `maya` → `~/scripts` (4,855) — 15.0% of the store that a consumer switching on the seven `nd_*` shards would have silently dropped |
| §4 project-key trap | "not `sha256(abs path)`" | it *is* a deterministic hash (blake3, upstream `location.rs:24-36`), stored as a 32-byte BLOB whose `lower(hex())` names the directory — hence match on `meta.canonical_root` |
| §4 `nd_rest` | "already worktree-relative" | every store path carries its shard prefix; strip `nd_rest/` |
| §3.2 | `logs/<stamp>-<label>-<arm>.log` | `[-<arm>]`: hygiene runs carry no arm |
| §5.2/Appendix C | `test-runner.md` "shared with `~/.kilo/agent/`" | it exists only under `~/.config/kilo/agents/`; `~/.kilo/agent/` holds the other two agents |
| Appendix B | `dsh plugin --profile drill list` presented as a check | exits 127 here (`pnpm was not found`, `dsh` off-`PATH`) and writes a plugin-manager log; `dsh --profile drill --dump-config` is the check that works |

Two doc claims were confirmed and left alone: the tool count (16, exactly) and the `pre-push` bypass note.

---

## 3. Verified true (the part that matters as much)

- **Gates.** All eight predicates match Appendix A and §1.1, including `requiredForDone` flags and stage ids. `red`/`green`/`hygiene`/`review` are required; `localize`/`blast`/`edge`/`pr` are advisory.
- **Ledger.** One `O_APPEND` write per record, no lock file, torn final line skipped, complete bad line refused with its line number — all three behaviours reproduced.
- **Caches.** `~/.cache/dsh-drill` holds `c2g-discovery.json` (47 entries, `schemaVersion: 3`, touch-on-hit) and 7 tgrep indexes; the 7-day constant exists and the TTL measures idleness.
- **c2g.** 24 project caches, all `user_version = 3`; `role = '"Call"'` returns 53,335 rows where `role = 'Call'` returns 0; spans are byte offsets (verified by slicing a 2,554-byte file); 5 of 24 caches have no active snapshot **and** zero symbols/edges, which is exactly why "no snapshot = no coverage" is the right rule; merged store has 68,089 nodes / 73,726 links and the shard mapping resolves 7/7 documented shards into `~/projects/nodedb-296`.
- **Shared cores.** All 12 §5.2 paths exist; `pr_craft.py selftest` passes its 10 cases; `c2g_tools.py` is v1.1.0 with `frame`/`error`.
- **Claims about other repos.** `dsh-issue2pr` runs its test stage (`07-test-report`) after the patch stage (`06-implementation`) and contains no `red` arm and no `sha256` — it has no red-proof stage, as §2 says. `maya-recover`'s `sha256()` really is FNV-1a (8 hex chars), `recordEvidence` really does bind `success = true` for every row, and its `StaleTracker`/`CircuitBreaker` factories are called from nowhere.

---

## 4. Unverified, and why

| Item | Why it stayed open |
|---|---|
| The c2g **binary's** >60 s hang | not re-run: it previously hung >60 s, and both audits were read-only by instruction. The cache-first rule stands on the original observation. |
| 7-day idle TTL expiry | all 7 indexes were 7.4 hours old at review time; nothing could expire. The constant and the touch are verified, the expiry itself is not. |
| `1.5 s` tgrep build, `~2 ms` query | not measured (a build writes); one read-only SQL took 6 ms wall clock. |
| `c2g hung` / `dsh` scratch boot / `drill_cache prune` | mutating actions, deliberately not run during a review. |

Two design questions were *decided*, not verified, and are flagged as such in the doc: a store hit whose file is not in this worktree does not localize (the drill must have a file to patch), and a non-git workspace cannot commit-bind anything.

---

## 5. Residual risks (accepted, documented)

1. **Forgery is possible for someone who writes into `.drill/<task>/logs/`.** The drill proves *its own* runs; it cannot prove that a file was produced by a process rather than copied. Trust boundary, stated in §3.1.
2. **`pre-push` is bypassable** with `--no-verify`. Unchanged; needs a server-side check when pushes go through a hosted remote.
3. **The drift guard is schema-deep, not semantic-deep.** The plugin notices a c2g cache schema bump and says so in every record; it cannot know whether a *same-version* cache changed meaning.
4. **The ledger has no lock file.** Correct for one writer per task; two processes on the same task are outside the guarantee (§3.1).

---

## 6. What changed in the tree

- **`~/projects/dsh-drill`** — v0.8.0: `lib/gates.js` (commit binding for `review`/`pr`), `lib/ledger.js` (log provenance, arm, hygiene log, `logs` path), `lib/runner.js` (signal exit codes), `lib/git.js` (fallback flag), `lib/errors.js` (relative toolchain prefixes), `index.js` (`drill_record` head/branch, `drill_diff` fallback labelling, `drill_pr` lint-crash, `drill_locate` store-miss, `drill_run` signal, `requireLog` config, note fix), README, plus new cases in `test/{core,errors,integration}.test.js`: **88 → 97 tests**.
- **`~/projects/DRILL-BUG-FULL-DOC-20260925.md`** — versions and counts reconciled, §3.1/§3.2/§4/§5.1/§5.2/§7 (risks, formerly §8) and Appendices A–C corrected, and a risks block (now §7) recording each defect with the version that fixed it.
- Nothing was pushed; all commits are local, as instructed.

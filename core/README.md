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

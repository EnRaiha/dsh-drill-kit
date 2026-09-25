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
printf '{"tool":"blast_radius","name":"coerce_value","root":"/home/maya/projects/nodedb"}' \
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

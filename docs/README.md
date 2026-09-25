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


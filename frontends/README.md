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

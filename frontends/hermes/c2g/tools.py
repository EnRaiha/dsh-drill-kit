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

"""Handlers for the pr-craft Hermes plugin.

All logic lives in one stdlib-only core shared with the Kilo plugin:
/home/maya/scripts/pr_craft.py. Handlers return JSON strings (Hermes convention),
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

CORE = Path(os.environ.get("PR_CRAFT_CORE", "/home/maya/scripts/pr_craft.py"))
LOG = Path("/home/maya/logs/pr-craft.log")
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

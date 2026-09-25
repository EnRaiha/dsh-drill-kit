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

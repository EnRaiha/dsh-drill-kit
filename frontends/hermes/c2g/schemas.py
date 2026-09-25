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

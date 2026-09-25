"""c2g — straight code2graph access for Hermes (dbless).

Registers 8 tools. All logic lives in the shared stdlib-only core
/home/maya/scripts/c2g_tools.py (same core the Kilo plugin bridges into), so the
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

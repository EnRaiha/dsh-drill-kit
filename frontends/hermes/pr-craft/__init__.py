"""pr-craft — PR & code-review craft for Hermes.

Registers 5 tools, the pre_llm_call context-injection hook, and a /pr command.
All logic lives in the shared stdlib-only core core/pr_craft.py
(same core the Kilo plugin bridges into), so the two stay in sync.
"""

from . import schemas
from . import tools


def register(ctx):
    # ── Tools ──
    ctx.register_tool(name="pr_checklist", toolset="pr-craft",
                      schema=schemas.PR_CHECKLIST, handler=tools.handle_pr_checklist)
    ctx.register_tool(name="pr_lint_description", toolset="pr-craft",
                      schema=schemas.PR_LINT_DESCRIPTION, handler=tools.handle_pr_lint_description)
    ctx.register_tool(name="pr_lint_comment", toolset="pr-craft",
                      schema=schemas.PR_LINT_COMMENT, handler=tools.handle_pr_lint_comment)
    ctx.register_tool(name="pr_lint_diff", toolset="pr-craft",
                      schema=schemas.PR_LINT_DIFF, handler=tools.handle_pr_lint_diff)
    ctx.register_tool(name="pr_review_plan", toolset="pr-craft",
                      schema=schemas.PR_REVIEW_PLAN, handler=tools.handle_pr_review_plan)

    # ── Injection: PR/review intent in the user message -> distilled checklist ──
    ctx.register_hook("pre_llm_call", tools.pre_llm_call)

    # ── Slash command ──
    ctx.register_command("pr", tools.command_pr,
                         description="PR craft: /pr checklist [role] | /pr desc <title> | "
                                     "/pr comment <text> | /pr diff <diff>")

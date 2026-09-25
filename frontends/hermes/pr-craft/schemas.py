"""Tool schemas — what the LLM sees for the pr-craft plugin."""

PR_CHECKLIST = {
    "name": "pr_checklist",
    "description": (
        "PR/code-review checklist distilled from 6 review guides (Google eng-practices, "
        "mawrkus, thoughtbot, book-pr, Pro Git, first-contributions). Use before authoring "
        "a PR or before starting a review."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "role": {
                "type": "string",
                "enum": ["both", "author", "reviewer"],
                "description": "Whose checklist: both (default), author, reviewer",
            }
        },
    },
}

PR_LINT_DESCRIPTION = {
    "name": "pr_lint_description",
    "description": (
        "Lint a PR title + description against the distilled rules (subject length and "
        "imperative mood, body explains why, issue reference, steps to test, screenshot for "
        "UI changes, 'clean up later' trap). Returns blockers, warnings, nits and a score."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "title": {"type": "string", "description": "PR title (subject line)"},
            "body": {
                "type": "string",
                "description": "PR description body; omit to lint the title only",
            },
        },
        "required": ["title"],
    },
}

PR_LINT_COMMENT = {
    "name": "pr_lint_comment",
    "description": (
        "Lint a draft review comment for tone and usefulness: blame/judgment/diminishing "
        "words, imperative demands, missing severity label (Nit:/Optional:/FYI:), missing "
        "rationale or alternative, untested code suggestions. Returns a suggested rewrite."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "text": {"type": "string", "description": "The draft comment text"},
            "role": {
                "type": "string",
                "enum": ["reviewer", "author"],
                "description": "Who is writing the comment (default reviewer)",
            },
        },
        "required": ["text"],
    },
}

PR_LINT_DIFF = {
    "name": "pr_lint_diff",
    "description": (
        "Gate a diff/PR size before review: churn and file-count verdict (ok/warn/split), "
        "whether tests travel with the code, mixed-refactor detection, and the main files to "
        "read first. Feed it `git diff`, `git diff --cached`, or a diffstat summary."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "diff": {"type": "string", "description": "Unified diff or diffstat text"},
        },
        "required": ["diff"],
    },
}

PR_REVIEW_PLAN = {
    "name": "pr_review_plan",
    "description": (
        "Build the 3-pass review plan for a diff (broad view -> main parts -> the rest) plus "
        "the size gate, the main files to read first, and reminders about severity labels and "
        "positive feedback."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "diff": {"type": "string", "description": "Unified diff or diffstat text"},
        },
        "required": ["diff"],
    },
}

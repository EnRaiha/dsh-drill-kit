#!/usr/bin/env python3
"""pr_craft — PR & code-review craft core (stdlib only).

Distilled from 6 review guides (Google eng-practices, mawrkus, thoughtbot,
book-pr, Pro Git, first-contributions). Shared logic for the Kilo Code plugin
(~/.kilo/plugins/pr-craft) and the Hermes plugin (~/.hermes/plugins/pr-craft).

CLI (JSON on stdout, always exit 0):
    pr_craft.py detect        [--text T | --file F | --stdin]
    pr_craft.py context       [--role reviewer|author|both] [--text T | --stdin]
    pr_craft.py checklist     [--role reviewer|author|both]
    pr_craft.py lint-desc     [--text T | --file F | --stdin]
    pr_craft.py lint-comment  [--text T | --file F | --stdin] [--role reviewer|author]
    pr_craft.py lint-diff     [--text T | --file F | --stdin]
    pr_craft.py plan          [--text T | --file F | --stdin]
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys

# ---------------------------------------------------------------- checklists

CHECKLISTS = {
    "author": [
        "One self-contained change; refactors separate; tests in the same PR",
        "Draft PR opened early; description has task ref, what/why, steps to test, screenshots",
        "Self-reviewed the rendered diff outside the IDE; anticipated obvious objections",
        "CI green before requesting review",
        "2-3 reviewers chosen deliberately (+ domain expert if needed)",
        "Every comment answered; feedback rounds pushed as isolated commits",
        "Merge only when confident; final editorial control is the author's",
    ],
    "reviewer": [
        "Read the description first: should this change exist at all?",
        "Design problems sent immediately, before finishing the read",
        "Every line + context (whole file, whole system); tests read as carefully as code",
        "Severity labels on comments (Nit:/Optional:/FYI:); alternatives with references",
        "Comments about the code, never the developer; at least one genuine positive",
        "Responded within one business day; did not interrupt deep work to do it",
        "Followed up and approved once the contract was met (or escalated - never limbo)",
    ],
    "flow": [
        "Small PR = one self-contained change: ~100 lines fine, ~1000 too large",
        "Standard is code health improving, not perfection - approve when clearly better",
        "Response <= 1 business day; speed of replies beats speed of the whole review",
        "Review is a contract: author does what you asked -> you approve, and follow up",
        "No 'clean up later' - fix now, or file an issue assigned to the author",
        "Ask/explain/suggest ('why not ...?'), never demand; label severity",
        "3-4 replies without progress -> move to chat/call, then post the summary back",
    ],
}

TRIGGERS = [
    (r"\bgh\s+pr\b|\bpull request\b|\bpull-request\b|\bpr\b|\bmr\b|\bmerge request\b", "pr"),
    (r"\bcode review\b|\breview(ing|er|s)?\b|\blgtm\b|\bnit:", "review"),
    (r"\bdiff\b|\bpatch\b|\bchanges requested\b|\bapprove\b|\bapproval\b", "diff"),
    (r"\bcommit message\b|\bsquash\b|\brebase\b|\bmerge conflict\b", "git"),
]
# Words that make a hit an AUTHOR-side hit, a REVIEWER-side hit, or both.
AUTHOR_SIGNS = r"\b(my|our)\s+(pr|mr|patch|branch|diff)\b|\bi (wrote|opened|created|pushed)\b|" \
               r"\bpr description\b|\bcommit message\b|\brequest(ing)? review\b|\bsplit (the|this) (pr|cl)\b"
REVIEWER_SIGNS = r"\breview(ing|er)?\b|\blgtm\b|\bnit\b|\bapprove\b|\bcomment(s|ing)?\b|" \
                 r"\bwhat to look for\b|\bfeedback\b|\bthis (pr|mr|diff|patch) (looks|seems)\b"
# Never inject on pure chatter mentioning "PR" in passing.
STOP = r"^\s*(/|!)\w+|^\s*(hey|hi|hello|thanks|ok)\W*$"

SEV_LABELS = ("nit:", "optional:", "consider:", "suggestion:", "fyi:", "blocker:", "question:")

# ------------------------------------------------------------------ helpers


def _text_from(args) -> str:
    if getattr(args, "stdin", False):
        raw = sys.stdin.read()
        try:
            payload = json.loads(raw)
            if isinstance(payload, dict):
                return str(payload.get("text") or payload.get("message") or "")
        except Exception:
            pass
        return raw
    if getattr(args, "file", None):
        with open(args.file, encoding="utf-8", errors="replace") as fh:
            return fh.read()
    return getattr(args, "text", "") or ""


def _hits(pattern: str, text: str) -> list[str]:
    return sorted({m.group(0).strip().lower() for m in re.finditer(pattern, text, re.I)})


# ------------------------------------------------------------------- detect


def detect(text: str) -> dict:
    text = (text or "").strip()
    if len(text) < 6 or re.match(STOP, text, re.I):
        return {"hit": False, "role": None, "signals": [], "reason": "too short / chatter"}
    signals: list[str] = []
    for pattern, label in TRIGGERS:
        found = _hits(pattern, text)
        if found:
            signals.append(label)
    if not signals:
        return {"hit": False, "role": None, "signals": [], "reason": "no PR/review signal"}
    author = bool(re.search(AUTHOR_SIGNS, text, re.I))
    reviewer = bool(re.search(REVIEWER_SIGNS, text, re.I))
    role = "both" if author and reviewer else "author" if author else "reviewer"
    return {"hit": True, "role": role, "signals": sorted(set(signals)), "reason": "trigger matched"}


def checklist(role: str = "both") -> dict:
    if role == "both":
        items = CHECKLISTS["flow"] + CHECKLISTS["author"] + CHECKLISTS["reviewer"]
    else:
        items = CHECKLISTS[role]
    return {"role": role, "count": len(items), "items": items, "sections": CHECKLISTS}


def context_block(text: str = "", role: str | None = None) -> dict:
    det = detect(text) if text else {"hit": True, "role": role or "both", "signals": [], "reason": "forced"}
    role = role or det.get("role") or "both"
    if not det.get("hit"):
        return {"inject": False, "role": None, "context": "", "detect": det}
    lines = ["<pr-craft>", "PR/code-review mode detected. Apply the distilled checklist:", ""]
    for item in CHECKLISTS["flow"]:
        lines.append(f"- {item}")
    side = "author" if role == "author" else "reviewer" if role == "reviewer" else None
    if side:
        lines += ["", f"{side.upper()} side:"]
        lines += [f"- {i}" for i in CHECKLISTS[side]]
    else:
        lines += ["", "AUTHOR side:"] + [f"- {i}" for i in CHECKLISTS["author"]]
        lines += ["", "REVIEWER side:"] + [f"- {i}" for i in CHECKLISTS["reviewer"]]
    lines += [
        "",
        "Before posting a review comment or a PR description, run pr_lint_comment / pr_lint_description "
        "and fix the blockers. Full distilled guide: "
        "~/Bumi-Hijau/inbox/pr-guides/DISTILLED-pr-review-workflow.md",
        "</pr-craft>",
    ]
    return {"inject": True, "role": role, "context": "\n".join(lines), "detect": det}


# ---------------------------------------------------------- lint: description

BAD_SUBJECTS = (
    "fix bug", "bugfix", "fix build", "add patch", "update", "updates", "changes", "wip",
    "misc", "temp", "phase 1", "fix", "done", "stuff", "various", "cleanup", "minor fixes",
)


def lint_description(text: str) -> dict:
    text = (text or "").replace("\r\n", "\n").strip()
    issues: list[dict] = []
    good: list[str] = []

    def add(level: str, rule: str, msg: str) -> None:
        issues.append({"level": level, "rule": rule, "msg": msg})

    lines = text.split("\n")
    subject = next((l.strip() for l in lines if l.strip()), "")
    rest = "\n".join(lines[lines.index(subject) + 1:]) if subject else ""
    body = strip_html_comments(rest)

    if not subject:
        add("blocker", "subject", "No PR title/subject found.")
    else:
        n = len(subject)
        if n > 72:
            add("blocker", "subject-length", f"Subject is {n} chars - keep it under ~50 (hard max 72).")
        elif n > 50:
            add("nit", "subject-length", f"Subject is {n} chars - trim toward ~50 so it reads in history.")
        else:
            good.append(f"subject length ok ({n})")
        first = re.sub(r"^[\[(][^\])]*[\])]\s*", "", subject).split(" ")[0].strip(":.,").lower()
        if re.fullmatch(r"[a-z]+(ing|ed)", first) and first not in {"read", "red"}:
            add("warn", "imperative", f"'{first}' looks like gerund/past tense - write the subject as an order "
                                      "(e.g. 'Add ...', 'Fix ...', 'Remove ...').")
        if subject.rstrip().endswith("."):
            add("nit", "subject-period", "Drop the trailing period on the subject line.")
        low = re.sub(r"^[\[(][^\])]*[\])]\s*", "", subject).lower()
        if any(low.startswith(b) or low == b for b in BAD_SUBJECTS):
            add("blocker", "bad-subject", f"'{subject}' says nothing a future reader can act on - state what changed.")
        tags = re.findall(r"[\[\(][^\])]{1,40}[\])]", subject)
        if len(tags) > 2:
            add("nit", "tags", f"{len(tags)} tags in the subject overwhelm the first line - move them into the body.")
        if not rest.strip():
            add("blocker", "no-body", "No description body: add what changed and *why* (future readers search by this).")
        elif not re.match(r"^\s*$", lines[lines.index(subject) + 1] if len(lines) > lines.index(subject) + 1 else ""):
            add("nit", "blank-line", "Put a blank line between the subject and the body.")

    if body.strip():
        has_why = bool(re.search(r"\b(because|so that|reason|why|in order to|to avoid|trade-?off|motivation)\b",
                                  body, re.I))
        if has_why:
            good.append("body explains why")
        else:
            add("warn", "why-missing", "Explain *why* the change is needed, not only what it does - the diff already "
                                       "shows the what.")
        if not re.search(r"#\d+|https?://\S+|\b(jira|issue|ticket|linear|github)\b", body, re.I):
            add("info", "no-ref", "No issue/design link: another reader will not find the context later.")
        if not re.search(r"\btest(ed|ing|s)?\b", body, re.I):
            add("warn", "no-test-steps", "Add 'steps to test' (or the commands run) so the reviewer can reproduce.")
        else:
            good.append("test steps present")
        if re.search(r"\b(ui|frontend|front-end|component|style|css|screen|button|form|layout)\b", text, re.I) \
                and not re.search(r"!\[|\.png|\.jpg|\.gif|\.mp4|screenshot|screen ?cast|video", body, re.I):
            add("info", "ui-no-visual", "UI-facing change with no screenshot/video - reviewers cannot judge visuals "
                                        "from a diff.")
        if re.search(r"\b(next steps|follow-?ups?|not in this pr|out of scope)\b", body, re.I):
            good.append("next steps / out-of-scope declared")
        if re.search(r"\b(clean(ed|ing)? ?up later|cleanup later|do it later|will fix later|temporary|for now)\b", body, re.I):
            add("warn", "later-trap", "'Later' work almost never happens - do it now, or file an issue assigned to you.")

    blockers = [i for i in issues if i["level"] == "blocker"]
    warns = [i for i in issues if i["level"] == "warn"]
    score = max(0, 100 - 25 * len(blockers) - 10 * len(warns) - 3 * len([i for i in issues if i["level"] == "nit"]))
    return {"ok": not blockers, "score": score, "subject": subject, "issues": issues, "good": good,
            "verdict": "ok" if not issues else ("fix blockers first" if blockers else "polish")}


def strip_html_comments(text: str) -> str:
    return re.sub(r"<!--.*?-->", "", text, flags=re.S)


# ------------------------------------------------------------- lint: comment

JUDGMENT = r"\b(dumb|stupid|idiotic|ridiculous|obviously|terrible|awful|nonsense|crazy|silly|weird|broken mess)\b"
DIMINISH = r"\b(simply|simple|just|of course|trivially|merely|easy)\b"
HYPERBOLE = r"\b(always|never|endlessly|nothing ever|everything|every time|constantly)\b"
BLAME = r"\b(why did you|you forgot|you broke|you ignore|you always|you never|your mistake|your fault)\b"
DEMAND = r"\b(you (should|must|need to|have to|ought to)|i (want|insist) you|do it like)\b"
SARCASM = r"(\bsure, because\b|\byeah,? right\b|/s\b|🙄|\bhow (wonderful|surprising)\b)"
ALT_HINT = r"\b(instead|what about|how about|could we|consider|suggest|alternative|propose|what do you think)\b"
RATIONALE = (r"\b(because|since|so that|reason|why:|this (is|would) (better|safer|simpler|clearer)|improves|avoids|"
            r"duplicat\w*|consistent with|reads better|harder to (read|follow)|tests? (pass|fail)|safer|clearer)\b")
TEST_CLAIM = r"\b(tested|untested|i ran|i did not test|not tested|verified locally|test pass)\b"
PRAISE = r"\b(nice|thanks|thank you|good call|great|well done|i learned|appreciate|love this|clean)\b"
SOFTEN = [(r"\byou should\b", "should we"), (r"\byou must\b", "could we"),
          (r"\byou need to\b", "we may want to"), (r"\byou have to\b", "we may want to"),
          (r"\bwhy did you\b", "what was the reason for"), (r"\byou forgot\b", "this seems to miss"),
          (r"\byou broke\b", "this breaks"), (r"\byour code\b", "this code"),
          (r"\bplease (just|simply)\b", "please"), (r"\byour code\b", "this code"),
          (r"\byour (function|method|variable|naming)\b", r"this \1")]


def lint_comment(text: str, role: str = "reviewer") -> dict:
    text = (text or "").strip()
    body = strip_html_comments(text)
    issues: list[dict] = []
    good: list[str] = []

    def add(level: str, rule: str, msg: str) -> None:
        issues.append({"level": level, "rule": rule, "msg": msg})

    if not body:
        return {"ok": False, "issues": [{"level": "blocker", "rule": "empty", "msg": "No comment text."}],
                "good": [], "suggested": None, "verdict": "empty"}

    first = body.split("\n", 1)[0].strip().lower()
    if ":" in first[:24] and not first.startswith(tuple(SEV_LABELS)):
        add("info", "label-format", "Unknown label - prefer Nit: / Optional: / Consider: / FYI: / Blocker:.")
    if not first.startswith(SEV_LABELS):
        add("info", "no-severity-label",
            "No severity label. Lead with 'Nit:' (polish), 'Optional:'/'Consider:' (not required) or 'FYI:' "
            "(future, not this PR) so the author knows what is mandatory.")
    else:
        good.append("severity label present")

    for pattern, level, rule, msg in (
        (BLAME, "blocker", "blame", "Blames the person ('why did you', 'you forgot') - describe the code instead."),
        (JUDGMENT, "blocker", "judgment", "Judgmental wording ('obviously', 'dumb') - assume intelligent and well-meaning."),
        (DEMAND, "warn", "demand", "Imperative demand ('you should/must') - ask, explain, suggest instead."),
        (SARCASM, "blocker", "sarcasm", "Sarcasm reads as hostile in async text - state the issue plainly."),
        (DIMINISH, "warn", "diminishing", "Diminishing word ('simply', 'just', 'easy') - it reads as condescension."),
        (HYPERBOLE, "nit", "hyperbole", "Hyperbole ('always', 'never') - keep it factual or the point gets argued away."),
    ):
        found = _hits(pattern, body)
        if found:
            add(level, rule, f"{msg} (found: {', '.join(found[:4])})")

    exclam = body.count("!")
    if exclam >= 3:
        add("nit", "tone", f"{exclam} exclamation marks - calm the tone before posting.")
    if len(body) > 1200:
        add("nit", "length", f"{len(body)} chars - long threads belong in a call, with a short summary posted back.")

    if not re.search(RATIONALE, body, re.I):
        add("nit", "no-why", "No rationale - say *why* the change improves the code (facts beat preference).")
    else:
        good.append("explains why")
    if re.search(r"\b(don'?t|shouldn'?t|wrong|bad|revert|remove|avoids?)\b", body, re.I) and not re.search(ALT_HINT, body, re.I):
        add("warn", "no-alternative", "Rejects something without an alternative - add a concrete suggestion or reference.")
    if re.search(r"```|^\s{4,}\S|replace with|use this", body, re.I | re.M) and not re.search(TEST_CLAIM, body, re.I):
        add("info", "untested-suggestion", "You supplied code - say whether you tested it; never imply untested (or "
                                           "LLM/blog-sourced) code is verified.")
    if re.search(r"\b(api|security|privacy|concurrency|race|deadlock|accessib|i18n|perf)\b", body, re.I) \
            and not re.search(r"\b(expert|owner|team|reviewer|qualified)\b", body, re.I):
        add("info", "domain", "Domain-sensitive area - confirm a qualified reviewer covers it.")
    if role == "reviewer" and not re.search(PRAISE, body, re.I):
        add("info", "no-praise", "No positive note - name one thing done well; it is often the highest-value comment.")
    if re.search(r"\b(split|too (large|big)|1000 lines|huge pr)\b", body, re.I):
        good.append("size concern raised")

    suggested = body
    for pattern, repl in SOFTEN:
        suggested = re.sub(pattern, repl, suggested, flags=re.I)
    suggested = re.sub(r"\b(just|simply|obviously|of course|clearly|easily)\b[ ]*", "", suggested, flags=re.I)
    suggested = re.sub(r"\b(dumb|stupid|idiotic|ridiculous|nonsense|silly)\b[ ]*", "", suggested, flags=re.I)
    suggested = re.sub(r"\s{2,}", " ", suggested).strip()
    suggested = re.sub(r"\b(it|this|that) (is|was|seems)\s*[.,]?\s*$", "", suggested, flags=re.I).strip().rstrip(",")
    suggested = re.sub(r"[,;]\s*$", ".", suggested)
    if not re.match(r"^\s*(nit|optional|consider|fyi|blocker|question):", suggested, re.I):
        level = "blocker" if any(i["level"] == "blocker" for i in issues) else \
            "optional" if any(i["level"] == "warn" for i in issues) else "nit"
        suggested = f"{level.capitalize()}: {suggested}"

    blockers = [i for i in issues if i["level"] == "blocker"]
    warns = [i for i in issues if i["level"] == "warn"]
    return {"ok": not blockers and not warns, "blockers": len(blockers), "warns": len(warns),
            "issues": issues, "good": good, "suggested": suggested if suggested != body else None,
            "verdict": "rewrite before posting" if blockers else
                       ("soften" if warns else ("label only" if issues else "ok"))}


# ---------------------------------------------------------------- lint: diff


def lint_diff(text: str) -> dict:
    text = text or ""
    files: list[tuple[str, int, int]] = []
    current, added, removed = None, 0, 0
    for line in text.split("\n"):
        if line.startswith("diff --git"):
            if current:
                files.append((current, added, removed))
            current, added, removed = line.split(" b/")[-1].strip(), 0, 0
        elif current is not None:
            if line.startswith("+") and not line.startswith("+++"):
                added += 1
            elif line.startswith("-") and not line.startswith("---"):
                removed += 1
        m = re.match(r"^\s*(\S+)\s*\|\s*(\d+)\s*([+-]*)", line)   # git diff --stat row
        if m and "|" in line and current is None:
            files.append((m.group(1), len(m.group(3).replace("-", "")) or int(m.group(2)) // 5,
                          len(m.group(3).replace("+", ""))))
    if current:
        files.append((current, added, removed))
    summary = re.search(r"(\d+)\s+files? changed(?:, (\d+) insertions?\(\+\))?(?:, (\d+) deletions?\(-\))?",
                        text)
    if not files:
        if summary:
            return {"files": int(summary.group(1)), "added": int(summary.group(2) or 0),
                    "removed": int(summary.group(3) or 0), "status": "unparsed-diff",
                    "note": "Only a diffstat summary was given; pass the real diff for the tests/refactor gate."}

    added = sum(a for _, a, _ in files)
    removed = sum(r for _, _, r in files)
    if summary:                      # diffstat bars are scaled; trust the real totals
        added = int(summary.group(2) or added)
        removed = int(summary.group(3) or removed)
    churn = added + removed
    count = int(summary.group(1)) if summary else len(files)

    tests = [f for f, _, _ in files if re.search(r"(^|/)(tests?|spec|__tests__)/|\.(test|spec)\.[jt]sx?$|_test\.(py|go|rs|rb)$|(^|/)(test|spec)[-_.][^/]+\.(py|js|ts|tsx|go|rs|rb|java)$|Test\.java$", f)]
    docs = [f for f, _, _ in files if re.search(r"\.(md|rst|adoc|txt)$|(^|/)docs?/", f)]
    refactorish = churn > 150 and any(abs(a - r) <= max(2, churn * 0.05) for _, a, r in files)

    issues: list[dict] = []
    if churn > 1000 or count > 30:
        verdict = "split"
        issues.append({"level": "blocker", "rule": "size",
                       "msg": f"{churn} changed lines across {count} files - reviewers may reject purely for size. "
                              "Split into self-contained PRs (stack them, or split by file/layer/feature)."})
    elif churn > 400 or count > 12:
        verdict = "warn"
        issues.append({"level": "warn", "rule": "size",
                       "msg": f"{churn} changed lines across {count} files - justify it, or split; ~100 lines "
                              "per PR is the comfortable zone."})
    else:
        verdict = "ok"
    if not tests and any(not re.search(r"\.(md|rst|adoc|txt|json|ya?ml|lock)$", f) for f, _, _ in files):
        issues.append({"level": "warn", "rule": "tests",
                       "msg": "Source files changed with no test file in the same PR - tests travel with the code."})
    if refactorish:
        issues.append({"level": "info", "rule": "refactor",
                       "msg": "Positive and negative churn are near-equal - looks like a rename/format pass. Keep pure "
                              "refactors in a separate PR so the behaviour diff stays readable."})
    if docs and len(docs) == len(files):
        issues.append({"level": "info", "rule": "docs-only", "msg": "Docs-only change: keep it separate and quick."})

    top = sorted(files, key=lambda f: f[1] + f[2], reverse=True)[:3]
    return {"files": count, "added": added, "removed": removed,
            "churn": churn, "approximate_churn": bool(summary), "tests_included": tests, "docs": docs,
            "verdict": verdict, "issues": issues,
            "main_files": [{"file": f, "added": a, "removed": r} for f, a, r in top]}


def review_plan(text: str) -> dict:
    gate = lint_diff(text)
    steps = [
        "Pass 1 - broad view: read the description, decide whether the change should exist at all. If not, say so "
        "immediately with an alternative.",
        "Pass 2 - main parts: " + (", ".join(f["file"] for f in gate.get("main_files", [])) or "largest-churn files") +
        ". Send design-level comments now - the author may already be stacking work on this.",
        "Pass 3 - the rest in a fixed sequence so nothing is missed; reading the tests first is often the fastest way "
        "to grasp intent.",
    ]
    notes = ["Look at the whole file for added lines that belong in a smaller function; look at the change in system "
             "context.", "Label severity on every comment and name at least one good thing."]
    if gate["verdict"] in ("warn", "split"):
        notes.append("Consider asking for a split before a deep read: " + gate["issues"][0]["msg"])
    return {"gate": gate, "passes": steps, "notes": notes}


# ---------------------------------------------------------------------- CLI


def _emit(obj: dict) -> None:
    sys.stdout.write(json.dumps(obj, ensure_ascii=False, default=str))


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="PR/code-review craft core")
    parser.add_argument("command", choices=["detect", "context", "checklist", "lint-desc", "lint-comment",
                                            "lint-diff", "plan", "selftest"])
    parser.add_argument("--text", default="")
    parser.add_argument("--file", default=None)
    parser.add_argument("--stdin", action="store_true")
    parser.add_argument("--role", default=None, choices=["reviewer", "author", "both"])
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    text = _text_from(args)
    try:
        if args.command == "detect":
            _emit(detect(text))
        elif args.command == "context":
            _emit(context_block(text, args.role))
        elif args.command == "checklist":
            _emit(checklist(args.role or "both"))
        elif args.command == "lint-desc":
            _emit(lint_description(text))
        elif args.command == "lint-comment":
            _emit(lint_comment(text, args.role or "reviewer"))
        elif args.command == "lint-diff":
            _emit(lint_diff(text))
        elif args.command == "plan":
            _emit(review_plan(text))
        elif args.command == "selftest":
            _emit(selftest())
    except Exception as err:                                    # never crash the caller
        _emit({"ok": False, "error": f"{type(err).__name__}: {err}"})
    return 0


def selftest() -> dict:
    cases = {
        "detect.review": detect("can you review this PR? the diff touches auth"),
        "detect.chatter": detect("hey, ok"),
        "detect.author": detect("my PR description is ready, should I split the PR?"),
        "desc.bad": lint_description("Fix bug.\n\nmade some changes"),
        "desc.good": lint_description(
            "Add search box to the app header\n\nBecause users keep asking for inline search (issue #1234).\n\n"
            "Steps to test:\n1. sign in\n2. type 'test' and hit enter\n3. expect /search?query=test\n\n"
            "Next steps: implement the search page (#1235)."),
        "comment.bad": lint_comment("You should just rename this, it's obviously dumb and your code is broken."),
        "comment.good": lint_comment("Nit: this helper duplicates the parser in utils.\nInstead, could we call "
                                     "parseQuery() here? I tested the replacement locally and the tests pass."),
        "diff.big": lint_diff("diff --git a/a.ts b/a.ts\n" + "+x\n" * 700 + "diff --git a/b.py b/b.py\n-x\n" * 350),
        "diff.small": lint_diff("diff --git a/a.ts b/a.ts\n+const x = 1\ndiff --git a/a.test.ts b/a.test.ts\n+expect(x).toBe(1)"),
        "plan": review_plan("diff --git a/a.ts b/a.ts\n" + "+x\n" * 120),
    }
    summary = {k: (v.get("hit"), v.get("verdict", v.get("ok")), v.get("score")) for k, v in cases.items()}
    return {"ok": True, "cases": summary}


if __name__ == "__main__":
    raise SystemExit(main())

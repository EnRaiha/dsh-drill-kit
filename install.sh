#!/usr/bin/env bash
# Install the drill into a DSH profile — no npm registry required.
#
#   ./install.sh --profile web                 # official plugin manager (needs pnpm)
#   ./install.sh --profile web --link          # symlink install, no pnpm, no network
#   ./install.sh --profile web --skills --frontends
#   ./install.sh --profile web --uninstall
#
# Piped form (no checkout needed):
#   curl -fsSL https://raw.githubusercontent.com/EnRaiha/dsh-drill-kit/master/install.sh | bash -s -- --profile web
#
# What it touches: $DSH_HOME/profiles/<profile>/{package.json,node_modules}, and
# with the flags below $DSH_HOME/skills, $DSH_HOME/roles, ~/.kilo/plugins,
# ~/.hermes/plugins. It never edits a profile's cordis.yml and never restarts
# anything — host-side plugin rows are composed at boot, so the last line tells
# you how to restart.
set -euo pipefail

REPO_URL="https://github.com/EnRaiha/dsh-drill-kit.git"
PACKAGE="dsh-drill"
PROFILE="web"
DSH_CLI=""
MODE="auto"          # auto | manager | link
DO_SKILLS=0
DO_FRONTENDS=0
DO_VERIFY=0
DO_UNINSTALL=0
DRY_RUN=0
FORCE=0

die() { printf 'install: %s\n' "$1" >&2; exit 1; }
say() { printf '%s\n' "$1"; }

usage() {
  sed -n '2,16p' "$0" | sed 's/^# \{0,1\}//'
  cat <<'EOF'

Flags:
  --profile <name>   DSH profile to install into (default: web)
  --dsh <path>       DSH checkout or its apps/cli/lib/bin.js (auto-detected otherwise)
  --link             symlink install: no pnpm, no network, edit the profile directly
  --manager          force the official `dsh plugin add` path
  --skills           copy the drill skill + auditor role into $DSH_HOME
  --frontends        symlink the Kilo/Hermes frontends into their plugin dirs
  --verify           wire the host packages and run the test suite
  --uninstall        remove the plugin (and the optional pieces installed above)
  --dry-run          print what would happen, change nothing
  --force            allow --skills/--frontends to replace files that already exist
EOF
  exit 0
}

while [ $# -gt 0 ]; do
  case "$1" in
    --profile) PROFILE="${2:-}"; shift 2 ;;
    --dsh) DSH_CLI="${2:-}"; shift 2 ;;
    --link) MODE="link"; shift ;;
    --manager) MODE="manager"; shift ;;
    --skills) DO_SKILLS=1; shift ;;
    --frontends) DO_FRONTENDS=1; shift ;;
    --verify) DO_VERIFY=1; shift ;;
    --uninstall) DO_UNINSTALL=1; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    --force) FORCE=1; shift ;;
    -h|--help) usage ;;
    *) die "unknown flag $1 (try --help)" ;;
  esac
done
[ -n "$PROFILE" ] || die "--profile needs a name"

DSH_HOME="${DSH_HOME:-$HOME/.dsh}"
PROFILE_DIR="$DSH_HOME/profiles/$PROFILE"

# ---------------------------------------------------------------- where is the repo
# Piped installs have no checkout: clone one into the cache and carry on.
REPO=""
if [ -n "${BASH_SOURCE[0]:-}" ] && [ -f "${BASH_SOURCE[0]}" ]; then
  REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fi
if [ -z "$REPO" ] || [ ! -f "$REPO/index.js" ]; then
  SRC_DIR="${XDG_CACHE_HOME:-$HOME/.cache}/dsh-drill-kit"
  command -v git >/dev/null 2>&1 || die "no checkout next to this script and no git to fetch one"
  if [ -d "$SRC_DIR/.git" ]; then
    run git -C "$SRC_DIR" pull --ff-only
  else
    run git clone --depth 1 "$REPO_URL" "$SRC_DIR"
  fi
  REPO="$SRC_DIR"
fi
[ -f "$REPO/cordis.patch.yml" ] || die "$REPO does not look like the drill kit (no cordis.patch.yml)"

# ------------------------------------------------------------------- where is DSH
resolve_cli() {
  if [ -n "$DSH_CLI" ]; then
    if [ -d "$DSH_CLI" ]; then printf '%s/apps/cli/lib/bin.js' "$DSH_CLI"; else printf '%s' "$DSH_CLI"; fi
    return
  fi
  for candidate in \
    "$(command -v dsh 2>/dev/null || true)" \
    "$HOME/projects/deepseek-harness/apps/cli/lib/bin.js" \
    "$(cd "$REPO/.." 2>/dev/null && pwd)/deepseek-harness/apps/cli/lib/bin.js" \
    "/usr/local/lib/node_modules/@deepseek-ai/dsh/apps/cli/lib/bin.js"
  do
    [ -n "$candidate" ] && [ -f "$candidate" ] && { printf '%s' "$candidate"; return; }
  done
  printf ''
}
CLI="$(resolve_cli)"

run() {
  if [ "$DRY_RUN" = "1" ]; then say "  [dry-run] $*"; else "$@"; fi
}

# pnpm lives in a per-user prefix that a login shell usually has and a service does not
export PATH="$PATH:$HOME/.local/share/pnpm/bin:$HOME/.local/bin"

say "drill kit      : $REPO"
say "profile        : $PROFILE ($PROFILE_DIR)"
say "home           : $HOME$([ "$DRY_RUN" = "1" ] && printf ' (dry run — nothing is written)' || true)"
say "dsh cli        : ${CLI:-<not found>}"
say "mode           : $MODE$([ "$DRY_RUN" = "1" ] && printf ' (dry run)')"
say ""

# --------------------------------------------------------------------- uninstall
if [ "$DO_UNINSTALL" = "1" ]; then
  node -e '
    const fs = require("node:fs"), p = process.argv[1];
    if (!fs.existsSync(p)) process.exit(0);
    const d = JSON.parse(fs.readFileSync(p, "utf8"));
    if (d.dependencies) delete d.dependencies["dsh-drill"];
    if (d.dsh?.profile?.bundles) d.dsh.profile.bundles = d.dsh.profile.bundles.filter(b => b !== "dsh-drill");
    fs.writeFileSync(p, JSON.stringify(d, null, 2) + "\n");
  ' "$PROFILE_DIR/package.json" && say "removed dsh-drill from $PROFILE_DIR/package.json"
  run rm -f "$PROFILE_DIR/node_modules/dsh-drill"
  if [ "$DO_SKILLS" = "1" ]; then
    run rm -rf "$DSH_HOME/skills/drill"
    run rm -f "$DSH_HOME/roles/drill-auditor.md"
  fi
  if [ "$DO_FRONTENDS" = "1" ]; then
    for runtime in kilo hermes; do
      for name in c2g pr-craft; do
        link="$HOME/.$runtime/plugins/$name"
        # only remove what this script created: a symlink into this repo
        if [ -L "$link" ]; then
          case "$(readlink "$link")" in *dsh-drill-kit*|*dsh-drill*) run rm -f "$link" ;; esac
        fi
      done
    done
  fi
  say ""
  if [ -f "$HOME/.config/systemd/user/tkg-web.service" ] && [ "$PROFILE" = "tkg-web" ]; then
    say "restart to unload it:  systemctl --user restart tkg-web.service"
  else
    say "restart your dsh web / headless process for profile '$PROFILE' to unload it"
  fi
  exit 0
fi

# ----------------------------------------------------------------- install plugin
installed=""
if [ "$MODE" != "link" ] && [ -n "$CLI" ]; then
  say "→ official plugin manager"
  if run node "$CLI" plugin --profile "$PROFILE" add "$REPO"; then
    installed="manager"
  else
    say "  the manager path failed (pnpm/network?) — falling back to a link install"
  fi
fi

if [ -z "$installed" ]; then
  [ "$MODE" = "manager" ] && die "the manager path failed and --manager was requested"
  say "→ link install (no pnpm, no network)"
  run mkdir -p "$PROFILE_DIR/node_modules"
  run ln -sfn "$REPO" "$PROFILE_DIR/node_modules/$PACKAGE"
  if [ "$DRY_RUN" = "1" ]; then
    say "  [dry-run] patch $PROFILE_DIR/package.json (dependency + bundle row)"
  else
    mkdir -p "$PROFILE_DIR"
    [ -f "$PROFILE_DIR/package.json" ] || printf '{\n  "name": "dsh-profile-%s",\n  "private": true\n}\n' "$PROFILE" > "$PROFILE_DIR/package.json"
    cp "$PROFILE_DIR/package.json" "$PROFILE_DIR/package.json.bak-drill"
    node -e '
      const fs = require("node:fs"), p = process.argv[1], repo = process.argv[2];
      const d = JSON.parse(fs.readFileSync(p, "utf8"));
      d.dependencies = d.dependencies || {};
      d.dependencies["dsh-drill"] = "link:" + repo;
      d.dsh = d.dsh || {}; d.dsh.profile = d.dsh.profile || {}; d.dsh.profile.bundles = d.dsh.profile.bundles || [];
      if (!d.dsh.profile.bundles.includes("dsh-drill")) d.dsh.profile.bundles.push("dsh-drill");
      fs.writeFileSync(p, JSON.stringify(d, null, 2) + "\n");
    ' "$PROFILE_DIR/package.json" "$REPO"
    say "  patched $PROFILE_DIR/package.json (backup: package.json.bak-drill)"
  fi
  installed="link"
fi
say "installed via $installed"
say ""

# ------------------------------------------------------------------ skill + role
install_file() {
  # $1 source, $2 destination: back up a differing file instead of clobbering it
  src="$1"; dst="$2"
  run mkdir -p "$(dirname "$dst")"
  if [ -e "$dst" ] && ! cmp -s "$src" "$dst"; then
    if [ "$FORCE" != "1" ]; then
      run cp -f "$dst" "$dst.bak-drill"
      say "  kept a copy of the existing $(basename "$dst") as $(basename "$dst").bak-drill"
    fi
  fi
  run cp -f "$src" "$dst"
}

if [ "$DO_SKILLS" = "1" ]; then
  say "→ skill + auditor role"
  install_file "$REPO/skills/drill/SKILL.md" "$DSH_HOME/skills/drill/SKILL.md"
  install_file "$REPO/roles/drill-auditor.md" "$DSH_HOME/roles/drill-auditor.md"
  say "  $DSH_HOME/skills/drill/SKILL.md, $DSH_HOME/roles/drill-auditor.md"
fi

# -------------------------------------------------------------------- frontends
if [ "$DO_FRONTENDS" = "1" ]; then
  say "→ Kilo / Hermes frontends"
  for runtime in kilo hermes; do
    parent="$HOME/.$runtime/plugins"
    [ -d "$parent" ] || { say "  skipped $parent (not installed)"; continue; }
    for name in c2g pr-craft; do
      [ -d "$REPO/frontends/$runtime/$name" ] || continue
      target="$parent/$name"
      if [ -e "$target" ] && [ ! -L "$target" ]; then
        if [ "$FORCE" != "1" ]; then
          say "  left $target alone (a real directory is already there — pass --force to replace it)"
          continue
        fi
        run mv "$target" "$target.bak-drill"
        say "  moved the existing $name to $name.bak-drill"
      fi
      run ln -sfn "$REPO/frontends/$runtime/$name" "$target"
      say "  $target → $REPO/frontends/$runtime/$name"
    done
  done
fi

# ----------------------------------------------------------------------- verify
if [ "$DO_VERIFY" = "1" ]; then
  say "→ verify (host packages + test suite)"
  mkdir -p "$REPO/node_modules/@deepseek-ai"
  for spec in llm/llm subagent/subagent core/tools; do
    target="$(dirname "${CLI:-/nonexistent}")/../../../packages/$spec"
    [ -d "$target" ] && ln -sfn "$target" "$REPO/node_modules/@deepseek-ai/dsh-$(basename "$spec")"
  done
  [ -n "$CLI" ] && [ -d "$(dirname "$CLI")/../../../vendor/schemastery" ] && \
    ln -sfn "$(dirname "$CLI")/../../../vendor/schemastery" "$REPO/node_modules/@deepseek-ai/schemastery"
  run node --test "$REPO"/test/*.test.js
fi

say ""
say "done. The plugin row is composed at boot, so restart the runtime that serves the profile:"
if [ -f "$HOME/.config/systemd/user/tkg-web.service" ] && [ "$PROFILE" = "tkg-web" ]; then
  say "  systemctl --user restart tkg-web.service"
  say "  (from inside a DSH session use: systemd-run --user --unit=dsh-restart-\$(date +%s) --collect systemctl --user restart tkg-web.service)"
else
  say "  restart your dsh web / headless process for profile '$PROFILE'"
fi
say ""
say "then check it loaded:  drill_gate  (16 tools should be registered, including drill_start)"

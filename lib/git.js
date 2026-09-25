import { execFileSync } from 'node:child_process'

/**
 * Read-only git queries used to bind drill evidence to a commit and to turn a
 * branch diff into a blast-radius candidate list.
 *
 * Every call is `git -C <repo> <read-only verb>`; nothing here writes to a
 * repository, and a failure returns null or an empty list rather than throwing,
 * because "not a git checkout" is a normal state for a drill workspace.
 */

/**
 * Run one read-only git command.
 * @param repo Repository or worktree path.
 * @param args Git arguments.
 * @returns Trimmed stdout, or null when git fails.
 */
export function git(repo, args) {
  try {
    return execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', timeout: 30_000 }).trim()
  } catch {
    return null
  }
}

/**
 * The commit HEAD points at, used to bind evidence to a revision.
 * @param repo Repository path.
 * @returns Full object id, or null when unavailable.
 */
export function headSha(repo) {
  const out = git(repo, ['rev-parse', 'HEAD'])
  return out && /^[0-9a-f]{40}$/.test(out) ? out : null
}

/**
 * The current branch name, or null on a detached HEAD.
 * @param repo Repository path.
 * @returns Branch name, or null.
 */
export function branchName(repo) {
  return git(repo, ['symbolic-ref', '--short', '-q', 'HEAD'])
}

/**
 * Files the branch changed against a base ref.
 *
 * `--diff-filter=ACMR` mirrors the tracescope contract: added, copied, modified
 * and renamed files are in scope; deletions are reported separately because
 * they change the blast radius without being editable.
 *
 * @param repo Repository path.
 * @param base Base ref, e.g. `origin/main`.
 * @returns `{ changed, deleted, error }`; `error` names the git failure.
 */
export function diffFiles(repo, base) {
  const changed = git(repo, ['diff', '--name-only', '--diff-filter=ACMR', `${base}...HEAD`])
  if (changed === null) {
    // `${base}...HEAD` failed (unknown ref, no merge base). The uncommitted
    // worktree diff is a useful fallback, but it answers a *different*
    // question, so the caller must be able to say so instead of recording it
    // under a base that was never compared.
    const fallback = git(repo, ['diff', '--name-only', '--diff-filter=ACMR', 'HEAD'])
    if (fallback === null) return { changed: [], deleted: [], error: `git diff against ${base} failed`, fallback: false }
    return {
      changed: split(fallback),
      deleted: [],
      error: null,
      fallback: true,
      fallbackCmd: 'git diff --name-only --diff-filter=ACMR HEAD',
      fallbackReason: `git diff against ${base} failed, so this is the working-tree diff against HEAD`,
    }
  }
  const deleted = git(repo, ['diff', '--name-only', '--diff-filter=D', `${base}...HEAD`])
  return { changed: split(changed), deleted: deleted === null ? [] : split(deleted), error: null, fallback: false }
}

/** Split git's newline-separated path output into a list. */
function split(output) {
  return output === '' ? [] : output.split('\n').map(line => line.trim()).filter(Boolean)
}

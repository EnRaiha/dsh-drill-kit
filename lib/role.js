import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

import { git } from './git.js'

/**
 * Role files for `drill_review`, in the format `dsh-plugin-subagent-roles`
 * established: YAML frontmatter carries routing, tool policy and budget; the
 * body is the persona.
 *
 * This parser covers the subset a role file actually needs — scalars, booleans,
 * numbers, inline arrays, inline maps and block lists — so the plugin keeps zero
 * runtime dependencies. Unknown keys are reported rather than silently applied,
 * because a typo in `maxToolCalls` must not quietly remove a budget.
 */

const KNOWN_KEYS = new Set([
  'name', 'displayName', 'description', 'whenToUse', 'provider', 'model', 'reasoningEffort',
  'tools', 'toolFilter', 'maxToolCalls', 'maxToolCallsScope', 'onToolCallBudget', 'graceToolCalls',
])

/** Coerce one scalar token: quoted string, boolean, number, null, or raw string. */
function scalar(token) {
  const text = token.trim()
  if (text === '') return ''
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    return text.slice(1, -1)
  }
  if (text === 'true') return true
  if (text === 'false') return false
  if (text === 'null' || text === '~') return null
  if (/^-?\d+$/.test(text)) return Number(text)
  return text
}

/** Parse `[a, b, "c"]` into an array of scalars. */
function inlineList(text) {
  const inner = text.slice(1, -1).trim()
  if (inner === '') return []
  return inner.split(',').map(scalar)
}

/** Parse `{ allow: [read, grep], deny: [bash] }` into a plain object. */
function inlineMap(text) {
  const inner = text.slice(1, -1).trim()
  if (inner === '') return {}
  const out = {}
  for (const entry of inner.split(',')) {
    const [key, ...rest] = entry.split(':')
    if (rest.length === 0) continue
    const raw = rest.join(':').trim()
    out[key.trim()] = raw.startsWith('[') && raw.endsWith(']') ? inlineList(raw) : scalar(raw)
  }
  return out
}

/**
 * Split a role file into frontmatter data and persona body.
 *
 * @param text Raw file contents.
 * @returns `{ data, body, unknownKeys }`.
 */
export function parseRoleFile(text) {
  const normalized = text.replaceAll('\r\n', '\n')
  if (!normalized.startsWith('---\n')) return { data: {}, body: normalized.trim(), unknownKeys: [] }
  const end = normalized.indexOf('\n---', 4)
  if (end === -1) return { data: {}, body: normalized.trim(), unknownKeys: [] }

  const front = normalized.slice(4, end)
  const body = normalized.slice(end + 4).trim()
  const data = {}
  const unknownKeys = []
  let currentKey = null

  for (const line of front.split('\n')) {
    if (line.trim() === '' || line.trimStart().startsWith('#')) continue
    const blockItem = line.match(/^\s+-\s+(.*)$/)
    if (blockItem && currentKey !== null) {
      const list = Array.isArray(data[currentKey]) ? data[currentKey] : []
      list.push(scalar(blockItem[1]))
      data[currentKey] = list
      continue
    }
    const match = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/)
    if (!match) continue
    const [, key, rawValue] = match
    currentKey = key
    if (!KNOWN_KEYS.has(key)) unknownKeys.push(key)
    const value = rawValue.trim()
    if (value === '') {
      data[key] = []
      continue
    }
    if (value.startsWith('[') && value.endsWith(']')) data[key] = inlineList(value)
    else if (value.startsWith('{') && value.endsWith('}')) data[key] = inlineMap(value)
    else data[key] = scalar(value)
  }

  return { data, body, unknownKeys }
}

/**
 * Find the role file for an id, mirroring the delegated-roles precedence:
 * project `.dsh/roles` first, then `~/.dsh/roles`, then the bundled copy.
 *
 * @param id Role id (file stem).
 * @param options `cwd` session working directory, `dshHome` harness home, `bundledDir` plugin roles directory.
 * @returns `{ id, path, data, body, unknownKeys, source }`, or null when nothing matches.
 */
export function resolveRole(id, options = {}) {
  const candidates = []
  const repoRoot = options.cwd === undefined ? null : git(options.cwd, ['rev-parse', '--show-toplevel'])
  if (repoRoot) candidates.push({ path: join(repoRoot, '.dsh', 'roles', `${id}.md`), source: 'project' })
  const home = options.dshHome ?? process.env.DSH_HOME ?? join(homedir(), '.dsh')
  candidates.push({ path: join(home, 'roles', `${id}.md`), source: 'user' })
  if (options.bundledDir) candidates.push({ path: join(options.bundledDir, `${id}.md`), source: 'bundled' })

  for (const candidate of candidates) {
    if (!existsSync(candidate.path)) continue
    const parsed = parseRoleFile(readFileSync(candidate.path, 'utf8'))
    return { id, path: candidate.path, source: candidate.source, ...parsed }
  }
  return null
}

/**
 * Expand a role's tool policy into a restriction the subagent seam accepts.
 *
 * Names the current agent cannot see are dropped: `tools.restrict()` throws on
 * an unknown name, and a role should degrade to the visible subset rather than
 * fail the delegation.
 *
 * @param role Parsed role.
 * @param visibleNames Names the spawning agent can see.
 * @returns `{ allow }` the caller passes as `toolFilter`, or undefined when the role names no tools.
 */
export function roleToolFilter(role, visibleNames) {
  const visible = new Set(visibleNames)
  const requested = Array.isArray(role.data.tools)
    ? role.data.tools
    : Array.isArray(role.data.toolFilter?.allow) ? role.data.toolFilter.allow : []
  const deny = Array.isArray(role.data.toolFilter?.deny) ? new Set(role.data.toolFilter.deny) : null
  if (requested.length === 0) return undefined
  const allow = requested
    .flatMap(entry => entry === '*' ? [...visible] : [entry])
    .filter(name => visible.has(name) && !(deny?.has(name) ?? false))
  return allow.length === 0 ? undefined : { allow }
}

/**
 * Read a role's numeric budget.
 * @param role Parsed role.
 * @returns The budget as a non-negative integer, or null when the role sets none.
 */
export function roleBudget(role) {
  const raw = role.data.maxToolCalls
  if (typeof raw !== 'number' || !Number.isInteger(raw) || raw < 0) return null
  return raw
}

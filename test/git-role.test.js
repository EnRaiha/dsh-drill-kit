import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'

import { branchName, diffFiles, headSha } from '../lib/git.js'
import { parseRoleFile, resolveRole, roleBudget, roleToolFilter } from '../lib/role.js'

const root = mkdtempSync(join(tmpdir(), 'drill-git-'))
after(() => rmSync(root, { recursive: true, force: true }))

const repo = join(root, 'repo')
mkdirSync(repo, { recursive: true })
const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' }).trim()
git('init', '-q', '-b', 'main')
git('config', 'user.email', 'drill@test')
git('config', 'user.name', 'drill test')
writeFileSync(join(repo, 'a.rs'), 'fn a() {}\n')
writeFileSync(join(repo, 'gone.rs'), 'fn gone() {}\n')
git('add', '.')
git('commit', '-q', '-m', 'base')
const baseSha = git('rev-parse', 'HEAD')
git('checkout', '-q', '-b', 'fix/thing')
writeFileSync(join(repo, 'a.rs'), 'fn a() { let x = 1; }\n')
writeFileSync(join(repo, 'new.rs'), 'fn new() {}\n')
git('rm', '-q', 'gone.rs')
git('add', '.')
git('commit', '-q', '-m', 'fix')
const headAfter = git('rev-parse', 'HEAD')

test('headSha and branchName read the checked-out revision', () => {
  assert.equal(headSha(repo), headAfter)
  assert.equal(branchName(repo), 'fix/thing')
})

test('diffFiles separates changed from deleted files', () => {
  const { changed, deleted, error } = diffFiles(repo, baseSha)
  assert.equal(error, null)
  assert.deepEqual(changed.sort(), ['a.rs', 'new.rs'])
  assert.deepEqual(deleted, ['gone.rs'])
})

test('a non-repository answers null instead of throwing', () => {
  const plain = join(root, 'plain')
  mkdirSync(plain, { recursive: true })
  assert.equal(headSha(plain), null)
  assert.equal(branchName(plain), null)
  const { changed, error } = diffFiles(plain, 'origin/main')
  assert.deepEqual(changed, [])
  assert.match(error, /git diff/)
})

test('parseRoleFile reads scalars, inline lists and the persona body', () => {
  const parsed = parseRoleFile(`---
name: drill-auditor
displayName: Drill Auditor
description: "Read-only auditor, verdict with evidence."
tools: [read, grep, glob, bash]
maxToolCalls: 80
maxToolCallsScope: delegation
onToolCallBudget: wrap-up
graceToolCalls: 2
unknownThing: nope
---
You are the auditor.
`)
  assert.deepEqual(parsed.data.tools, ['read', 'grep', 'glob', 'bash'])
  assert.equal(parsed.data.maxToolCalls, 80)
  assert.equal(parsed.data.description, 'Read-only auditor, verdict with evidence.')
  assert.equal(parsed.body, 'You are the auditor.')
  assert.deepEqual(parsed.unknownKeys, ['unknownThing'])
})

test('parseRoleFile tolerates a block list and a file with no frontmatter', () => {
  const block = parseRoleFile('---\ndescription: x\ntools:\n  - read\n  - grep\n---\nbody\n')
  assert.deepEqual(block.data.tools, ['read', 'grep'])
  const bare = parseRoleFile('no frontmatter here')
  assert.deepEqual(bare.data, {})
  assert.equal(bare.body, 'no frontmatter here')
})

test('resolveRole prefers project, then user, then bundled', () => {
  const project = join(repo, '.dsh', 'roles')
  const userHome = join(root, 'home')
  const bundled = join(root, 'bundled')
  mkdirSync(project, { recursive: true })
  mkdirSync(join(userHome, 'roles'), { recursive: true })
  mkdirSync(bundled, { recursive: true })
  writeFileSync(join(project, 'auditor.md'), '---\ndescription: project\n---\nproject body\n')
  writeFileSync(join(userHome, 'roles', 'auditor.md'), '---\ndescription: user\n---\nuser body\n')
  writeFileSync(join(bundled, 'auditor.md'), '---\ndescription: bundled\n---\nbundled body\n')
  writeFileSync(join(bundled, 'only-bundled.md'), '---\ndescription: only\n---\nbundled only\n')

  const found = resolveRole('auditor', { cwd: repo, dshHome: userHome, bundledDir: bundled })
  assert.equal(found.source, 'project')
  assert.equal(found.data.description, 'project')
  assert.equal(found.body, 'project body')

  rmSync(join(project, 'auditor.md'))
  assert.equal(resolveRole('auditor', { cwd: repo, dshHome: userHome, bundledDir: bundled }).source, 'user')

  rmSync(join(userHome, 'roles', 'auditor.md'))
  assert.equal(resolveRole('auditor', { cwd: repo, dshHome: userHome, bundledDir: bundled }).source, 'bundled')
  assert.equal(resolveRole('only-bundled', { cwd: repo, dshHome: userHome, bundledDir: bundled }).source, 'bundled')
  assert.equal(resolveRole('absent', { cwd: repo, dshHome: userHome, bundledDir: bundled }), null)
})

test('the bundled auditor role parses and carries a read-only budget', () => {
  const parsed = parseRoleFile(readFileSync(new URL('../roles/drill-auditor.md', import.meta.url), 'utf8'))
  assert.equal(parsed.data.name, 'drill-auditor')
  assert.deepEqual(parsed.unknownKeys, [], 'the bundled role must only use known keys')
  assert.ok(parsed.data.tools.includes('read'))
  assert.ok(!parsed.data.tools.includes('write'), 'the auditor never gets a write tool')
  assert.equal(roleBudget({ data: parsed.data }), 80)
  assert.match(parsed.body, /Read-only/)
})

test('roleToolFilter drops names the spawning agent cannot see, and honours deny', () => {
  const role = { data: { tools: ['read', 'grep', 'bash', 'imaginary'] } }
  assert.deepEqual(roleToolFilter(role, ['read', 'grep', 'bash', 'write']).allow, ['read', 'grep', 'bash'])
  const denied = { data: { tools: ['read', 'bash'], toolFilter: { deny: ['bash'] } } }
  assert.deepEqual(roleToolFilter(denied, ['read', 'bash']).allow, ['read'])
  assert.equal(roleToolFilter({ data: { tools: [] } }, ['read']), undefined)
  assert.equal(roleToolFilter({ data: { tools: ['imaginary'] } }, ['read']), undefined)
  assert.deepEqual(roleToolFilter({ data: { tools: ['*'] } }, ['read', 'grep']).allow, ['read', 'grep'])
})

test('roleBudget reports only a real non-negative integer cap', () => {
  assert.equal(roleBudget({ data: { maxToolCalls: 12 } }), 12)
  assert.equal(roleBudget({ data: { maxToolCalls: 0 } }), 0, 'zero means explicitly unlimited')
  assert.equal(roleBudget({ data: { maxToolCalls: 'lots' } }), null)
  assert.equal(roleBudget({ data: {} }), null)
})

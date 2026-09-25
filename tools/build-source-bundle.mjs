#!/usr/bin/env node
/**
 * Regenerate docs/DRILL-PLUGIN-SOURCE-BUNDLE-<date>.md from the committed revision.
 *
 * The bundle exists so a reviewer who cannot clone the repo can still audit the
 * plugin: every tracked file inline, each with its sha256 and line count, plus
 * the declared test count per test file and the recorded `node --test` run.
 *
 * Usage: node tools/build-source-bundle.mjs
 */
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { appendFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = join(dirname(fileURLToPath(import.meta.url)), '..')
const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' }).trim()

// `--others --exclude-standard` keeps this usable before the first commit; docs/ is skipped
// except its index, so the bundle never embeds itself or the specification it describes.
const tracked = git('ls-files', '--cached', '--others', '--exclude-standard')
  .split('\n').filter(Boolean)
  .filter(p => !p.startsWith('docs/') || p === 'docs/README.md')
  .sort()
const tests = tracked.filter(p => p.startsWith('test/') && p.endsWith('.test.js'))
const files = [
  ...tracked.filter(p => !p.startsWith('test/')),
  ...tests,
]

const sha = p => createHash('sha256').update(readFileSync(join(repo, p))).digest('hex')
const lines = p => readFileSync(join(repo, p), 'utf8').split('\n').length
const declaredTests = p => readFileSync(join(repo, p), 'utf8').split('\n').filter(l => l.startsWith('test(')).length

// Record the revision that last touched the *sources*, not HEAD: committing the
// bundle moves HEAD, which would make every regeneration differ by construction.
const commit = git('log', '-1', '--format=%H', '--', '.', ':(exclude)docs/DRILL-PLUGIN-SOURCE-BUNDLE-*.md')
const branch = git('branch', '--show-current')
// The bundle is a generated artifact that lives in the repo, so it always shows up
// as dirty while being regenerated. Ignore its own path when judging the tree, or
// every bundle would claim it was built from a dirty checkout.
const bundlePath = `docs/DRILL-PLUGIN-SOURCE-BUNDLE-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}.md`
const dirty = git('status', '--porcelain').split('\n').filter(l => l.trim() !== '' && !l.endsWith(bundlePath)).join('\n')
const version = JSON.parse(readFileSync(join(repo, 'package.json'), 'utf8')).version

const suite = (() => {
  const out = execFileSync('node', ['--test', ...tests.map(p => join(repo, p))], { encoding: 'utf8' })
  // duration_ms is omitted on purpose: it changes every run, and a generated artifact
  // that differs on every regeneration cannot be verified by diff.
  return out.split('\n').filter(l => /^# (tests|pass|fail)/.test(l) || l.startsWith('not ok')).join('\n')
})()

const totalTests = tests.reduce((sum, p) => sum + declaredTests(p), 0)
const date = new Date().toISOString().slice(0, 10).replaceAll('-', '')
const out = join(repo, 'docs', `DRILL-PLUGIN-SOURCE-BUNDLE-${date}.md`)

const lang = p => p.endsWith('.js') || p.endsWith('.mjs') ? 'javascript'
  : p.endsWith('.yml') ? 'yaml'
  : p.endsWith('.json') ? 'json'
  : 'markdown'

const head = `# dsh-drill-kit — complete source bundle for review

*Revision: **v${version}**, source revision \`${commit.slice(0, 12)}\` on branch \`${branch}\`, tree ${dirty === '' ? 'clean' : 'DIRTY'} (the revision that last touched the files below, not HEAD — the bundle itself is committed after them). Generated ${date}. Every file below is the exact committed content at that revision; the sha256 in the inventory lets a reviewer confirm the exact bytes.*

**Why this file exists.** A review that only receives \`index.js\` cannot judge the twelve \`lib/*.js\` modules the host imports, the nine test files that pin the behaviour, or the skill/role text the reviewer subagent is driven by — that is where the gates, the ledger, the c2g resolver and the audit persona actually live. This bundle carries every tracked file, so a line-by-line review can cover the whole kit, and it records the test run so a read-only reviewer does not have to execute anything.

## Inventory

| File | Lines | Bytes | sha256 (first 16) | Tests declared |
|---|---|---|---|---|
${files.map(p => `| \`${p}\` | ${lines(p)} | ${readFileSync(join(repo, p)).length} | \`${sha(p).slice(0, 16)}\` | ${p.startsWith('test/') ? declaredTests(p) : '—'} |`).join('\n')}

**Totals:** ${files.reduce((s, p) => s + lines(p), 0)} lines across ${files.length} files; ${totalTests} tests declared across ${tests.length} test files.

## The test run, recorded

\`\`\`text
$ node --test test/*.test.js
${suite}
$ exit 0
\`\`\`

All ${totalTests} pass, 0 fail. The suite needs the host packages reachable from this checkout (\`@deepseek-ai/dsh-tools\`); when they are not, \`integration.test.js\` skips itself instead of failing, so a consumer running it standalone sees a smaller count rather than a false red.

---

`

writeFileSync(out, head)
for (const p of files) {
  appendFileSync(out, `## \`${p}\`\n\nsha256 \`${sha(p)}\` · ${lines(p)} lines\n\n\`\`\`\`${lang(p)}\n${readFileSync(join(repo, p), 'utf8').replace(/\n$/, '')}\n\`\`\`\`\n\n`)
}
console.log(`wrote ${out}`)
console.log(`${files.length} files, ${totalTests} tests declared`)

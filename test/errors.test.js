import assert from 'node:assert/strict'
import { test } from 'node:test'

import { MAX_FRAMES, describeFrames, extractMessage, normalizeFramePath, parseFrames } from '../lib/errors.js'

const MODERN_PANIC = `thread 'main' panicked at nodedb/src/control/sequence/registry.rs:227:13:
called \`Option::unwrap()\` on a \`None\` value
note: run with \`RUST_BACKTRACE=1\` environment variable to display a backtrace`

const BACKTRACE = `thread 'tokio-runtime-worker' panicked at nodedb/src/control/sequence/registry.rs:227:13:
called \`Option::unwrap()\` on a \`None\` value
stack backtrace:
   0: rust_begin_unwind
             at /rustc/abc123/library/std/src/panicking.rs:597:5
   1: core::panicking::panic_fmt
             at /rustc/abc123/library/core/src/panicking.rs:67:14
   2: nodedb::control::sequence::registry::nextval_batch
             at ./nodedb/src/control/sequence/registry.rs:231:5
   3: nodedb_sql::executor::apply::apply_put
             at ./nodedb-sql/src/executor/apply.rs:88:9
   4: tokio::runtime::task::raw::poll
             at /home/maya/.cargo/registry/src/index.crates.io/tokio-1.40.0/src/runtime/task/raw.rs:271:5`

const RUSTC = `error[E0308]: mismatched types
  --> nodedb/src/control/catalog/types.rs:41:9
   |
41 |     let x: u64 = catalog_err();
   |            ---   ^^^^^^^^^^^^^ expected \`u64\`, found \`CatalogError\``

const PYTHON = `Traceback (most recent call last):
  File "/home/maya/scripts/maya-state-query.py", line 42, in <module>
    main()
  File "/home/maya/scripts/maya-state-query.py", line 31, in main
    get_conn()`

test('a modern panic yields the message and the file:line:column frame', () => {
  const { message, frames } = parseFrames(MODERN_PANIC)
  assert.equal(message, 'called `Option::unwrap()` on a `None` value')
  assert.equal(frames.length, 1)
  assert.deepEqual({ file: frames[0].file, line: frames[0].line, column: frames[0].column }, { file: 'nodedb/src/control/sequence/registry.rs', line: 227, column: 13 })
  assert.equal(frames[0].external, false)
})

test('a numbered backtrace keeps the symbol hint and marks toolchain frames external', () => {
  const { frames } = parseFrames(BACKTRACE)
  const internal = frames.filter(f => !f.external)
  assert.deepEqual(internal.map(f => `${f.file}:${f.line}`), [
    'nodedb/src/control/sequence/registry.rs:227',
    'nodedb/src/control/sequence/registry.rs:231',
    'nodedb-sql/src/executor/apply.rs:88',
  ])
  assert.equal(internal[0].symbolHint, undefined, 'the panic header carries no backtrace symbol')
  assert.equal(internal[1].symbolHint, 'nodedb::control::sequence::registry::nextval_batch')
  assert.equal(frames.filter(f => f.external).length, 3, 'rustc and cargo-registry frames are external, not dropped')
  assert.equal(frames[0].file, 'nodedb/src/control/sequence/registry.rs', 'the panic header frame is the repository one and comes first')
})

test('the panic header is deduplicated against the frame that repeats it', () => {
  const { frames } = parseFrames(`panicked at src/a.rs:10:1:\nboom\n   0: x::y\n             at ./src/a.rs:10:1\n`)
  assert.equal(frames.filter(f => f.file === 'src/a.rs' && f.line === 10).length, 1)
  assert.equal(describeFrames(frames), '1 repository frame(s): src/a.rs:10')
})

test('compiler diagnostics and tracebacks are parsed', () => {
  const rustc = parseFrames(RUSTC)
  assert.equal(rustc.message, 'mismatched types')
  assert.deepEqual(rustc.frames.map(f => `${f.file}:${f.line}:${f.column}`), ['nodedb/src/control/catalog/types.rs:41:9'])

  const python = parseFrames(PYTHON)
  assert.deepEqual(python.frames.map(f => `${f.file}:${f.line}`), [
    '/home/maya/scripts/maya-state-query.py:42',
    '/home/maya/scripts/maya-state-query.py:31',
  ], 'a traceback keeps both frames, and an absolute path outside a repository stays absolute')
})

test('bare file:line mentions are picked up from log prose', () => {
  const { frames } = parseFrames('see src/engine/array.rs:107 and nodedb-lite/src/nodedb/array.rs:33 for the first write')
  assert.deepEqual(frames.map(f => `${f.file}:${f.line}`), ['src/engine/array.rs:107', 'nodedb-lite/src/nodedb/array.rs:33'])
})

test('a pathological backtrace is capped and stays ordered', () => {
  const many = Array.from({ length: MAX_FRAMES + 25 }, (_, index) => `             at ./nodedb/src/f${index}.rs:${index + 1}:1`).join('\n')
  const { frames } = parseFrames(many)
  assert.equal(frames.length, MAX_FRAMES)
  assert.equal(frames[0].file, 'nodedb/src/f0.rs')
  assert.equal(frames.at(-1).file, `nodedb/src/f${MAX_FRAMES - 1}.rs`, 'the first frames are kept, not the last')
})

test('path normalization strips noise and keeps external marking', () => {
  assert.deepEqual(normalizeFramePath('./src/a.rs'), { file: 'src/a.rs', external: false })
  assert.deepEqual(normalizeFramePath('file:///home/maya/projects/nodedb/src/a.rs'), { file: 'nodedb/src/a.rs', external: false })
  assert.equal(normalizeFramePath('/rustc/abc/library/core/src/panicking.rs').external, true)
  assert.equal(normalizeFramePath('/home/maya/.cargo/registry/src/x/tokio/src/a.rs').external, true)
})

test('text without frames yields an empty result rather than a wrong one', () => {
  const { message, frames } = parseFrames('tests passed, nothing to see')
  assert.deepEqual(frames, [])
  assert.equal(message, null)
  assert.equal(extractMessage('ERROR: relation "x" does not exist'), 'relation "x" does not exist')
  assert.equal(describeFrames([]), '0 repository frame(s)')
})

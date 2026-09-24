import { spawn } from 'node:child_process'
import { createWriteStream, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

/**
 * Run one command, stream its combined output into a log file, and report the exit code.
 *
 * The drill's red/green proofs are only evidence when the plugin itself ran the command:
 * a caller that hands in a pre-written log is recording an assertion.
 *
 * @param options Run request.
 * @param options.command Shell command line.
 * @param options.logPath File that receives combined stdout/stderr.
 * @param options.cwd Working directory for the command.
 * @param options.timeoutMs Hard timeout; on expiry the process group is killed and `timedOut` is true.
 * @param options.signal Caller cancellation; kills the process group like the timeout does.
 * @param options.shell Shell used to interpret the command line.
 * @returns Exit code (`124` on timeout, `null` when killed by a signal), log path, duration and timeout flag.
 */
export async function runCapture({ command, logPath, cwd, timeoutMs = 900_000, signal, shell = '/bin/bash' }) {
  mkdirSync(dirname(logPath), { recursive: true })
  const stream = createWriteStream(logPath, { flags: 'w' })
  const started = Date.now()

  return await new Promise((resolve, reject) => {
    const child = spawn(shell, ['-lc', command], { cwd, detached: true, stdio: ['ignore', 'pipe', 'pipe'] })
    let timedOut = false
    let settled = false

    const kill = () => {
      try {
        process.kill(-child.pid, 'SIGTERM')
      } catch {
        // The group is already gone; nothing to signal.
      }
      setTimeout(() => {
        try {
          process.kill(-child.pid, 'SIGKILL')
        } catch {
          // Same: the group exited between the two signals.
        }
      }, 3_000).unref()
    }

    const onAbort = () => {
      timedOut = false
      kill()
    }
    signal?.addEventListener('abort', onAbort, { once: true })

    const timer = timeoutMs > 0
      ? setTimeout(() => {
          timedOut = true
          kill()
        }, timeoutMs)
      : null

    child.stdout.pipe(stream, { end: false })
    child.stderr.pipe(stream, { end: false })

    const finish = code => {
      if (settled) return
      settled = true
      if (timer) clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)
      stream.end(() => {
        resolve({ exit: timedOut ? 124 : code, timedOut, logPath, durationMs: Date.now() - started })
      })
    }

    child.on('error', error => {
      if (settled) return
      settled = true
      if (timer) clearTimeout(timer)
      stream.end(() => reject(error))
    })
    child.on('close', finish)
  })
}

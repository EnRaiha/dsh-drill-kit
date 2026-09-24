---
name: drill
description: "Evidence-gated bug-fix drill for one issue: localize, map blast radius, enumerate edge cases, prove red, prove green, pass preflight and Review 2, then build the PR. Writes a per-task evidence ledger and refuses completion claims without proofs. Trigger on 'drill', 'bug drill', 'red proof', 'red/green', 'fix issue', 'issue drill', 'drill task'."
---

# Drill — evidence-gated bug fixing

Satu issue, satu worktree, satu rantaian bukti. Skill ini mengikat gate kepada **artifak**, bukan kepada naratif: setiap fasa mesti tinggalkan rekod dalam ledger, dan `drill_gate` menolak "siap" yang tak ada bukti.

Sebab ia wujud: kerja drill lama bergantung pada disiplin — red proof ditulis tangan, log hilang, review dua pusingan lupa, dan laporan test phase ditulis dari ingatan. Empat defect itu semua hidup di persimpangan antara fasa, bukan dalam kod yang dibaiki.

## Bila guna

- Ada nombor issue + repo (worktree) + base (`origin/main`).
- Kerja akan berakhir sebagai satu PR.
- Kamu sanggup tunjuk bukti untuk setiap dakwaan.

Kalau kerja itu penerokaan atau spike, **jangan** guna drill — tak ada gate yang berguna.

## Fasa (jangan lompat)

| # | Fasa | Rekod yang wajib | Tool |
|---|---|---|---|
| 1 | **Localize** — cari tapak sebenar dari stack trace/log | `drill_record kind=locate` dengan `files` (path:line) | `drill_locate` (c2g) |
| 2 | **Blast radius** — pemanggil, callee, jenis terjejas | `drill_record kind=blast` dengan `files`/`symbols` | `drill_blast` (symbol) + `drill_diff` (fail berubah + dependent) |
| 3 | **Edge cases** — invarian yang mesti gagal | `drill_record kind=edge` dengan `text` | fikir, senaraikan (checklist dari `drill_diff` sebagai input) |
| 4 | **Patch** — red dulu, baru hijau | `drill_run arm=base` (mesti **exit ≠ 0**), kemudian `drill_run arm=fix` (mesti exit 0) | `nodedb-cargo.sh` |
| 5 | **Hygiene** — fmt, clippy, preflight | `drill_run kind=hygiene` exit 0 | `nodedb-preflight.sh` |
| 6 | **Review 2** — auditor segar, read-only | `drill_review` (role `drill-auditor`) | subagent + role file |
| 7 | **PR** — badan PR ditulis, baru push | `drill_record kind=pr bodyPath=…` | `gh` |

## Perintah asas

```
drill_start   task=issue296 repo=~/projects/nodedb-296 base=origin/main issue=296
drill_status  task=issue296
drill_run     task=issue296 arm=base cmd="bash ~/scripts/nodedb-cargo.sh . nextest run -p nodedb --test wire -E 'test(~graph_cursor)'"
drill_gate    task=issue296            # apa lagi tinggal sebelum boleh kata siap
drill_report  task=issue296            # tulis .drill/issue296/report.md
```

`drill_run` **menjalankan** perintah itu sendiri, menangkap output ke `.drill/<task>/logs/`, dan merekod exit code + sha256 log. Kamu tak boleh "lapor" red proof — sama ada perintah itu gagal, atau gate kekal tertutup.

## Kontrak keras

1. **Red dulu, hijau kemudian.** Test yang lulus atas base ialah *guard*, bukan bukti. Kalau `drill_gate` tunjuk `red` masih ⬜, jangan tulis fix.
2. **Log atau tak wujud.** Rekod `test`/`hygiene` tanpa fail log bukan kosong — ia ditolak.
3. **Bukti diikat pada commit.** `drill_run` dan `drill_review` merekod `head` (SHA). Kalau HEAD bergerak selepas review, gate `review` **terbuka semula** — review semula commit yang kau nak push.
4. **Jangan lapor siap semasa gate terbuka.** Panggil `drill_gate`; kalau `ready=false`, sebut gate mana yang tinggal, jangan ganti dengan ayat "should work".
5. **Review 2 dalam sesi segar, ikut role file.** Auditor tak boleh jadi penulis kod. `drill_review` baca role `drill-auditor` (project `.dsh/roles` → `~/.dsh/roles` → bundled), jadi persona, tool policy (read-only) dan budget datang dari fail, bukan dari ingatan.
6. **Satu issue satu PR.** Badan PR: defect + fix + cara uji + bukti regresi. `Fixes #<n>`. Nombor issue tak muncul dalam kod atau mesej commit.
7. **Env repo dihormati.** Guna `~/scripts/nodedb-cargo.sh <worktree> …` (target per-worktree, sccache, `RUST_MIN_STACK`), bukan `cargo` kosong.

## Bentuk laporan

`drill_report` menjana jadual gate + jadual bukti test (arm, exit, cmd, log, sha256) + verdict. Salin ke `Bumi-Hijau/wiki/nodedb/NODEDB-TEST-PHASE-REPORT-<date>.md` bila fasa patch selesai, dan verdict Review 2 ke `NODEDB-REVIEW2-<NNN>-<date>.md` seperti biasa.

## Mod kegagalan yang skill ini tutup

- Fix ditulis sebelum red proof wujud → gate `red` kekal ⬜.
- "Test lulus" tanpa log → rekod ditolak (`no readable, non-empty log`).
- Review 2 dilangkau → gate `review` kekal ⬜.
- Review 2 lepas kemudian FAIL → gate dibuka semula (rekod terakhir yang menang).
- Preflight dilangkau → gate `hygiene` kekal ⬜.

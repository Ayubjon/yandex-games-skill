# Upstream provenance and feature coverage

Primary source: [Nioris/yandex-games-debug-checker](https://github.com/Nioris/yandex-games-debug-checker), public v1.1.0, commit `f86d4ebd1d17f92911ff64b373286fc8d85aec8e`, retrieved 2026-09-26. Complete tracked snapshot lives under `vendor/yandex-games-debug-checker/`; MIT copyright 2026 3/9 Games is retained in its LICENSE. Our root LICENSE covers our work; it does not replace upstream attribution. `vendor/checker-lock.json` stores SHA-256 for every snapshot file.

## Every upstream capability and its local use

| Upstream feature | Included resource / usage |
|---|---|
| All 93 executable static/runtime checks | `vendor/yandex-games-debug-checker/debugcheck.js`; [catalog](check-catalog.md) |
| Machine-readable catalog, requirement/classification data | `vendor/yandex-games-debug-checker/checks.csv`, preserved verbatim |
| Multi-file HTML/JS/CSS scanner, self exclusion | Checker; coverage limits in [runbook](debug-checker.md) |
| SDK init interception, global fallback, console wrappers | Checker; startup and console verification in runbook |
| Language-read instrumentation and resolver contract | Checker; localization section in runbook/fix guide |
| Timing/gesture probes, ad contexts, event order timeline | Checker; manual evidence instructions in runbook |
| Live DOM/scroll/contextmenu/localization checks | Checker; [fix guide](check-remediation.md) |
| Optional categories; conservative hard-fail policy | Checker; state distinctions and known discrepancies in runbook |
| PASS/FAIL/WARN/N/V/N/A, score and coverage | Checker; report interpretation in runbook |
| Hotkey, public open/close/refresh/version API | Checker; exact invocation in runbook |
| Collapsible, draggable/resizable panel, refresh/copy/close | Original implementation retained; development use only |
| Clipboard text report and fallback | Original implementation; preserve/sanitize report, save timeline separately |
| Orc Castle executable before/after and mock SDK | `vendor/yandex-games-debug-checker/examples/orc-castle/`; test fixtures, not a production starter |
| Static regression suite and executable/catalog parity | Root `npm test` invokes original upstream checks |
| Chromium SDK smoke and before/after integration runs | Root `npm run test:browser` invokes original browser harnesses |
| GitHub Pages demo builder/site | Preserved under vendor; root `npm run test:demo` validates the original builder in a temporary copy; no automatic deployment |
| Audit methodology, limitations, manual checklist, release history | Original docs retained; actionable workflows integrated into skill references |
| Contribution/security/community guidance and CI | Original files preserved; root `.github/workflows/ci.yml` runs `npm run audit` on push/PR; community guidance remains a reference |

## Updating the snapshot

1. Fetch upstream into a temporary checkout and select an explicit commit; inspect diff, license, checks, public API, tests and network/mutation behavior before adoption.
2. Replace the vendor snapshot with tracked files from that commit (exclude `.git` and generated `_site`/dependencies). Do not patch vendor files silently.
3. Regenerate the lock's commit/version/date and per-file hashes. If a local patch is necessary, record its rationale and separate provenance; don't pretend hashes match upstream.
4. Run `python3 scripts/generate_catalog.py` and review added/removed check families and classifications. Update the fix guide and this coverage table for new behavior.
5. Run `npm run audit` (static/unit checks, browser harnesses and isolated Pages build). Hosting is not needed for skill use.
6. Recheck changed rule interpretations against official docs. A checker release is not a rules update by itself. Do not auto-download a moving branch during a user's game build.

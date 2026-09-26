---
name: yandex-games-dev
description: Build, integrate, audit, and prepare browser games for Yandex Games. Use for SDK startup, Game Ready, ads, localization, saves, purchases, leaderboards, moderation failures, and pre-submission checks with the bundled 93-check runtime checker.
---

# Yandex Games: integration and evidence-based release checks

Support the game's existing engine and scope. Prefer its current JavaScript/Three.js/R3F stack; use Unity/Godot bridges only for existing projects using them. Do not migrate engines to fit an example. This skill handles platform integration and release validation, not art direction.

## Start with the actual project

Inspect repository instructions, entry HTML, package scripts, SDK wrapper, engine boot, build output, and any rejection message. Identify declared devices/orientations/languages and whether ads, progress, IAP, and leaderboards actually exist. Inspect code first; ask only for console settings or credentials that cannot be inferred. Never add monetization just to satisfy an optional check.

Read [rules and sources](references/rules-and-requirements.md), then fetch the current official pages relevant to the task. For submission, review the complete current requirements and moderation pages. Record retrieval date and relevant clauses. If unavailable, use the pinned guidance but label rule verification incomplete. Official rules override this skill and the unofficial checker.

## Choose the workflow

| Task | Read and use |
|---|---|
| Integrate or repair SDK behavior | [SDK](references/yandex-sdk.md), then the engine guide below |
| Run a pre-submission audit or investigate checker output | [Checker runbook](references/debug-checker.md), [fix guide](references/check-remediation.md) |
| Specific check or full feature inventory | [All 93 checks](references/check-catalog.md); exact source and CSV under `vendor/yandex-games-debug-checker/` |
| Browser / Three.js / R3F | [Browser guide](references/browser-html5.md), optional `assets/ya-sdk.js` |
| Existing Unity / Godot project | [Unity](references/unity.md) / [Godot](references/godot.md) |
| Package, draft, or moderation | [Publishing](references/publishing.md), [manual test matrix](references/manual-verification.md) |
| Maintain the bundled checker | [Upstream provenance](references/upstream.md) |

Read only the references needed for the task; the catalog and upstream code are lookup resources.

## Integration invariants

- Boot in order: SDK script → optional development checker → game → await SDK init → read SDK language → load critical assets/save state → render usable screen → `LoadingAPI.ready()` → enable input. Tie readiness to actual playability, never a timer tuned to get PASS.
- Initialize once. Handle init rejection visibly and keep gameplay input gated. A local mock is explicit test infrastructure, never an automatic production fallback.
- `GameplayAPI` and platform pause/resume subscriptions are optional. If used, reflect real gameplay, not menus or loading. Track overlapping pause reasons (ad, hidden tab, menu, platform), so one resume event cannot undo another pause or the player's mute setting.
- Reward only from `onRewarded`, once per ad attempt; `onClose` does not prove a reward. Cover close without display, error, offline, and repeated clicks. Save progress at meaningful checkpoints before an ad boundary.
- Read `environment.i18n.lang` during startup; validate the declared languages in rendered screens, including Canvas/WebGL and baked art. Never use a debug-only resolver to hide a broken real resolver.
- Storage is conditional: browser storage can suit simple non-IAP games; IAP requires cloud progress. Verify restoration rather than the mere presence of `setData`.
- Keep checker, mock SDK, test controls, and development panels out of the release archive. Rebuild and test the clean release too.

## Audit → fix → prove

1. Capture a baseline with the pinned checker loaded **after `/sdk.js`, before game scripts** in a separate development build. Reproduce the reported behavior, not only source patterns.
2. Exercise startup, gameplay, ads if present, pause/resume, languages, saves and resize. Refresh the checker after interactions; preserve report plus independent browser console/network evidence.
3. Distinguish `REQ`, `REC`, `HEURISTIC` and `PASS`, `FAIL`, `WARN`, `NOT VERIFIED`, `N/A`. Even a checker FAIL needs source/context review. Never label N/V a defect, N/A an absent requirement, or 100% score proof of complete coverage.
4. Use the fix guide for each finding. Add meaningful regression tests for stateful changes. Repeat the affected flow, then the release smoke test. Do not rewrite valid engine code to satisfy regexes.
5. Run build/typecheck as available, real browser checks on declared desktop/mobile sizes, and the manual matrix. For game handoff retain screenshots, console results, core-loop playthrough and a proof recording; do not claim devices or platform SDK scenarios not actually tested.
6. Check the final ZIP or directory with `python3 scripts/check_release.py PATH`. This is an archive/artifact check, not execution of the 93 browser checks. Complete draft testing before claiming submission readiness.

## Deliver evidence

Report the build/version, checker commit, tested environment, findings with reproduction and relevant clause, fixes, re-test results, score **and coverage**, justified N/A, and remaining N/V/manual work. Include evidence paths. Distinguish local mocks from real draft verification. Do not promise moderation approval, submit/publish without authorization, or write test scores/purchases into production accounts.

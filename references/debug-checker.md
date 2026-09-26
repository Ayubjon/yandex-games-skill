# Debug Checker runbook

The complete MIT-licensed upstream v1.1.0 is vendored in
`vendor/yandex-games-debug-checker/`, pinned by `vendor/checker-lock.json`.
It supplies 93 executable checks; it is not an official Yandex validator.
See [the catalog](check-catalog.md) for every check and [remediation](check-remediation.md) for actions.

## Install in a diagnostic build

Copy `vendor/yandex-games-debug-checker/debugcheck.js` and its `LICENSE` into the diagnostic output. Keep the license with redistributed copies. Use deterministic script order in the entry HTML:

```html
<head>
  <script src="/sdk.js"></script>
  <script src="debugcheck.js"></script>
  <script type="module" src="game.js"></script>
</head>
```

Do not use independent `async` tags. Do not inject after initialization and expect startup evidence to be recovered. Preserve the filename and `DEBUGCHECK_SELF_START/END` markers so it excludes itself from source scanning. For bundlers, inject only into a diagnostic build; a file in `public/` is normally copied to production too. Use a distinct build output, not an untracked edit to the release ZIP.

Open the game over HTTP, preferably a real Yandex draft. Local `/sdk.js` needs explicit test routing/mocking; never ship the fixture SDK or use mock success as proof of platform behavior. In iframe environments evaluate the API in the **game frame**, not the host frame.

```js
YGDebugChecker.open();       // opens or re-runs
YGDebugChecker.refresh();    // re-runs, makes panel visible
YGDebugChecker.close();      // hides panel; instrumentation remains installed
YGDebugChecker.version;      // '1.1.0'
```

Alternative activation: press `Ctrl+Shift+2` three times, gaps shorter than 1.5 seconds. Panel features: collapsible categories, automatically expanded problem/N/V groups, counts, score, automated coverage, rule badges, event timeline/order messages, refresh, clipboard report (with legacy copy fallback), close, mouse dragging and vertical resizing. The diagnostic panel is upstream developer tooling, not a game UI template.

There is **no public JSON export, awaitable refresh, report getter, CLI game audit, or screenshot API**. Refresh starts asynchronous source fetches; automation must wait for the rendered summary (`.dc-body .dc-sum`) to finish and ensure it is from the latest run. For a plain report use the copy button and save the clipboard text. The copied report includes URL/date/source size/check rows/summary; save the timeline separately because it is not included in that text. Sanitize token-bearing URLs before sharing.

## What it observes

- Static scan: fetches entry HTML and directly linked script/CSS text using XHR; concatenates source, strips itself, and runs regex checks. Does not recursively walk module imports, dynamic chunks, source maps or WASM. Query-string CSS and generated loaders may be missed.
- SDK interception: wraps `YaGames.init()` before the game receives the SDK; records ready, Gameplay start, fullscreen/rewarded calls and actual SDK language reads. Falls back to polling global `window.ysdk` every 50 ms for about 30 seconds. It cannot recover early events after late injection.
- Timeline: document ready, fonts ready, `window.load` (labelled first paint), SDK init invocation, language read, ready, input and ads. `window.load` is **not** first meaningful rendered content, and SDK init invocation is **not** promise fulfillment.
- Runtime DOM probes: viewport overflow, canvas bounds, DOM touch targets, visible Cyrillic text, scrolling, touch CSS, and synthetic contextmenu cancellation. Uses diagnostic details in `window.__dbg.RT` and `window.__dbg.TIMING`.
- Console wrappers record `console.error/warn`. Independently inspect page exceptions, promise rejections, failed requests and WebGL errors; some checker console messages/404s are filtered.
- Ad context records gesture distance. A nearby click is not proof of intentional consent or a logical break. No ad observations do not prove an implemented ad flow safe.

Diagnostic globals expose live mutable objects even though the getter properties look read-only. Read them for evidence; never mutate counters, timestamps, results or source to manufacture PASS. It does not grant rewards, purchase items, write saves or leaderboard scores on its own. It does wrap SDK/console functions, fetch sources, dispatch synthetic events and execute an optional resolver; use only trusted test builds. Upstream skips ordinary absolute HTTP(S) scripts, but this is not a hardened network sandbox (for example protocol-relative URLs need separate review).

## Verdicts and coverage

| State | Interpretation and next action |
|---|---|
| PASS | This probe found its expected evidence; validate semantics where the probe cannot |
| FAIL | A negative result in the upstream hard-fail allow-list; reproduce and verify against the official rule |
| WARN | Observed risk, pattern mismatch or advisory issue; investigate, do not blindly rewrite |
| NOT VERIFIED | Insufficient automatic evidence; exercise the flow or add manual evidence |
| N/A | Optional category was not detected; cross-check the feature inventory to rule out scanner blindness |

`score = PASS / (PASS + FAIL + WARN)`; `coverage = (PASS + FAIL + WARN) / (PASS + FAIL + WARN + N/V)`, rounded to percent. Empty denominator displays 0. Optional N/A categories are excluded. Some absent-feature individual checks return PASS with “n/a” details; counts are not a census of features.

Rule badges are inferred from check text; CSV classification and badges can disagree. The full catalog is preserved rather than silently “corrected.” Inspect executable logic and official clauses for the final decision. In particular the upstream audit prose says gestureless rewarded can hard-fail, but the current allow-list omits that check: its false result is rendered WARN. Do not invent stricter upstream behavior.

## Localization evidence contract (optional)

```js
// Development only. Use the SAME pure resolver the game actually uses.
window.YGDebugCheckerConfig = {
  supportedLanguages: ['ru', 'en'],
  resolveLanguage: resolveGameLanguage
};
```

The pinned implementation executes `resolveLanguage` for `be`, `kk`, `uk`, `uz` and expects `ru`. `supportedLanguages` appears in the documented contract but does not drive exhaustive testing in this version. Do not force a Russian mapping over a legitimately supported native translation merely to satisfy this heuristic. SDK language access/order still requires actual runtime observation. A frozen/non-configurable `lang` property may prevent observation: retain N/V and verify manually.

## Troubleshooting

| Symptom | Investigate |
|---|---|
| SDK API absent locally | Route `/sdk.js` to a test fixture explicitly, or use a draft; do not hide production init failure |
| Missing startup timestamps | Script order, async loading, late injection, missing global fallback, frozen SDK properties; cold reload |
| Panel stuck analyzing | Source XHR/CSP/network errors; upstream requests have no timeout; inspect Network and reload |
| Static failures in a bundled/WASM build | Inspect bridge/source map locally, browser runtime and manual proof; do not add dead signatures |
| N/A despite an existing feature | Feature detection missed a wrapper/chunk; exercise that feature explicitly |
| Suspicious language warning | Active **resolved** locale, legitimate Cyrillic languages/fallback, visible versus Canvas text |
| Overflow PASS despite clipping | Upstream skips hidden/animated/clipped ancestors; inspect actual screenshot and input hit areas |
| Green “SDK initialized” despite bad startup | Probe accepts presence of `YaGames`; independently verify init promise resolved and game received SDK |
| Ready still N/V after a long wait | Absence is not converted to timed FAIL by this probe; use official debug panel and manual timeout evidence |

## Repeatable checker maintenance tests

From this skill root: `npm test` verifies upstream integrity, all-check parity, regression fixtures, wrapper behavior and release checker. `npm run test:browser` runs the original SDK-interception browser smoke plus Orc Castle before/after integration tests. Requires Node 22+ (global WebSocket), Python 3 and Chrome/Chromium; set `CHROME_BIN` if not discoverable. Browser tests use mocks and do not validate a user's game or real ad/payment services.

`npm run test:demo` validates the original demo builder in a temporary copy; `npm run audit` runs all three suites. The root GitHub Actions workflow runs this full audit on pushes and pull requests, without deploying Pages.

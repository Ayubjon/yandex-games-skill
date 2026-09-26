# Manual evidence matrix

Use alongside the 93 checks. For each row record `PASS / FAIL / NOT TESTED / N/A`, build, device/browser, steps, expected/actual result, and evidence path. N/A requires a feature/platform reason; unavailable platform access is NOT TESTED.

| Area | Required exercise and observable evidence |
|---|---|
| Cold startup | Empty-cache draft load; dismiss loader early, attempt touch/key/click; game ignores input until usable localized screen and ready transition |
| Failure startup | Fail SDK/critical asset/save request; readable recovery state, no fake ready/mock success, retry produces one loop |
| Gameplay lifecycle | Menu → play → pause → resume → result; if GameplayAPI is used its state matches actual simulation/input |
| Ads | Each implemented format: voluntary RV, valid interstitial placement, open, reward, close, no-fill, error, duplicate clicks; reward once only on reward |
| Overlapping pause | Ad open → hide tab → ad close → show tab; menu/manual mute survives; simulation/timers/audio don't leak |
| Saving | Meaningful progress → immediate reload, rotate, ad navigation and new session; exact state restored; failed load never overwrites good data |
| Guest/account | Guest continuation, optional login/cancel and account change; no forced login wall or cross-account cached save |
| IAP | Catalog currency, cancel/fail/success, pending purchase recovery; interrupt after grant before consume; no lost/double grant; cloud continuity |
| Leaderboard | Real allowed read, no-entry/unavailable/auth error paths, proper order/units/name; no audit writes into production |
| Localization | Every declared locale via platform mock from fresh state; all screens and raster/Canvas/WebGL text, prices, errors, help and results |
| Input/browser | Desktop keyboard including RU layout, mouse/touch, multitouch, native contextmenu/selection/drag/tooltip/scroll/zoom/refresh, keyboard fields and focus |
| Layout | Declared desktop/mobile sizes and orientations; rotate during gameplay/ad/menu, safe areas, keyboard and fullscreen transitions; legible text and correct hit areas |
| Stability | Core loop through win/loss/retry, another session, context/resource failures; independent console, exceptions/rejections and network evidence |
| Packaging | Exact clean ZIP, root index, size/names/resources, no checker/mock/dev controls; clean release smoke after diagnostic run |
| Content/draft | Rights, age, actual gameplay, listing/translation consistency, declared settings, promo truthfulness and current rules |

Mock callbacks and desktop mobile emulation are useful regression evidence, not real mobile/SDK proof. State actual tested devices, and retain untested mobile Safari/native platform cases honestly. Close the checker before screenshots/recording the game's visual result. Include a short proof recording of startup and core loop, plus the affected ad/pause/save/resize sequence where relevant.

## Report skeleton

```text
Build/revision and artifact:
Checker version/commit:
Official rules accessed (date + URLs/clauses):
Environment (mock vs real draft, browsers/devices/viewports/locales):
Feature inventory (ads, saves, IAP, leaderboard):
Baseline -> final PASS/FAIL/WARN/N/V, score and coverage:
Finding: exact check/category, reproduction, observed behavior, clause/class,
         source location, fix or justified false positive, retest evidence.
Manual matrix outcomes:
Clean archive/release smoke result:
Evidence files (reports, screenshots, recording, console/network):
Remaining N/V / NOT TESTED / risks:
```

Do not report 93 tests passed merely because 93 definitions exist. Optional sections and unobserved runtime behavior change executed counts. A fully green report still leaves manual coverage.

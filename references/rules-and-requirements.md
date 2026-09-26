# Rules and authoritative sources

The main practical baseline is the pinned [Nioris checker](upstream.md). Its tests are unofficial and sometimes stricter or less precise than the rules. Official pages were reviewed for this revision on **2026-09-26**; fetch relevant pages again when applying this skill. Record rule changes instead of treating this date as perpetual verification.

## Source map

| Decision | Official source |
|---|---|
| Full current rules, content, archive and recommendations | https://yandex.ru/dev/games/doc/ru/concepts/requirements |
| Moderation process | https://yandex.ru/dev/games/doc/ru/concepts/moderation |
| SDK loader and initialization | https://yandex.ru/dev/games/doc/ru/sdk/sdk-about |
| Ready and optional lifecycle | https://yandex.ru/dev/games/doc/ru/requirements/1/19 and https://yandex.ru/dev/games/doc/ru/sdk/sdk-game-events |
| Saving policy and player methods | https://yandex.ru/dev/games/doc/ru/requirements/1/9 and https://yandex.ru/dev/games/doc/ru/sdk/sdk-player |
| Language detection and fallback | https://yandex.ru/dev/games/doc/ru/requirements/2/14 and https://yandex.ru/dev/games/doc/ru/sdk/sdk-environment |
| Ad placement and API | https://yandex.ru/dev/games/doc/ru/requirements/4/4 and https://yandex.ru/dev/games/doc/ru/sdk/sdk-adv |
| Catalog, purchase recovery and signing | https://yandex.ru/dev/games/doc/ru/sdk/sdk-purchases |
| Current leaderboard methods | https://yandex.ru/dev/games/doc/ru/sdk/sdk-leaderboard |
| Console/upload/testing | https://yandex.ru/dev/games/doc/ru/console/add-new-game and https://yandex.ru/dev/games/doc/ru/console/test-game |

If a deep link moves, follow navigation from https://yandex.ru/dev/games/doc/ru/ rather than assuming the old behavior still holds.

## Corrections to the former skill

- Browser storage is not universally forbidden; choose from the current saving policy. Cloud persistence is required for IAP.
- Game Ready is separate from SDK initialization. Gameplay markup and platform pause-event subscriptions are optional, with correctness requirements if adopted.
- There is no fixed requirement to ship 13 languages; inspect the languages declared in the draft.
- An eight/ten-second checker warning is not the documented 90-second Game Ready diagnostic window.
- Interstitial placement depends on game type and context, not a blanket “every ad must follow a click.” Rewarded remains voluntary.
- Do not describe all fantasy/magic as prohibited: inspect the specific content clause. Avoid broad invented content bans.
- Recommendations (section 6), engineering heuristics and mandatory requirements have different weight. Contact email, sound toggle and pause recommendations are not universal hard-fail criteria.
- Do not hardcode moderation turnaround, retry delays or plugin compatibility from old notes. Read the current console/docs when needed.

## Beyond automatic detection

Manually inspect content/rights, age suitability, core gameplay depth, meaningful controls, full translations, product delivery, draft metadata and real-device behavior. Refer to the actual clause in a finding and separate fact from inference. A rule number attached to a regex does not make its inference authoritative.

# Publishing on Yandex Games — console, localization, monetization

> Verify against the live docs — Yandex changes the flow.
> - Upload a game: https://yandex.com/dev/games/doc/en/console/add-new-game
> - Test a draft: https://yandex.com/dev/games/doc/en/console/test-game
> - Release updates: https://yandex.com/dev/games/doc/en/console/update-game

## Developer console flow
1. Create a **draft** in the console; fill in name, description, category, screenshots,
   age rating, and supported languages.
2. Upload the game **ZIP** (`index.html` in the root; relative paths). Packaging rules:
   see `references/rules-and-requirements.md`.
3. **Test** via the draft's testing URL — the SDK works in the draft/dev environment.
4. **Submit for moderation.** Full moderation (build changed) ~3–5 business days;
   content-only (promo changed) ~1–2 days.
5. On approval: **Published**, or **Verified** if you postponed → then click Publish.

## Localization (don't skip — partial localization is a top rejection reason)
- Declare every language you support and translate **all** UI for each one.
- Read the current locale from the SDK: `ysdk.environment.i18n.lang` (`ru` / `en` / `tr` / …)
  and select your in-game strings from it.
- Localize the store listing (name / description / screenshots) per language too.

## Monetization setup
- Ads and in-game purchases are configured in the console and called via the SDK
  (see `references/yandex-sdk.md`).
- Ad policy: interstitials **between levels** (not every action), rewarded video for
  opt-in value, optional sticky banner. Spammy ads get rejected.

## Pre-submission checklist
Run the **common rejection reasons** in `references/rules-and-requirements.md` first:
`LoadingAPI.ready()` called · full localization · correct ad setup · no crashes/console
errors · game name matches promo · age rating matches content · no cropped UI · not a
duplicate · screenshots show real gameplay (~70%).

> Re-check the console flow and rules on the live pages before submitting.

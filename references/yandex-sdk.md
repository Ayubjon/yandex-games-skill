# SDK integration patterns

Read the applicable live sources from [rules and sources](rules-and-requirements.md). This is an implementation guide; recheck options, rate limits and availability in the current SDK.

## Bootstrap and readiness

On platform hosting load `/sdk.js` before the game. For external hosting use the documented current loader, rather than copying an old S3 URL from a tutorial. Await `YaGames.init()` once; share the promise. A retry after rejection must be explicit and must not start a second game loop.

```js
const ysdk = await YaGames.init();
const sdkLanguage = ysdk.environment.i18n.lang;
const language = resolveGameLanguage(sdkLanguage); // pure, shared resolver
await loadCriticalResources(language);
await restoreProgress();
await renderUsableEntryScreen();
ysdk.features.LoadingAPI.ready();
inputEnabled = true;
```

The application functions above are contracts to implement, not supplied APIs. `renderUsableEntryScreen()` must resolve after real renderer readiness; calling ready inside init's callback alone proves nothing. Avoid optional chaining around required APIs that silently hides a broken platform build. Handle failure with a retry/error state while input remains gated.

`assets/ya-sdk.js` supplies a thin global/CommonJS helper. It deduplicates init/player requests, rejects use before init, makes ready idempotent, and forwards ad callbacks. It does **not** manage rendering, pause, audio, input, payments, rate limits or save schema. Connect those in the game; don't mistake the wrapper for a complete integration.

## Gameplay and pause

When adopted, `ysdk.features.GameplayAPI.start()` represents active gameplay and `stop()` represents its end/pause. Menus, loading and open ads are not active gameplay. SDK platform pause/resume listeners use `ysdk.on`/`off` where supported; treat these as another pause reason, not a global boolean. Hidden-tab, ad, menu and manual pause can overlap. Preserve the user's mute state separately from temporary audio suspension.

## Ads

Fullscreen: `ysdk.adv.showFullscreenAdv({callbacks})`. Rewarded: `ysdk.adv.showRewardedVideo({callbacks})`. Callbacks must connect to the game's state controller:

```js
// Save at the prior checkpoint; invoke this directly at the chosen valid placement.
let granted = false;
const callbacks = {
  onOpen() { pauses.add('ad'); applyPauseState(); },
  onRewarded() {
    if (granted) return;
    granted = true;
    grantAndPersistPromisedReward(); // application-owned, with failure recovery
  },
  onClose() { pauses.delete('ad'); applyPauseState(); },
  onError(error) { pauses.delete('ad'); applyPauseState(); showAdUnavailable(error); }
};
// A request-in-flight guard must also prevent overlapping attempts.
ysdk.adv.showRewardedVideo({ callbacks });
```

Cover synchronous throws too. A watchdog may expose recovery UI, but must not resume under an ad that is still visible. `onClose(false)` for fullscreen means the ad wasn't shown; continue appropriately. Never grant a rewarded benefit merely because the ad closed. Sticky banners use `showBannerAdv`, `hideBannerAdv`, `getBannerAdvStatus`; reserve safe space and test their real dimensions.

## Progress and authorization

Use `ysdk.getPlayer()` and `player.getData(keys)` / `player.setData(data)` for cloud progress. Numeric counters use `getStats`, `setStats`, `incrementStats` as appropriate. Catch errors, cache the player promise, serialize writes, and distinguish load failure from empty progress. Invalidate cached identity after an account change. Do not force login merely to enter the game; use the current authorization flow for optional capabilities that need it. Save guest progress too. Current quotas/size limits belong in the implementation only after checking the live player docs.

## Purchases

Use documented `ysdk.payments` or preload with `await ysdk.getPayments()`; `getCatalog()` supplies product data including `priceValue`, `priceCurrencyCode` and `getPriceCurrencyImage(size)`. Render catalog-provided currency rather than literal symbols.

For client processing, use plain responses (default `signed: false`). For server processing, `signed: true` returns signed payloads for server validation; don't read them as ordinary `productID`/`purchaseToken` objects. Reconcile `getPurchases()` during startup and purchase completion. Durable grant and idempotency tracking precede `consumePurchase(token)` for consumables. Keep permanent entitlements recoverable. Test interruptions between every step; the wrapper intentionally does not implement financial fulfillment.

## Leaderboards

Use `ysdk.leaderboards.getDescription`, `setScore`, `getPlayerEntry`, `getEntries`. Check `await ysdk.isAvailableMethod('leaderboards.setScore')` before an authenticated operation. Handle `LEADERBOARD_PLAYER_NOT_PRESENT` separately from service failure. Technical name, sort direction and score units must match the console. Preserve saves independently; do not send synthetic scores during auditing. Recheck request limits before adding retries/polling.

## Locale and other optional APIs

Read `environment.i18n.lang` at startup even if only one language is supported. The game's actual resolver should honor supported languages first and use documented fallbacks for unsupported ones. Do not replace it with the checker's hardcoded fallback assumptions. Translate raster/Canvas/WebGL content as well as DOM.

Other existing integrations may use `feedback.canReview()/requestReview()`, `getFlags()`, `serverTime()` and banner APIs. Preserve them, verify their current availability, and test relevant failure paths; they are not additional mandatory features and are not fully covered by the 93 checks.

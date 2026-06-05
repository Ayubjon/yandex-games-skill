# Yandex Games SDK reference

> ⚠️ Verify against the live SDK docs — Yandex changes the API.
> Hub: https://yandex.com/dev/games/doc/en/sdk · RU: https://yandex.ru/dev/games/doc/dg/sdk/sdk-about

## 1. Connect & init
Include the SDK script — relative path on Yandex hosting, absolute on your own domain:
```html
<script async src="/sdk.js" onload="initSDK()"></script>
<script>
  async function initSDK() {
    const ysdk = await YaGames.init();
    // ... use ysdk
  }
</script>
```
- Custom domain: `<script src="https://sdk.games.s3.yandex.net/sdk.js"></script>`
- Server-verified payments: `YaGames.init({ signed: true })`
- Docs: https://yandex.com/dev/games/doc/en/sdk/sdk-about

## 2. Loading & gameplay events — `ready()` is REQUIRED
```js
ysdk.features.LoadingAPI?.ready();   // call once loaded & playable — hides the loader (MANDATORY)
ysdk.features.GameplayAPI?.start();  // gameplay begins/resumes: level start, menu closed, after ad, tab focus
ysdk.features.GameplayAPI?.stop();   // gameplay pauses/ends: menu open, ad shown, tab blur
```
Docs: https://yandex.com/dev/games/doc/en/sdk/sdk-game-events

## 3. Player & cloud saves
```js
const player = await ysdk.getPlayer();
player.isAuthorized();                       // boolean
await ysdk.auth.openAuthDialog();            // prompt login
await player.setData({ level: 5 });          // cloud save, object, ≤ 200 KB
const data = await player.getData(['level']);
await player.setStats({ score: 100 });       // numeric stats, ≤ 10 KB
await player.incrementStats({ score: 10 });
player.getUniqueID(); player.getName(); player.getPhoto('medium');
```
Rate limits: `getPlayer` 20 / 5 min; `set/getData` 100 / 5 min. Docs: https://yandex.com/dev/games/doc/en/sdk/sdk-player

## 4. Leaderboards — use `ysdk.leaderboards` (`getLeaderboards()` is deprecated)
```js
await ysdk.leaderboards.setScore('leaderboard2024', 12345);     // 1/sec, needs auth
const me  = await ysdk.leaderboards.getPlayerEntry('leaderboard2024');
const top = await ysdk.leaderboards.getEntries('leaderboard2024', {
  quantityTop: 10,     // 1–20
  includeUser: true,
  quantityAround: 5,   // 1–10
});
```
Docs: https://yandex.com/dev/games/doc/en/sdk/sdk-leaderboard

## 5. Ads
```js
// Interstitial — between levels, never on every action:
ysdk.adv.showFullscreenAdv({ callbacks: {
  onClose: (wasShown) => { /* resume game */ },
  onError: (e) => {},
} });
// Rewarded video — grant the reward inside onRewarded:
ysdk.adv.showRewardedVideo({ callbacks: {
  onOpen: () => {},
  onRewarded: () => { /* give reward */ },
  onClose: () => {},
  onError: (e) => {},
} });
// Sticky banner:
ysdk.adv.showBannerAdv();
ysdk.adv.hideBannerAdv();
ysdk.adv.getBannerAdvStatus();
```
Policy: pause game + audio during ads; don't spam interstitials (a common rejection). Docs: https://yandex.com/dev/games/doc/en/sdk/sdk-adv

## 6. In-game purchases
```js
const payments = await ysdk.getPayments({ signed: true });
const product  = await payments.purchase({ id: 'product1' });
const owned    = await payments.getPurchases();
const catalog  = await payments.getCatalog();
await payments.consumePurchase(product.purchaseToken);
```
Docs: https://yandex.com/dev/games/doc/en/sdk/sdk-purchases

## 7. Environment / locale
```js
ysdk.environment.i18n.lang;   // 'ru' | 'en' | 'tr' | ...
ysdk.environment.i18n.tld;
ysdk.environment.app.id;
```
Localize the UI for every declared language — partial localization is a frequent rejection.

## 8. Reviews, remote config, time
- Reviews: `await ysdk.feedback.canReview()` → `ysdk.feedback.requestReview()`
- Remote config / flags: `await ysdk.getFlags()`
- Trusted time: `ysdk.serverTime()`

> Re-verify method names, options, and limits on the live docs before relying on them.

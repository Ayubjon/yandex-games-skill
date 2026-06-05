# Browser / HTML5 games (vanilla JS, Phaser, PixiJS, Construct 3)

> Verify SDK details against `references/yandex-sdk.md` (fetched from live docs).

## Minimal `index.html`
```html
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <canvas id="game"></canvas>
    <script src="/sdk.js"></script>      <!-- Yandex SDK; relative path on Yandex hosting -->
    <script src="ya-sdk.js"></script>    <!-- optional wrapper from assets/ -->
    <script type="module" src="game.js"></script>
  </body>
</html>
```
```js
// game.js
await YaSDK.init();
// ... load assets, render the first frame ...
YaSDK.ready();          // REQUIRED — hides the Yandex loader
```

## Packaging & rules
- ZIP with **`index.html` in the root**, **relative paths**, HTTPS, ≤ ~100 MB uncompressed.
- Don't store progress in `localStorage` — use SDK cloud saves (`player.setData`).
- Pause audio + the game loop on `visibilitychange` (`document.hidden`) and during ads.

## Phaser
- Init the SDK around `new Phaser.Game(...)`; call `YaSDK.ready()` once the first scene is created.
- On ad open: `scene.scene.pause()` + mute; resume in the ad's `onClose`.

## PixiJS
- Same pattern: init SDK, start the ticker, call `ready()` after the first render; stop the ticker during ads.

## Construct 3
- Check Addons for a **Yandex** plugin that wraps the SDK; otherwise export to HTML5 and call the SDK from a Script object / event sheet. Still call `LoadingAPI.ready()` on layout start.

## Gotchas
- Relative asset paths only (the game is served from a subpath).
- No external network calls beyond allowed domains.
- Test pause/resume around both interstitial and rewarded ads.

> Re-check the loader URL and SDK methods on the live docs.

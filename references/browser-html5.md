# Browser / HTML5 / Three.js / React Three Fiber

Preserve the existing engine. For SDK behavior use [SDK](yandex-sdk.md); for diagnostic injection use [checker](debug-checker.md).

## Entry and boot

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <script src="/sdk.js"></script>
  <!-- Diagnostic build ONLY: <script src="debugcheck.js"></script> -->
  <script src="ya-sdk.js"></script>
  <script type="module" src="game.js"></script>
</head>
<body><main id="game"></main></body>
</html>
```

`game.js`: await `YaSDK.init()`, read `YaSDK.lang()`, resolve locale, load assets/progress, render the entry screen, call `YaSDK.ready()`, then enable input. Set initial input gating before binding listeners. Catch startup failures; no mock-success fallback in production.

React StrictMode can rerun effects: share init/resource promises outside remounting components, unsubscribe listeners on cleanup, and guard ready and game-loop ownership. In R3F, canvas creation or a resolved Suspense boundary alone may not mean critical textures/fonts and the interactive scene are visible. For Three.js, resize renderer/camera and hit coordinates together, clamp device pixel ratio appropriately and inspect context loss/mobile memory.

## Contain browser behavior

Use a full-viewport or deliberately framed root, with body margin reset, intentional root height, `overflow:hidden`, `overscroll-behavior:none`, appropriate `touch-action` and `-webkit-touch-callout:none` on the playable surface. Prevent image dragging/context menus/accidental selection, tap highlights and native tooltip bubbles; provide designed focus/press states and accessible names. Keep intentional inputs editable and keyboard accessible. Avoid suppressing all keyboard defaults indiscriminately.

Test browser zoom/refresh gestures, safe areas, keyboard opening, orientation and fullscreen transitions. Preserve proportional sprite/scene scaling; fix clipped layouts rather than stretching visuals. A ResizeObserver on the game container can complement orientation/fullscreen/viewport events. No page scroll should leak from internal panels.

## Existing engines

- Pixi/Phaser/other existing 2D engines: connect ticker/scene/input/audio to the shared pause state. Do not add one of these dependencies to a Three.js project.
- Construct: inspect the actual exported wrapper/plugin; validate runtime ordering and callback behavior rather than assuming a plugin handles it.
- A CDN or bundler dependency can hide signatures from the static scanner. Audit the final bundle and runtime. The checker does not traverse every ES module.

Use a build base suitable for relative game assets; `/sdk.js` is an intentional platform-root exception. Test the final output served from a subdirectory, then from a real draft. Package only the clean build. Simple non-IAP games may persist locally if they satisfy the current saving rules; don't blindly replace working persistence just for a cloud-signature PASS.

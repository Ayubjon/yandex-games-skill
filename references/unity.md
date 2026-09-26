# Existing Unity WebGL projects

Inspect Unity version, WebGL template, build compression, current SDK plugin and `.jslib` bridge before changing them. Follow current Unity/Yandex hosting docs for compression/MIME/header support; don't assume Brotli/Gzip or threading works on every deployment. Keep the existing maintained plugin when it meets requirements.

## Separate bridge responsibilities

`YaInit` awaits `YaGames.init()`, reads SDK language and notifies C# of success/error; it must **not** call `LoadingAPI.ready()`. C# loads the critical scene/assets and save state, applies localization, renders usable UI, then invokes a distinct `YaReady` bridge method and enables gameplay input. Guard duplicate initialization across scene changes.

For ads expose open, reward, close and error callbacks through the bridge. Award once from reward only. Map shared pause reasons into simulation/input and audio; do not unconditionally restore `Time.timeScale=1` and sound on every close event. Preserve the prior menu/manual pause and mute settings. Catch promise rejection in JavaScript and notify C# explicitly; `SendMessage` targets must exist when callbacks arrive.

Cloud save messages need serialized validated data and completion/error callbacks, not fire-and-forget success. Do not overwrite loaded progress with defaults before async restore completes. Purchases require durable idempotent delivery and pending-purchase reconciliation.

## Checker integration and proof

Place `/sdk.js`, `debugcheck.js`, then the Unity loader in the diagnostic template. Keep the checker outside the WASM payload. Static C# or compiled WASM logic is unavailable to the browser scanner; use bridge source, runtime events and manual evidence for N/V or misleading N/A. Do not insert dead JavaScript signatures to appease it.

Test load readiness, language before interactivity, tab/ad overlap, touch input, orientation, renderer sizing, mobile memory, context loss, save restoration and a clean production template with no checker/mock. Follow [manual verification](manual-verification.md) and [publishing](publishing.md).

# Fix guide for all checker families

Look up exact titles and classifications in [the 93-row catalog](check-catalog.md). A signature match is evidence about source, not necessarily correct behavior. The sections below cover every catalog family, including checks duplicated across static and runtime categories.

## Startup

**SDK script tag, YaGames.init, LoadingAPI.ready, GameReady timing, input gate, ready integrity, SDK loaded/initialized.** Use `/sdk.js` on Yandex hosting and relative game assets. Await one initialization before SDK-dependent work. Load saves/translations/critical assets and render the usable entry screen before ready; release input in that same readiness transition. Keep loading/input disabled on failure, expose a retry state, and avoid production mock fallbacks. Check a cold draft load with the platform loader dismissed manually. Click/key/touch during loading: no gameplay action must occur. The official 90-second diagnostic window is not a loading target. A warning at eight seconds from the checker is not an eight-second platform deadline. Do not add sleeps or fake source signatures to satisfy timing probes.

## Sound and lifecycle

**visibilitychange, AudioContext suspend/resume, sound/game paused during ads, sound toggle, pause.** Track independent reasons in a Set, e.g. `hidden`, `ad`, `menu`, `platform`; effective gameplay requires ready, a gameplay scene and an empty Set. The player's sound preference is separate. Subscribe once and remove subscriptions on teardown. Stop simulation/input and audio for an ad, and clear only the ad reason on close/error; do not restart under a hidden tab or paused menu. Catch asynchronous AudioContext failures and resume only when permitted by user activation. Test ad → tab hide → close → tab show, including muted sound. Gameplay markers and platform event subscriptions are optional but must follow real state if present. The checker does not fully prove these transitions.

## Ads

**Interstitial/rewarded presence, onOpen/onClose/onError/onRewarded, placement context, gesture, save-before-ad, orientation, imitation blocks, external networks.** Add only the ad formats chosen by the product. Invoke SDK ads at valid placements; do not replace a failed SDK ad with an imitation. Guard duplicate requests. Cover synchronous invocation failure and SDK error/close callbacks, including `wasShown === false`. Grant the promised rewarded benefit only in `onRewarded`, at most once per attempt; cancellation/error/ordinary close earns nothing. Persist the grant. Offer explicit voluntary consent and allow the core game to continue without rewarded viewing.

Save at the preceding durable checkpoint, so an arbitrary awaited network save does not delay a click-triggered ad past the permitted placement. If saving fails, skip the ad or recover first; do not discard progress to preserve ad timing. For long real-time levels, inspect the current timer-placement rule rather than applying the click rule universally. During its warning and ad, gameplay is paused. Verify orientation and sticky banner safe areas in the actual draft. Test success, no fill, cancellation, error, repeated clicks and backgrounding with platform tools. SDK method presence does not prove ad semantics.

## Saves

**player.setData, player.getData.** Decide storage from game requirements: a simple non-IAP game may use localStorage/IndexedDB; IAP needs cloud progress. Distinguish a genuinely new save from a failed read. Never overwrite a user's progress with defaults after a transient read failure. Version the schema, validate data, serialize/debounce writes within current limits, and save at meaningful progress events. Test exact restoration after reload, orientation change, advertising navigation and another session; cloud continuity needs another device/account context as appropriate. An absent cloud signature is not a defect for a valid local-only game. Leaderboard scores are not save files.

## Purchases

**getPayments, consumePurchase, getPurchases, getCatalog, currency literals.** Identify the supported current initialization path (`getPayments()` or documented direct `ysdk.payments`); the pinned checker may miss the latter. Fetch catalog prices/currency graphics; do not hardcode rubles/dollars or invent `getPriceCurrencyCode()` when the current catalog uses `priceCurrencyCode`. Test empty catalog, missing product, declined/cancelled transaction, network failure and reload recovery.

On startup reconcile pending purchases. Use purchase tokens as idempotency keys: validate, grant and durably persist once, then consume consumables. A durable entitlement is not a consumable. Never consume first or mark delivered before a failed save. Keep retries safe across a crash after grant but before consume. Server-signed responses require server verification; do not treat `{signature}` as a plain purchase object. The checker proves none of this business logic. See [SDK](yandex-sdk.md).

## Localization

**SDK language, fallback, auto-detection, SDK-before-URL, language-before-interactivity/ready/UI, Cyrillic scan, Canvas reminder.** Read the SDK language in startup even for a one-language/textless game. Use a pure resolver shared by game and optional checker contract. Support the declared languages; apply documented fallback only to unsupported locales. Do not prioritize a URL language over SDK merely because local testing uses `?lang=`. Test fresh storage and saved preference deliberately. Inspect all HUD/menu/dialog/error/shop/tutorial/end-state text and raster text; a DOM scan cannot see Canvas/WebGL or images. Non-Russian SDK locale can legitimately resolve to Russian, and Cyrillic is not exclusive to Russian. Resolve those warnings with actual locale evidence, not by deleting valid translations.

## Browser and mobile

**context menu, selection, touch-action, viewport, overflow, overscroll, callout, scroll/swipe prevention, runtime body/document/touch/contextmenu.** Contain the playable surface; reset body margin and dimensions, use intentional viewport sizing, disable unwanted page scroll/overscroll, dragging, selection and callouts. Suppress contextmenu across the actual game surface; the checker dispatches on body/outside nodes too, so embedded game boundaries need contextual review. Use designed controls/focus feedback and accessible names instead of native tooltips/default chrome. Preserve functional editing in deliberate text inputs; verify the mobile keyboard opens. `touch-action` alone is not proof that iOS refresh/zoom is blocked: test real devices, browser navigation gestures and edge swipes. Internal scrollable panels may be legitimate even when page scrolling is not.

## Dangerous patterns

**alert, confirm, prompt, document.write, eval.** Replace blocking native dialogs with in-game states and unsafe/dynamic injection with ordinary DOM or modules when present in the game's own code. Inspect exact call sites: comments, strings, engine-generated JavaScriptBridge calls and dependency internals may cause false positives. Do not break an engine bridge or suppress a required interaction solely for a regex. Treat these as engineering signals, not five universal platform bans.

## Archive

**No Yandex S3 URLs.** Game assets must use packaging-compatible paths; do not confuse the platform's `/sdk.js` exception with game files or copy old hosting URLs into the build. Inspect actual network requests and all final files. Use [publishing](publishing.md) and the release script for root index, filenames, size, debug artifacts, integrity and clean-build checks; the browser scanner cannot establish them.

## Quality and controls

**WebGL notices, native video/audio controls, keyboard focus, URL gating, mobile fullscreen, desktop aspect, debug/WIP UI, physical keys, OS shortcuts, letterboxing, external video, profanity, orientation resizing, touch targets, no useless exit, title.**

- Handle renderer startup failures in a product-appropriate way; do not expose development instructions or raw engine prompts. Never hide a fatal error and call the game ready.
- Inspect native player/OS media UI on supported devices. `controlsList="nodownload"` does **not** remove native video controls despite an upstream regex accepting it. Use intentional controls and a sound approach that meets the actual requirement.
- Keep mobile text fields editable/focusable and keyboard-visible; account for viewport/keyboard resize. Use `KeyboardEvent.code` for physical movement, `key` for text/semantic input. Avoid OS/browser shortcut collisions, while preserving accessibility/navigation where appropriate.
- Do not gate availability by host/URL. Inspect context: an asset base URL or analytics label is not automatically host gating.
- Fit the active field, surrounding UI and safe areas to declared orientations; preserve scene/sprite aspect ratios. An extreme active-field aspect, clipped controls and large unused space need actual viewport evidence. A full-window canvas alone does not prove a correct active field. 44 px touch targets are a usability heuristic, not an exact official threshold.
- Recompute layout, renderer size/pixel ratio, camera projection and hit coordinates on relevant container/orientation/fullscreen changes. Avoid recreating the game or resetting progress during resize.
- Remove debug controls, placeholder text and unfinished destinations from releases. A valid Restart button is not automatically a debug tool; upstream keyword heuristics can overreach.
- Check external-player navigation, ad lookalikes, visible profanity and meaningful controls manually. Title, mute/pause and useless-exit guidance have differing REQ/REC/heuristic classifications; do not elevate recommendations to guaranteed rejection.
- Review readability in actual screenshots. Do not shrink text to satisfy overflow; simplify the interface. The checker cannot judge visual coherence or accessible keyboard focus.

## Leaderboards

**Current API, setScore, getEntries, technical name.** Use `ysdk.leaderboards`, match the console technical identifier, check method availability/authorization and handle absent player entries. A dynamic identifier requires runtime/console evidence. Do not rename an existing board solely for the checker's alphanumeric heuristic. Render actual results with correct ordering/units; no fake scores. Rate-limit legitimate score submission and never write test scores into production as an audit probe. Progress must remain recoverable independently of rankings.

## Timing

**Fonts, first paint, late ready, SDK-before-input, language-before-UI.** Capture a cold-load recording and readiness/input state in the official debug panel. The upstream “first paint” timestamp is `window.load`, and font readiness may include irrelevant fonts or miss fonts initiated later. Wait on your actual critical renderer/assets; don't wait blindly on a checker proxy. Document early ignored input separately from an accepted gameplay action. Missing timestamps need another cold run or manual evidence, not a fabricated zero.

## Runtime visual and console checks

**DOM overflow, canvas fill, touch targets, console errors.** Inspect all screens at target desktop/mobile sizes with the checker closed as well as open. Clipped ancestors and animation can hide overflow from the probe; Canvas text and hit regions are invisible to DOM measurements. Inspect browser console, unhandled errors/rejections and failed network requests independently of the checker filters. A successful startup run cannot prove an error-free session: complete the loop, retry actions, reload and rotate.

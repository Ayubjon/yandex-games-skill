---
name: yandex-games-dev
description: Use when building or publishing a game for Yandex Games (Я.Игры) — integrating the Yandex Games SDK (ads, leaderboards, cloud saves, purchases) for HTML5/browser, Godot, or Unity, and passing Yandex moderation. ALWAYS fetch the current Yandex rules and SDK docs first.
---

# Building games for Yandex Games (Я.Игры)

## Step 0 — Fetch the CURRENT rules first (do not skip)

Yandex changes its requirements, moderation rules, and SDK. The notes in this
skill are a starting checklist, **not** the source of truth. Before writing game
code, open and read the live docs:

- Docs hub (RU): https://yandex.ru/dev/games/doc/dg/
- Docs hub (EN): https://yandex.com/dev/games/doc/en/

Read the current **requirements**, **moderation rules**, and **SDK reference**.
`references/rules-and-requirements.md` lists exactly what to check and the deep links.

## When to use this skill

Building a game for Yandex Games, integrating its SDK, or publishing/passing
moderation — in a browser/HTML5 engine, Godot, or Unity.

## Universal workflow

1. **Fetch current rules** (Step 0).
2. **Pick the engine** → open the matching reference below.
3. **Build the game as HTML5** (browser) or export to Web/WebGL (Godot/Unity).
4. **Integrate the SDK** — at minimum `YaGames.init()` + `LoadingAPI.ready()`;
   then cloud saves / leaderboards / ads / purchases as needed. For HTML5 you can
   drop in `assets/ya-sdk.js`.
5. **Test as a draft** in the developer console.
6. **Package the ZIP** (`index.html` in the root) and **upload**.
7. **Pass moderation** — run the rejection-reasons checklist first.

## References

| Topic | File |
|---|---|
| Live rules, requirements, moderation | `references/rules-and-requirements.md` |
| Yandex Games SDK (ads, saves, leaderboards, purchases) | `references/yandex-sdk.md` |
| Browser / HTML5 (JS, Phaser, PixiJS, Construct) | `references/browser-html5.md` |
| Godot 4 (Web export) | `references/godot.md` |
| Unity (WebGL) | `references/unity.md` |
| Publishing, console, localization | `references/publishing.md` |
| Copy-paste SDK wrapper | `assets/ya-sdk.js` |

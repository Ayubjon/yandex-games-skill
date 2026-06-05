# Design: yandex-games-dev — an AI skill for building Yandex Games

**Date:** 2026-06-05
**Status:** approved, ready for the implementation plan

## Goal

A portable **Agent Skill** (`SKILL.md` + reference files, plain Markdown) that
turns any AI assistant into an expert at building and shipping games for
**Yandex Games (Я.Игры)** — centered on integrating the **Yandex Games SDK**
and the per-engine specifics for browser/HTML5, Godot, and Unity.

It is authored in the Anthropic Agent Skill format (auto-activates in Claude
Code) but is pure Markdown, so it plugs into any tool: Claude Code
(`~/.claude/skills/`), Cursor (point a rule at it), or any chat (attach the
relevant reference file).

Working name: `yandex-games-dev`. Repo: `yandex-games-skill` (public). English.

## Core principle: rules are live — fetch them first

Yandex updates its requirements, moderation rules, and SDK. We **cannot** freeze
them accurately in a static file. Therefore the skill's #1 directive is:

> **Before writing any game code, fetch and read the CURRENT official Yandex
> Games rules and SDK docs from the live site.** The notes bundled in this skill
> are a convenience checklist and a starting point — the official pages are the
> source of truth, and must be re-checked at the start of every project.

`SKILL.md` makes this **Step 0** of the workflow, with the canonical URLs to
fetch. `references/rules-and-requirements.md` lists those authoritative URLs and
exactly what to verify (technical requirements, moderation/rejection rules,
content policy, monetization policy, SDK changelog). Every reference file
carries a short reminder: "verify against the live docs."

(During the build of this skill, each reference is grounded by web-fetching the
current Yandex docs so the bundled snippets and URLs are correct as authored.)

## Structure (progressive disclosure — lean SKILL.md, details in references)

```
yandex-games-skill/
├── SKILL.md                          # name/description frontmatter; when-to-use;
│                                     # Step 0 (fetch live rules); universal workflow;
│                                     # router to references
├── references/
│   ├── rules-and-requirements.md     # ★ authoritative URLs + what to verify; how to
│   │                                 #   fetch live; moderation & common rejection reasons
│   ├── yandex-sdk.md                 # ★ SDK core: init/ready (LoadingAPI), auth, cloud
│   │                                 #   saves, leaderboards, ads (interstitial/rewarded/
│   │                                 #   sticky), purchases, reviews, locale/lang, gameplay API
│   ├── browser-html5.md              # vanilla JS, Phaser, PixiJS, Construct 3: load SDK,
│   │                                 #   project layout, ZIP packaging, gotchas
│   ├── godot.md                      # Godot 4 Web export, JavaScriptBridge ↔ ysdk, custom
│   │                                 #   HTML shell, gotchas (audio, SharedArrayBuffer, focus)
│   ├── unity.md                      # Unity WebGL, .jslib plugin ↔ ysdk, compression/hosting,
│   │                                 #   memory, gotchas
│   └── publishing.md                 # developer console, ZIP requirements, submit/moderation
│                                     #   pipeline, localization (ru/en/tr), monetization policy
├── assets/
│   └── ya-sdk.js                     # copy-paste SDK wrapper (init, ads, save/load, leaderboard)
│                                     #   for any HTML5 game
└── README.md                         # how to plug into Claude Code / Cursor / any AI
```

## What each unit does

- **SKILL.md** — the entry point. Frontmatter (`name`, `description`) for
  auto-activation. Contains: when to use, the **Step 0 fetch-live-rules**
  directive with URLs, the universal pipeline (decide engine → build HTML5 →
  integrate SDK → test as draft → ZIP → upload → pass moderation), and a table
  routing to the right reference file. Kept lean.
- **rules-and-requirements.md** — the live-rules hub: official URLs (ru + en),
  what to check (tech requirements, moderation, content & monetization policy),
  and a checklist of common rejection reasons to pre-empt.
- **yandex-sdk.md** — the highest-value reference: working snippets for SDK init
  and the `ready` call, player auth, cloud save (`player.setData/getData`),
  leaderboards, ads (fullscreen interstitial, rewarded video, sticky banner),
  in-game purchases, reviews, environment (locale/lang/deviceType), gameplay
  events. Engine-agnostic JS.
- **browser-html5.md / godot.md / unity.md** — how each engine loads the SDK and
  calls `ysdk`, project/export setup, packaging, and engine-specific gotchas.
- **publishing.md** — console workflow, ZIP rules, moderation pipeline,
  localization, monetization policy.
- **assets/ya-sdk.js** — a small, dependency-free wrapper the AI can drop into
  any HTML5 build (init + ads + save/load + leaderboard), so integration is one
  step.
- **README.md** — install/use instructions for Claude Code, Cursor, and "any
  chat" (attach the file).

## Quality / accuracy

Each reference is written against **live Yandex docs fetched during the build**
(web search + fetch of `yandex.ru/dev/games` and engine export docs). Snippets
are kept minimal and standard. The skill never claims its bundled rules are
authoritative — it always points to the live docs.

## Testing

This is a documentation skill, so "testing" = review checks, not a test runner:
- **Link/URL check:** every official URL referenced resolves (fetch returns 200 /
  real content).
- **Snippet sanity:** the real asset `assets/ya-sdk.js` parses (`node --check`);
  Markdown code snippets are kept minimal and reviewed by eye.
- **Skill-format check:** `SKILL.md` has valid frontmatter (`name`,
  `description`) and stays lean; references are linked from it (no orphans).
- **Self-review against the spec** before finishing.

## Out of scope (v1)

Turn-key game generation; full starter-project templates per engine (possible
v2); non-Yandex platforms (CrazyGames, Poki, etc.).

# yandex-games-dev Skill — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A portable Agent Skill (`SKILL.md` + reference files) that makes any AI an expert at building and shipping Yandex Games — centered on the Yandex Games SDK and per-engine integration (browser/HTML5, Godot, Unity), with a hard rule to fetch Yandex's live rules first.

**Architecture:** Plain Markdown skill with progressive disclosure: a lean `SKILL.md` router + topic/engine references under `references/`, plus a copy-paste `assets/ya-sdk.js` wrapper. Every research-derived reference is authored by first **web-fetching the current official Yandex docs**, so content is accurate and the skill itself instructs the AI to re-verify live.

**Tech Stack:** Markdown; one small vanilla-JS asset; `node --check` for the asset; `WebSearch`/`WebFetch` for grounding. No build, no runtime.

**Conventions:** project root `~/Desktop/yandex-games-skill` (git-init'd, author = ayubjon). English. Commit messages in English, **no AI/co-author trailers**.

**Authoring pattern for reference files (important):** because Yandex changes its
rules and SDK, each reference task **starts by fetching the live docs** (queries +
URLs given per task), then authors the file to the specified section outline using
the fetched facts. The outlines below are exact; the prose is written from what the
fetch returns. Every reference ends with a one-line "verify against live docs" note.

**Authoritative entry points (start here, navigate to specifics):**
- Docs hub (RU): `https://yandex.ru/dev/games/doc/dg/`
- Docs hub (EN): `https://yandex.com/dev/games/doc/en/`
- (Find within: SDK reference, Requirements, Review/Moderation, Monetization, Console.)

**File map:**
- `SKILL.md` — entry/router (frontmatter + Step 0 + workflow)
- `references/rules-and-requirements.md`, `references/yandex-sdk.md`,
  `references/browser-html5.md`, `references/godot.md`, `references/unity.md`,
  `references/publishing.md`
- `assets/ya-sdk.js` — SDK wrapper
- `README.md`, `LICENSE`, `.gitignore`

---

### Task 1: Scaffold

**Files:** Create `.gitignore`, `LICENSE`, and the directory structure.

- [ ] **Step 1: Create directories and `.gitignore`**

Run:
```bash
mkdir -p references assets
printf '.DS_Store\n*.log\n' > .gitignore
```

- [ ] **Step 2: Create `LICENSE` (MIT)**

```
MIT License

Copyright (c) 2026 Ayubjon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore LICENSE
git commit -m "chore: scaffold skill repo"
```

---

### Task 2: references/rules-and-requirements.md (fetch live, then author)

**Files:** Create `references/rules-and-requirements.md`

- [ ] **Step 1: Fetch the current rules**

Use `WebSearch` ("Yandex Games requirements moderation rules", "Яндекс Игры требования модерация") and `WebFetch` the official pages under `yandex.ru/dev/games/doc` covering: technical requirements, how to upload/publish, the review/moderation process, content policy, monetization policy. Record the exact URLs that resolve.

- [ ] **Step 2: Author the file to this outline**

Sections (write from fetched facts; keep it a *pointer to live docs*, not a frozen copy):
1. **Read this first** — the rules are live; always open the official pages (list the verified URLs, RU + EN) before building.
2. **Technical requirements** — ZIP packaging, entry `index.html`, size limits, HTTPS-only, allowed domains, the mandatory `LoadingAPI.ready()` call, fullscreen behavior.
3. **Moderation pipeline** — draft → testing → review → release; typical timing.
4. **Common rejection reasons** — a checklist (e.g., missing `ready()`, ad spam, broken locales, external links, console errors, copyrighted assets) — each as "verify on live page X".
5. **Content & monetization policy** — what's prohibited; ad frequency limits.
End with: "⚠️ These notes summarize the docs as of authoring — always re-check the live URLs above; Yandex changes them."

- [ ] **Step 3: Verify URLs resolve**

`WebFetch` each URL you cited → confirm it returns real content (not 404).

- [ ] **Step 4: Commit**

```bash
git add references/rules-and-requirements.md
git commit -m "docs: live-rules reference (fetch-first principle)"
```

---

### Task 3: references/yandex-sdk.md (fetch live, then author)

**Files:** Create `references/yandex-sdk.md`

- [ ] **Step 1: Fetch the SDK reference**

`WebSearch`/`WebFetch` the official Yandex Games **SDK** docs. Capture current API for: SDK load script tag + `YaGames.init()`; `features.LoadingAPI.ready()`; `getPlayer()` + `setData`/`getData` (cloud saves); `getLeaderboards()` + `setLeaderboardScore`/`getLeaderboardEntries`; `adv.showFullscreenAdv` + `adv.showRewardedVideo` + sticky banner; `getPayments()` (purchases); `environment.i18n.lang` / `deviceInfo`; `feedback`/review; gameplay events (`GameplayAPI`). Record exact URLs.

- [ ] **Step 2: Author the file to this outline**

For each feature: a one-line "what/when" + a minimal working JS snippet + the doc URL. Cover, in order: Init & `ready`, Player auth & cloud saves, Leaderboards, Ads (interstitial / rewarded / sticky + policy note), Purchases, Environment/locale, Gameplay events, Reviews. End with the "verify against live docs" note. Keep snippets minimal and standard; if the fetched API differs from common knowledge, follow the fetched docs.

- [ ] **Step 3: Verify URLs resolve** (`WebFetch` each cited URL).

- [ ] **Step 4: Commit**

```bash
git add references/yandex-sdk.md
git commit -m "docs: Yandex Games SDK reference"
```

---

### Task 4: assets/ya-sdk.js (wrapper)

**Files:** Create `assets/ya-sdk.js`

- [ ] **Step 1: Write the wrapper (reconcile with Task 3's verified API)**

```js
/**
 * ya-sdk.js — a tiny wrapper around the Yandex Games SDK for HTML5 games.
 * Usage: add <script src="https://yandex.ru/games/sdk/v2"></script> to your
 * page, then `await YaSDK.init()`. Verify method names against the current
 * SDK docs (see references/yandex-sdk.md) — Yandex may change them.
 */
const YaSDK = (() => {
  let ysdk = null;
  let player = null;

  async function init() {
    // The SDK script defines the global YaGames.
    ysdk = await window.YaGames.init();
    return ysdk;
  }

  // Call when your first frame is ready, to hide the Yandex loader.
  function ready() {
    ysdk && ysdk.features && ysdk.features.LoadingAPI &&
      ysdk.features.LoadingAPI.ready();
  }

  // Fullscreen (interstitial) ad — between levels, not too often.
  function showFullscreenAd(callbacks = {}) {
    ysdk && ysdk.adv && ysdk.adv.showFullscreenAdv({ callbacks });
  }

  // Rewarded video — grant the reward inside onRewarded.
  function showRewardedAd(onRewarded) {
    ysdk && ysdk.adv && ysdk.adv.showRewardedVideo({ callbacks: { onRewarded } });
  }

  async function getPlayer() {
    if (!player) player = await ysdk.getPlayer();
    return player;
  }

  // Cloud save (per player). data is a plain object.
  async function save(data) {
    const p = await getPlayer();
    return p.setData(data);
  }
  async function load() {
    const p = await getPlayer();
    return p.getData();
  }

  // Leaderboards
  async function setScore(name, score) {
    const lb = await ysdk.getLeaderboards();
    return lb.setLeaderboardScore(name, score);
  }
  async function getTop(name, limit = 10) {
    const lb = await ysdk.getLeaderboards();
    return lb.getLeaderboardEntries(name, { quantityTop: limit, includeUser: true });
  }

  function lang() {
    return (ysdk && ysdk.environment && ysdk.environment.i18n &&
      ysdk.environment.i18n.lang) || 'ru';
  }

  return {
    init, ready, showFullscreenAd, showRewardedAd,
    save, load, setScore, getTop, lang,
    get raw() { return ysdk; },
  };
})();

if (typeof module !== 'undefined') module.exports = YaSDK;
if (typeof window !== 'undefined') window.YaSDK = YaSDK;
```

- [ ] **Step 2: Syntax-check**

Run: `node --check assets/ya-sdk.js`
Expected: no output, exit 0.

- [ ] **Step 3: Commit**

```bash
git add assets/ya-sdk.js
git commit -m "feat: copy-paste Yandex SDK wrapper for HTML5 games"
```

---

### Task 5: references/browser-html5.md (fetch live, then author)

**Files:** Create `references/browser-html5.md`

- [ ] **Step 1: Fetch** — confirm the SDK `<script>` loader URL and HTML5 packaging from the Yandex docs; note Phaser/PixiJS/Construct 3 specifics from their export/HTML docs (`WebSearch`).

- [ ] **Step 2: Author to outline:**
1. Minimal `index.html` that loads the SDK and `ya-sdk.js`, calls `YaSDK.init()` then `YaSDK.ready()`.
2. Project layout + ZIP packaging (root `index.html`, relative paths).
3. Phaser / PixiJS — where to init the SDK in the lifecycle; pause/resume on ads.
4. Construct 3 — exporting + calling the SDK (or the Yandex plugin if present).
5. Gotchas: HTTPS, relative paths, no reliance on `localStorage` (use cloud saves), pausing audio/loop during ads, focus loss.
End with the verify note.

- [ ] **Step 3: Commit**

```bash
git add references/browser-html5.md
git commit -m "docs: browser/HTML5 (JS, Phaser, PixiJS, Construct) reference"
```

---

### Task 6: references/godot.md (fetch live, then author)

**Files:** Create `references/godot.md`

- [ ] **Step 1: Fetch** — Godot 4 **Web export** docs (`docs.godotengine.org`) and `JavaScriptBridge`; search for a current community "Godot Yandex Games SDK" plugin and note its repo if reputable.

- [ ] **Step 2: Author to outline:**
1. Export setup: Web preset, custom HTML shell that includes the SDK `<script>`.
2. Calling `ysdk` from GDScript via `JavaScriptBridge.eval` / `create_callback` — a minimal example (init, `ready`, rewarded ad, save/load).
3. Optional: named community plugin (with caveat to verify it's maintained).
4. Gotchas: audio autoplay/focus, `SharedArrayBuffer`/threads vs Yandex hosting, calling `LoadingAPI.ready()` after load.
End with the verify note.

- [ ] **Step 3: Commit**

```bash
git add references/godot.md
git commit -m "docs: Godot 4 web export + Yandex SDK reference"
```

---

### Task 7: references/unity.md (fetch live, then author)

**Files:** Create `references/unity.md`

- [ ] **Step 1: Fetch** — Unity **WebGL** build docs and the `.jslib` plugin pattern; search for a current Unity Yandex Games plugin (e.g., "PluginYG"/"Yandex Games for Unity") and note its repo if reputable.

- [ ] **Step 2: Author to outline:**
1. WebGL build settings + a WebGL template that loads the SDK `<script>`.
2. `.jslib` plugin pattern to call `ysdk` from C# (a minimal init + rewarded-ad + save/load example), and `SendMessage` back to Unity.
3. Optional: named community plugin (caveat: verify maintained).
4. Gotchas: WebGL memory/compression (Brotli/Gzip + Yandex hosting), mobile, ads inside coroutines, focus loss, calling `ready()`.
End with the verify note.

- [ ] **Step 3: Commit**

```bash
git add references/unity.md
git commit -m "docs: Unity WebGL + Yandex SDK reference"
```

---

### Task 8: references/publishing.md (fetch live, then author)

**Files:** Create `references/publishing.md`

- [ ] **Step 1: Fetch** — the Yandex Games **developer console**, upload/draft flow, and localization guidance.

- [ ] **Step 2: Author to outline:**
1. Developer console: creating a draft, uploading the ZIP, the testing URL.
2. ZIP requirements recap (cross-link `rules-and-requirements.md`, don't duplicate).
3. Localization: supported locales (ru/en/tr/…), how the SDK reports locale, providing localized text.
4. Monetization setup: enabling ads/purchases, policy pointers.
5. Pre-submission checklist (cross-link the rejection-reasons list).
End with the verify note.

- [ ] **Step 3: Commit**

```bash
git add references/publishing.md
git commit -m "docs: publishing, console and localization reference"
```

---

### Task 9: SKILL.md and README.md

**Files:** Create `SKILL.md`, `README.md`

- [ ] **Step 1: Create `SKILL.md`**

```markdown
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
See `references/rules-and-requirements.md` for what to check and the deep links.

## When to use this skill

Building, integrating the SDK for, or publishing a game on Yandex Games — in a
browser/HTML5 engine, Godot, or Unity.

## Universal workflow

1. **Fetch current rules** (Step 0).
2. **Pick the engine** → open the matching reference below.
3. **Build the game as HTML5** (browser) or export to Web/WebGL (Godot/Unity).
4. **Integrate the Yandex SDK** — at minimum init + `LoadingAPI.ready()`; then
   saves/leaderboards/ads as needed. Use `assets/ya-sdk.js` for HTML5.
5. **Test as a draft** in the developer console.
6. **Package the ZIP** to spec and **upload**.
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
```

- [ ] **Step 2: Create `README.md`**

```markdown
# yandex-games-dev — an AI skill for building Yandex Games

A portable skill that turns any AI assistant into an expert at building and
publishing games for **Yandex Games (Я.Игры)**: Yandex Games SDK integration
(ads, leaderboards, cloud saves, purchases) for **browser/HTML5, Godot, and
Unity**, plus the publishing/moderation rules.

Its first rule: **always fetch Yandex's current rules and SDK docs before
building**, because they change — the skill points the AI at the live docs.

## Use it with any AI

- **Claude Code:** copy this folder to `~/.claude/skills/yandex-games-dev/`.
  It auto-activates from its `SKILL.md` description.
- **Cursor / other rule-based tools:** point a rule at `SKILL.md` (and the
  relevant `references/*.md`).
- **Any chat (ChatGPT, Gemini, etc.):** attach or paste the relevant file —
  `SKILL.md` for the workflow, a `references/*.md` for depth.

## What's inside

- `SKILL.md` — the workflow and a router to the references.
- `references/` — live-rules hub, SDK reference, per-engine guides, publishing.
- `assets/ya-sdk.js` — a copy-paste Yandex SDK wrapper for HTML5 games.

## License

MIT
```

- [ ] **Step 3: Commit**

```bash
git add SKILL.md README.md
git commit -m "docs: SKILL.md entry/router and README"
```

---

### Task 10: Verification and self-review

**Files:** none new (fixes go to the relevant files).

- [ ] **Step 1: Asset syntax**

Run: `node --check assets/ya-sdk.js`
Expected: exit 0.

- [ ] **Step 2: No orphan references**

Run:
```bash
for f in references/*.md assets/ya-sdk.js; do grep -q "$(basename "$f")" SKILL.md && echo "linked: $f" || echo "ORPHAN: $f"; done
```
Expected: every file printed as `linked:`.

- [ ] **Step 3: Frontmatter present**

Run: `head -5 SKILL.md | grep -q "^name:" && grep -q "^description:" SKILL.md && echo "frontmatter OK"`
Expected: `frontmatter OK`

- [ ] **Step 4: Live-URL spot check**

`WebFetch` the two docs-hub URLs in `SKILL.md` → confirm they resolve to real Yandex docs (not 404). If a URL moved, update it.

- [ ] **Step 5: Self-review** — read each reference against the spec; confirm each ends with the "verify against live docs" note and that the rules-first principle is prominent in `SKILL.md`. Fix inline.

- [ ] **Step 6: Commit any fixes**

```bash
git add -A
git commit -m "fix: review adjustments"
```

---

## Self-Review (done while writing the plan)

- **Spec coverage:** rules-first principle (Task 2 + SKILL.md Step 0, Task 9); SDK core (Task 3); browser/Godot/Unity (Tasks 5–7); publishing/moderation/localization (Tasks 2, 8); copy-paste wrapper (Task 4); SKILL.md router + README portability (Task 9); accuracy-via-live-fetch (every reference task Step 1 + Task 10 Step 4); testing = link/format/syntax checks (Task 10). No gaps.
- **Placeholder scan:** the reference bodies are authored from fetched docs against exact outlines (the fetch-then-author pattern is stated up front) — not vague placeholders; deterministic files (`ya-sdk.js`, `SKILL.md`, `README`, `LICENSE`) are given in full.
- **Consistency:** file names/paths, the `YaSDK` wrapper API (`init`/`ready`/`showFullscreenAd`/`showRewardedAd`/`save`/`load`/`setScore`/`getTop`/`lang`), and the references table in `SKILL.md` all match across tasks.

# Yandex Games — rules & requirements (read the LIVE pages first)

> ⚠️ **Yandex changes these rules.** This file is a *starting checklist*, not the
> source of truth. Open the official pages below and read the current rules
> **before building** and **before every submission**.

## Authoritative pages — open these
- Requirements: https://yandex.com/dev/games/doc/en/concepts/requirements
- Moderation: https://yandex.com/dev/games/doc/en/concepts/moderation
- Quick start: https://yandex.com/dev/games/doc/en/concepts/quick-start
- Upload a game: https://yandex.com/dev/games/doc/en/console/add-new-game
- Testing a draft: https://yandex.com/dev/games/doc/en/console/test-game
- Docs hub — RU: https://yandex.ru/dev/games/doc/dg/ · EN: https://yandex.com/dev/games/doc/en/

## Technical requirements (verify on the live page)
- The **Yandex Games SDK must be integrated**.
- You **must call `LoadingAPI.ready()`** when the player can start playing (this hides
  the platform loader). Forgetting it is a frequent rejection.
- The game must **pause audio when the page is minimized / loses focus**, and be pausable.
- The UI must **render correctly on resize** — nothing cut off by screen bounds.
- Package: a **ZIP with `index.html` in the archive root**; use **relative paths**;
  HTTPS only; uncompressed size limit around **100 MB** (verify the current number).
- All transactions go **through the SDK only**.

## Prohibited / restricted content (this list changes — verify)
- No gambling, real-money operations or withdrawal, online store, or lottery.
- No realistic violence against children/animals; per current docs also no political,
  religious, or "magical" content, no interactive-AI, no YouTube video integration,
  no third-party ads.
- You must **own the copyright** to every asset; no clones of existing games.
- Provide a developer/publisher **contact email**.

## Moderation pipeline
- **Full moderation** (~3–5 business days): first publish and any build change — the
  moderator tests the build and reviews promo materials.
- **Content moderation** (~1–2 days): when only promo materials change.
- Statuses: **Draft → (Verified | Published | Rejected)**.
- Resubmission is unlimited, but the **wait doubles after each rejection** (24 h → ~16 days).
- A published game must keep a **rating above 30** or it can be unpublished after ~3 weeks.

## Common rejection reasons — pre-empt these
- `LoadingAPI.ready()` never called / loader never hides.
- **Interface not translated into all declared languages.**
- **Incorrect ad setup** (ads on every action, ads blocking gameplay, too frequent).
- Crashes, hangs, or console errors.
- **Name mismatch** between the game and its promo materials.
- **Age rating** doesn't match the actual content.
- UI elements **cropped** by screen bounds.
- **Duplicate** of a game already in the catalog.
- Promo screenshots not showing real gameplay (need ~70% gameplay).

> Re-check every item against the live pages above before submitting — Yandex updates them.

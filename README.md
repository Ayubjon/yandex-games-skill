# yandex-games-dev — an AI skill for building Yandex Games

A portable skill that turns any AI assistant into an expert at building and
publishing games for **Yandex Games (Я.Игры)**: Yandex Games SDK integration
(ads, leaderboards, cloud saves, purchases) for **browser/HTML5, Godot, and
Unity**, plus the publishing and moderation rules.

Its first rule: **always fetch Yandex's current rules and SDK docs before
building** — they change, so the skill points the AI at the live docs instead of
trusting frozen copies.

## Use it with any AI

- **Claude Code:** copy this folder to `~/.claude/skills/yandex-games-dev/`.
  It auto-activates from the `SKILL.md` description.
- **Cursor / other rule-based tools:** point a rule at `SKILL.md` (and the
  relevant `references/*.md`).
- **Any chat (ChatGPT, Gemini, …):** attach or paste the relevant file —
  `SKILL.md` for the workflow, a `references/*.md` for depth.

## What's inside

- `SKILL.md` — the workflow and a router to the references.
- `references/` — live-rules hub, SDK reference, per-engine guides, publishing.
- `assets/ya-sdk.js` — a copy-paste Yandex SDK wrapper for HTML5 games.

## License

MIT

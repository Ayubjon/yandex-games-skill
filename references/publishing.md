# Clean build, draft and publishing

## Local release gate

1. Run the project's build/typecheck and relevant behavior tests. Produce diagnostic and release outputs separately; do not manually remove a script from a ZIP while leaving its file or bundled code behind.
2. Run the [checker workflow](debug-checker.md) on the diagnostic build and preserve its report. Complete [manual verification](manual-verification.md), tracking untested scenarios.
3. Build the clean output from the same source revision with checker/mock/test panels excluded. Test startup and the core loop again: instrumentation can change behavior.
4. From this skill directory run:

```sh
python3 scripts/check_release.py /absolute/path/to/game.zip
# Or inspect the directory before creating the ZIP:
python3 scripts/check_release.py /absolute/path/to/dist
```

The script reads only, emits JSON, and exits 1 for findings or 2 for invalid input. It checks root index, declared total uncompressed size (default conservative 100,000,000 bytes; recheck platform units/current cap), unsafe/duplicate filenames, spaces/Cyrillic, ZIP CRC/encryption/symlinks, and recognizable checker/mock/development artifacts. It never extracts archives. `--max-bytes` allows an explicitly verified cap. It does not verify every asset reference, MIME/compression setup, SDK behavior, arbitrary renamed debug code or all content. A success is an artifact preflight, not a moderation verdict.

ZIP **the contents** of the output, not the parent directory. Keep `index.html` at root, preserve case-sensitive paths and use relative game resources. Serve the exact release from a nested path to catch root-absolute asset mistakes; the platform `/sdk.js` path is the exception. Inspect Network for missing files.

## Draft proof

Open the developer console for the user's game; record draft build/version, declared languages, platforms, orientations, save support and product/leaderboard configuration. Upload or change live console state only within the user's authorized scope. Use “Open with debug panel” or the documented `debug-mode=16` path and the official SDK mocks for testing languages/ads as applicable.

Manually dismiss the platform loader during cold startup and verify input is still gated until real readiness. Confirm the official init/language/ready indicators and actual gameplay agree. Don't confuse the bundled unofficial checker panel with the official platform debug panel.

## Listing and submission

Check title consistency per locale, description, controls, genre, age rating, ownership, icons/covers/screenshots and current draft field specifications. Promo must represent the submitted build. Review current content/monetization restrictions directly, including any exceptions; frozen checklist wording is not enough. Don't copy historical timing estimates or retry schedules into promises to the user.

Before an authorized submission give the user the concrete build, evidence and unresolved limitations. Do not call a local-only mock run “tested on Yandex.” After a rejection reproduce the exact clause/scenario, fix the underlying behavior, rerun related regression/manual flows and prepare an updated build. Submit/publish only when asked or already authorized.

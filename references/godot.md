# Godot 4 — Web export + Yandex Games SDK

> Godot talks to the Yandex SDK via the **JavaScriptBridge** singleton (Web export only).
> Verify SDK methods against `references/yandex-sdk.md`.
> Docs: Godot Web export & JavaScriptBridge — https://docs.godotengine.org/en/stable/tutorials/platform/web/javascript_bridge.html

## Export setup
- Export preset: **Web**. Add the SDK script to the **HTML shell** (export → Head Include, or a custom HTML page): `<script src="/sdk.js"></script>`.
- Godot 4 threads need `SharedArrayBuffer` (COOP/COEP headers). Yandex hosting may not send them — if the build won't load, **disable Threads** in the Web export options.

## Call the SDK from GDScript
```gdscript
func _ready():
    if OS.has_feature("web"):
        # init + the mandatory ready() call
        JavaScriptBridge.eval(
            "YaGames.init().then(s => { window.ysdk = s; s.features.LoadingAPI.ready(); });",
            true)

# Let JS call back into Godot (e.g. grant a reward):
var _rewarded_cb := JavaScriptBridge.create_callback(_on_rewarded)
func show_rewarded():
    var win = JavaScriptBridge.get_interface("window")
    win.ysdk.adv.showRewardedVideo({ "callbacks": { "onRewarded": _rewarded_cb } })
func _on_rewarded(_args):
    add_coins(100)
```
`JavaScriptBridge.eval()` runs JS; `create_callback()` lets JS invoke GDScript.

## Easier: community plugin
- **BasilYes/godot-yandex-games-sdk** (Godot 4.3+, also in the Asset Library) — a `YandexSDK` singleton with ads/rewarded/player saves. Install it and add the **`yandex`** feature to the Web export. *Unofficial — verify it's maintained and matches the current SDK.*

## Gotchas
- Call `LoadingAPI.ready()` after the game is loaded (not during loading).
- Audio autoplay needs a user gesture; pause audio on tab blur.
- Persist progress via the SDK (`player.setData`), not Godot's `user://` (not stored on the platform).

> Re-verify SDK calls and plugin status on the live docs/repo.

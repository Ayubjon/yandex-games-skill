# Existing Godot Web projects

Use only when the project already uses Godot. Inspect version, export preset, HTML shell, SDK plugin and JavaScriptBridge. Consult the installed version's Web export documentation; thread/SharedArrayBuffer/COOP/COEP support depends on target hosting. Do not prescribe a version or disable threading blindly.

## Startup and bridge

Load `/sdk.js` before game startup in the Web HTML shell. Initialize the SDK once, read language and pass init completion/error to GDScript. Restore saves/load critical scenes and translations, render a usable screen, then call a separate `LoadingAPI.ready()` bridge operation. `_ready()` or SDK resolution alone is not proof that the game is playable. Gate input until this sequence completes.

Keep JavaScriptBridge callback references alive as long as JavaScript can call them. Pass SDK config through real JS objects or a small JS bridge; don't assume arbitrary GDScript dictionaries become callback-bearing JS configuration correctly. Guard Web-only calls with the appropriate platform check.

Route ad open/reward/close/error individually; reward once on reward, and propagate failures. Coordinate SceneTree pause, input, timers and AudioServer/buses using independent pause reasons. Keep necessary bridge/overlay nodes processing while paused, and don't let ad close undo menu or hidden-tab pauses.

Persistence depends on the export and platform, not a blanket prohibition of `user://`. Demonstrate persistence across reload for a simple non-IAP game; use cloud saves for IAP and intended cross-device continuity. Keep schema/version/error handling at the bridge boundary.

## Verification

Add the checker between SDK and engine boot in a diagnostic shell. WASM logic is opaque; JavaScriptBridge.eval signatures can be legitimate despite the checker's eval heuristic. Verify actual runtime and manual flows instead of rewriting functioning engine code for regex compliance. Test Web audio activation, fullscreen/orientation, mobile memory/input, language and save restoration in the real draft. Remove checker and mocks from the release. See [manual verification](manual-verification.md).

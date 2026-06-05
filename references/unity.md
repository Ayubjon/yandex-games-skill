# Unity — WebGL build + Yandex Games SDK

> Unity calls the SDK via a `.jslib` plugin (`DllImport("__Internal")`).
> Verify SDK methods against `references/yandex-sdk.md`.

## Build setup
- Platform: **WebGL**. Use a **WebGL template** whose `index.html` includes `<script src="/sdk.js"></script>`.
- Compression: Brotli or Gzip (Yandex hosting serves them) — set in Player Settings → Publishing Settings.
- Watch WebGL **memory** on mobile; always test on phones.

## `.jslib` bridge (manual)
`Assets/Plugins/YaSDK.jslib`:
```javascript
mergeInto(LibraryManager.library, {
  YaInit: function () {
    YaGames.init().then(function (s) {
      window.ysdk = s;
      s.features.LoadingAPI.ready();   // REQUIRED
    });
  },
  YaRewarded: function () {
    window.ysdk.adv.showRewardedVideo({ callbacks: { onRewarded: function () {
      SendMessage('YandexBridge', 'OnRewarded');   // call back into Unity
    } } });
  }
});
```
C#:
```csharp
using System.Runtime.InteropServices;
using UnityEngine;

public class YandexBridge : MonoBehaviour {
  [DllImport("__Internal")] static extern void YaInit();
  [DllImport("__Internal")] static extern void YaRewarded();

  void Start() {
    if (Application.platform == RuntimePlatform.WebGLPlayer) YaInit();
  }
  public void OnRewarded() { /* grant the reward */ }
}
```

## Easier: community plugins
- **PluginYG** (JustPlay-Max/unity-PluginYG-2; also on the Asset Store) — automated, no index editing, covers the SDK functions; Unity 2021.3.18+ / 2022.3+ / 2023.2+.
- **playables-studio/YandexGamesSDK-Unity** (OpenUPM `com.playables-studio.yandexgames-sdk`).

*Both unofficial — verify they're maintained and match the current SDK.*

## Gotchas
- Call ads from the main thread; resume gameplay/audio after `onClose`.
- Pause `AudioListener` / time scale on tab blur and during ads.
- Persist progress via the SDK (`player.setData`); call `LoadingAPI.ready()` once loaded.

> Re-verify SDK calls and plugin status on the live docs/repos.

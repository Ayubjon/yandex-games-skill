/**
 * ya-sdk.js — a tiny wrapper around the Yandex Games SDK for HTML5 games.
 *
 * 1. Add the SDK script to your page (relative path works on Yandex hosting):
 *      <script src="/sdk.js"></script>
 *    (custom domain: https://sdk.games.s3.yandex.net/sdk.js)
 * 2. await YaSDK.init(); then call YaSDK.ready() once your game is playable.
 *
 * Verify method names against the current SDK docs (references/yandex-sdk.md) —
 * Yandex changes the API.
 */
const YaSDK = (() => {
  let ysdk = null;
  let player = null;

  async function init() {
    ysdk = await window.YaGames.init(); // the /sdk.js script defines window.YaGames
    return ysdk;
  }

  // REQUIRED: call once the game has loaded and the player can interact.
  function ready() {
    if (ysdk && ysdk.features && ysdk.features.LoadingAPI) {
      ysdk.features.LoadingAPI.ready();
    }
  }

  // Interstitial ad — call between levels, not on every action.
  function showFullscreenAd(callbacks = {}) {
    if (ysdk && ysdk.adv) ysdk.adv.showFullscreenAdv({ callbacks });
  }

  // Rewarded video — grant the reward inside onRewarded.
  function showRewardedAd(onRewarded) {
    if (ysdk && ysdk.adv) ysdk.adv.showRewardedVideo({ callbacks: { onRewarded } });
  }

  async function getPlayer() {
    if (!player) player = await ysdk.getPlayer();
    return player;
  }

  // Cloud save (per player). `data` is a plain object (<= 200 KB).
  async function save(data) {
    const p = await getPlayer();
    return p.setData(data);
  }
  async function load(keys) {
    const p = await getPlayer();
    return p.getData(keys);
  }

  // Leaderboards (ysdk.leaderboards.*; getLeaderboards() is deprecated).
  async function setScore(name, score) {
    return ysdk.leaderboards.setScore(name, score);
  }
  async function getTop(name, limit = 10) {
    return ysdk.leaderboards.getEntries(name, { quantityTop: limit, includeUser: true });
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

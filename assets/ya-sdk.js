/**
 * Thin Yandex Games SDK adapter. Load after /sdk.js, before game.js.
 * The game owns input/render readiness, audio/pause, persistence and ad placement.
 * See references/yandex-sdk.md. Never replace a failed real SDK with a mock here.
 */
const YaSDK = (() => {
  let ysdk = null;
  let initPromise = null;
  let playerPromise = null;
  let readySent = false;

  function requireSDK() {
    if (!ysdk) throw new Error('Await YaSDK.init() before using the SDK');
    return ysdk;
  }

  function init(options) {
    if (!initPromise) {
      // The promise also catches a missing loader or a synchronous SDK throw.
      initPromise = Promise.resolve().then(() => window.YaGames.init(options))
        .then(sdk => { ysdk = sdk; return sdk; })
        .catch(error => { initPromise = null; throw error; });
    }
    return initPromise;
  }

  // Call only when critical assets/state and the usable screen are ready.
  function ready() {
    const sdk = requireSDK();
    if (readySent) return;
    sdk.features.LoadingAPI.ready();
    readySent = true;
  }

  // Supply onOpen/onClose/onError from the game's pause/input/audio controller.
  // Synchronous errors propagate to the caller; this adapter does not auto-resume.
  function showFullscreenAd(callbacks = {}) {
    return requireSDK().adv.showFullscreenAdv({ callbacks });
  }

  function showRewardedAd(onRewarded, callbacks = {}) {
    if (typeof onRewarded !== 'function') throw new TypeError('A reward handler is required');
    let granted = false;
    return requireSDK().adv.showRewardedVideo({ callbacks: {
      ...callbacks,
      onRewarded: (...args) => {
        if (granted) return;
        granted = true;
        onRewarded(...args);
      }
    } });
  }

  function getPlayer() {
    const sdk = requireSDK();
    if (!playerPromise) {
      playerPromise = Promise.resolve().then(() => sdk.getPlayer())
        .catch(error => { playerPromise = null; throw error; });
    }
    return playerPromise;
  }

  // Call after an account/authentication change before requesting player data.
  function invalidatePlayer() { playerPromise = null; }
  async function save(data) { return (await getPlayer()).setData(data); }
  async function load(keys) { return (await getPlayer()).getData(keys); }
  async function setScore(name, score) {
    const sdk = requireSDK();
    if (!await sdk.isAvailableMethod('leaderboards.setScore')) {
      throw new Error('leaderboards.setScore is unavailable for this player');
    }
    return sdk.leaderboards.setScore(name, score);
  }
  async function getTop(name, limit = 10) {
    return requireSDK().leaderboards.getEntries(name, { quantityTop: limit, includeUser: true });
  }
  // Raw SDK locale. Apply the game's supported-locale/fallback resolver separately.
  function lang() { return requireSDK().environment.i18n.lang; }

  return {
    init, ready, showFullscreenAd, showRewardedAd, getPlayer, invalidatePlayer,
    save, load, setScore, getTop, lang,
    get raw() { return ysdk; }
  };
})();
if (typeof module !== 'undefined') module.exports = YaSDK;
if (typeof window !== 'undefined') window.YaSDK = YaSDK;

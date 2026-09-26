const assert = require('node:assert/strict');
const path = require('node:path');
const wrapper = path.resolve(__dirname, '../assets/ya-sdk.js');
function fresh(init) {
  delete require.cache[wrapper];
  global.window = { YaGames: { init } };
  return require(wrapper);
}
(async () => {
  let initCount=0, playerCount=0, readyCount=0, reads=0, adv;
  const data={level:5};
  const player={setData:async d=>{Object.assign(data,d);},getData:async()=>data};
  const sdk={features:{LoadingAPI:{ready(){readyCount++;}}},
    environment:{i18n:{get lang(){reads++;return 'en';}}},
    getPlayer:async()=>{playerCount++;return player;},
    adv:{showFullscreenAdv:cfg=>{adv=cfg;},showRewardedVideo:cfg=>{adv=cfg;}},
    isAvailableMethod:async()=>false,
    leaderboards:{setScore(){throw Error('must not write');},getEntries:async(name,opts)=>({name,opts})}};
  const api=fresh(async()=>{initCount++;return sdk;});
  assert.throws(()=>api.ready(), /Await/);
  assert.throws(()=>api.lang(), /Await/);
  assert.throws(()=>api.showFullscreenAd(), /Await/);
  await Promise.all([api.init(),api.init()]);
  assert.equal(initCount,1);
  api.ready();api.ready();assert.equal(readyCount,1);
  assert.equal(api.lang(),'en');assert.equal(reads,1);
  await Promise.all([api.load(),api.load()]);assert.equal(playerCount,1);
  await api.save({level:6});assert.equal((await api.load()).level,6);
  api.invalidatePlayer();await api.load();assert.equal(playerCount,2);
  let rewards=0, opens=0, closes=0, errors=0;
  api.showRewardedAd(()=>rewards++, {onOpen:()=>opens++,onClose:()=>closes++,onError:()=>errors++});
  adv.callbacks.onOpen();adv.callbacks.onRewarded();adv.callbacks.onRewarded();adv.callbacks.onClose();
  assert.deepEqual([opens,rewards,closes],[1,1,1]);
  api.showRewardedAd(()=>rewards++, {onError:()=>errors++,onClose:()=>closes++});
  adv.callbacks.onError();adv.callbacks.onClose();assert.equal(rewards,1);assert.equal(errors,1);
  const cb={onClose:()=>{}};api.showFullscreenAd(cb);assert.equal(adv.callbacks,cb);
  await assert.rejects(api.setScore('test',5), /unavailable/);
  let tries=0;
  const retry=fresh(async()=>{if(++tries===1)throw Error('offline');return sdk;});
  await assert.rejects(retry.init(), /offline/);await retry.init();assert.equal(tries,2);
  let playerTries=0;
  sdk.getPlayer=async()=>{if(++playerTries===1)throw Error('player offline');return player;};
  await assert.rejects(retry.load(), /player offline/);assert.equal((await retry.load()).level,6);
  let readyTries=0;
  sdk.features.LoadingAPI.ready=()=>{if(++readyTries===1)throw Error('ready failed');};
  assert.throws(()=>retry.ready(), /ready failed/);retry.ready();retry.ready();assert.equal(readyTries,2);
  console.log('sdk-wrapper: PASS — lifecycle, retry, callbacks, reward idempotency, persistence, unavailable leaderboard');
})().catch(error=>{console.error(error);process.exitCode=1;});

// Run the original Node/CDP harnesses unchanged with reliable Chrome cleanup.
import { existsSync, mkdtempSync, readFileSync, openSync, closeSync, rmSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../vendor/yandex-games-debug-checker/', import.meta.url));
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
function findChrome() {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;
  const mac = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (process.platform === 'darwin' && existsSync(mac)) return mac;
  for (const name of ['google-chrome', 'chromium', 'chrome', 'chromium-browser']) {
    const result = spawnSync(process.platform === 'win32' ? 'where' : 'which', [name], { encoding: 'utf8' });
    if (result.status === 0) return result.stdout.trim().split(/\r?\n/)[0];
  }
  throw new Error('Chrome/Chromium not found; set CHROME_BIN. Browser tests were NOT run.');
}
const chrome = findChrome();
for (const [harness, mode] of [
  ['tests/cdp-smoke.mjs'],
  ['tests/orc-castle-smoke.mjs', 'before'],
  ['tests/orc-castle-smoke.mjs', 'after']
]) {
  const temp = mkdtempSync(path.join(tmpdir(), 'yandex-checker-browser-'));
  const profile = path.join(temp, 'profile');
  const log = path.join(temp, 'chrome.log');
  const fd = openSync(log, 'w');
  const browser = spawn(chrome, ['--headless', '--no-sandbox', '--disable-gpu',
    '--disable-dev-shm-usage', '--remote-allow-origins=*', '--remote-debugging-port=0',
    `--user-data-dir=${profile}`, 'about:blank'], { stdio: ['ignore', fd, fd] });
  closeSync(fd);
  let spawnError;
  const closed = new Promise(resolve => {
    browser.once('error', error => { spawnError = error; resolve(); });
    browser.once('close', resolve);
  });
  try {
    const portFile = path.join(profile, 'DevToolsActivePort');
    const deadline = Date.now() + 10000;
    while (!existsSync(portFile) && Date.now() < deadline) {
      if (spawnError) throw spawnError;
      if (browser.exitCode !== null || browser.signalCode !== null) break;
      await sleep(100);
    }
    if (!existsSync(portFile)) throw new Error(`Chrome did not start: ${readFileSync(log, 'utf8')}`);
    const port = Number(readFileSync(portFile, 'utf8').split('\n')[0]);
    if (!port) throw new Error('Invalid Chrome debug port');
    const args = [harness, String(port), root, ...(mode ? [mode] : [])];
    const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit', timeout: 45000 });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`${harness} ${mode || ''} failed: ${result.status ?? result.signal}`);
  } finally {
    if (browser.exitCode === null && browser.signalCode === null && !spawnError) {
      browser.kill('SIGTERM');
      await Promise.race([closed, sleep(5000)]);
      if (browser.exitCode === null && browser.signalCode === null) {
        browser.kill('SIGKILL');
        await closed;
      }
    }
    // Chrome subprocesses may finish profile writes just after the main exit.
    rmSync(temp, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
  }
}
console.log('browser-suite: PASS — SDK smoke and before/after in real Chrome with mock SDK');

// Exercise the original Pages builder in isolation: never dirty the pinned vendor.
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const source = fileURLToPath(new URL('../vendor/yandex-games-debug-checker/', import.meta.url));
const temp = mkdtempSync(path.join(tmpdir(), 'yandex-checker-demo-'));
try {
  cpSync(source, temp, { recursive: true });
  const result = spawnSync(process.execPath, ['scripts/build-pages.mjs'], {
    cwd: temp, encoding: 'utf8', timeout: 30000
  });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const out = path.join(temp, '_site');
  for (const file of ['index.html', 'debugcheck.js', 'examples/orc-castle/mock-sdk.js',
    'examples/orc-castle/before/index.html', 'examples/orc-castle/after/index.html']) {
    assert.ok(existsSync(path.join(out, file)), `Missing demo output: ${file}`);
  }
  assert.deepEqual(readFileSync(path.join(out, 'debugcheck.js')), readFileSync(path.join(source, 'debugcheck.js')));
  const after = readFileSync(path.join(out, 'examples/orc-castle/after/index.html'), 'utf8');
  assert.ok(after.includes('../mock-sdk.js'), 'Demo must use explicit mock SDK');
  assert.ok(after.includes('YGDebugChecker.open()'), 'Demo must open checker');
  const production = readFileSync(path.join(source, 'examples/orc-castle/after/index.html'), 'utf8');
  assert.ok(!production.includes('mock-sdk.js'), 'Production fixture must stay separate');
  console.log('demo-build: PASS — original builder, complete output, checker integrity, mock/production separation');
} finally {
  rmSync(temp, { recursive: true, force: true });
}

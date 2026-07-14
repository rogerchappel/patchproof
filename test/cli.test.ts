import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import assert from 'node:assert/strict';
import test from 'node:test';

const execFileAsync = promisify(execFile);

test('prints CLI version', async () => {
  const { stdout } = await execFileAsync(process.execPath, ['dist/src/cli.js', '--version']);

  assert.equal(stdout.trim(), '0.1.0');
});

test('prints help with supported commands', async () => {
  const { stdout } = await execFileAsync(process.execPath, ['dist/src/cli.js', '--help']);

  assert.match(stdout, /patchproof 0\.1\.0/);
  assert.match(stdout, /patchproof init/);
  assert.match(stdout, /patchproof run --run/);
  assert.match(stdout, /patchproof render/);
});

test('rejects unknown commands with a non-zero exit', async () => {
  await assert.rejects(
    execFileAsync(process.execPath, ['dist/src/cli.js', 'unknown-command']),
    (error: unknown) => {
      assert.equal((error as { code?: number }).code, 1);
      assert.match((error as { stderr?: string }).stderr ?? '', /Unknown command: unknown-command/);
      return true;
    },
  );
});

test('documented placeholder commands exit successfully', async () => {
  const init = await execFileAsync(process.execPath, ['dist/src/cli.js', 'init']);
  const run = await execFileAsync(process.execPath, ['dist/src/cli.js', 'run', '--run']);
  const render = await execFileAsync(process.execPath, ['dist/src/cli.js', 'render']);

  assert.match(init.stdout, /proof bundle scaffolding is not implemented yet/);
  assert.match(run.stdout, /command receipt capture is not implemented yet/);
  assert.match(render.stdout, /proof bundle rendering is not implemented yet/);
});

test('run command requires explicit experimental acknowledgement', async () => {
  await assert.rejects(
    execFileAsync(process.execPath, ['dist/src/cli.js', 'run']),
    (error: unknown) => {
      assert.equal((error as { code?: number }).code, 2);
      assert.match((error as { stderr?: string }).stderr ?? '', /requires --run/);
      return true;
    },
  );
});

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import assert from 'node:assert/strict';
import test from 'node:test';

const execFileAsync = promisify(execFile);

test('prints CLI version', async () => {
  const { stdout } = await execFileAsync(process.execPath, ['dist/cli.js', '--version']);

  assert.equal(stdout.trim(), '0.1.0');
});

test('prints help with supported commands', async () => {
  const { stdout } = await execFileAsync(process.execPath, ['dist/cli.js', '--help']);

  assert.match(stdout, /patchproof 0\.1\.0/);
  assert.match(stdout, /patchproof init/);
  assert.match(stdout, /patchproof run --run/);
  assert.match(stdout, /patchproof render/);
});

test('rejects unknown commands with a non-zero exit', async () => {
  await assert.rejects(
    execFileAsync(process.execPath, ['dist/cli.js', 'unknown-command']),
    (error: unknown) => {
      assert.equal((error as { code?: number }).code, 1);
      assert.match((error as { stderr?: string }).stderr ?? '', /Unknown command: unknown-command/);
      return true;
    },
  );
});

test('unavailable workflow commands fail with actionable errors', async () => {
  for (const [args, capability] of [
    [['init'], 'proof bundle scaffolding'],
    [['run', '--run'], 'command receipt capture'],
    [['render'], 'proof bundle rendering'],
  ] as const) {
    await assert.rejects(execFileAsync(process.execPath, ['dist/cli.js', ...args]), (error: unknown) => {
      const failure = error as { code?: number; stdout?: string; stderr?: string };
      assert.equal(failure.code, 2);
      assert.equal(failure.stdout, '');
      assert.match(failure.stderr ?? '', new RegExp(`unavailable: ${capability} is not implemented`));
      assert.match(failure.stderr ?? '', /Do not use this command in proof automation/);
      return true;
    });
  }
});

test('run command requires explicit experimental acknowledgement', async () => {
  await assert.rejects(
    execFileAsync(process.execPath, ['dist/cli.js', 'run']),
    (error: unknown) => {
      assert.equal((error as { code?: number }).code, 2);
      assert.match((error as { stderr?: string }).stderr ?? '', /requires --run/);
      return true;
    },
  );
});

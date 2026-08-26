import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const checker = new URL("../scripts/check-executable-docs.mjs", import.meta.url);

function runChecker(files) {
  return spawnSync(process.execPath, [checker.pathname, ...files], { encoding: "utf8" });
}

test("every documented CLI command is validated from the built dist entrypoint", () => {
  const result = runChecker([
    "examples/cli-surface-smoke.md",
    "docs/tutorials/package-surface-check.md",
  ]);
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test("executable-docs checker fails when a documented dist entrypoint does not exist", () => {
  const dir = mkdtempSync(join(tmpdir(), "patchproof-docs-check-"));
  const stale = join(dir, "stale-guide.md");
  writeFileSync(stale, "```sh\nnode dist/src/cli.js --version\n```\n");
  try {
    const result = runChecker([stale]);
    assert.notEqual(result.status, 0, "checker must reject a nonexistent dist entrypoint");
    assert.match(result.stdout + result.stderr, /dist\/src\/cli\.js/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
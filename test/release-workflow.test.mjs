import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workflow = readFileSync(
  new URL("../.github/workflows/release-dry-run.yml", import.meta.url),
  "utf8",
);

function pullRequestPaths(source) {
  const pullRequest = source.match(/^  pull_request:\n    paths:\n((?:      - .+\n)+)/m);
  assert.ok(pullRequest, "release dry run must define pull_request paths");
  return Array.from(pullRequest[1].matchAll(/^      - (.+)$/gm), (match) => match[1]);
}

test("release dry run watches every release input", () => {
  const paths = new Set(pullRequestPaths(workflow));
  const requiredPaths = [
    "src/**",
    "test/**",
    "scripts/**",
    "docs/**",
    "examples/**",
    "releasebox.config.json",
    "tsconfig.json",
    "package.json",
    "package-lock.json",
    "README.md",
    "LICENSE",
    "SECURITY.md",
    "CHANGELOG.md",
    "CONTRIBUTING.md",
    "CODE_OF_CONDUCT.md",
    ".github/workflows/release*.yml",
  ];

  assert.deepEqual(
    requiredPaths.filter((path) => !paths.has(path)),
    [],
    "release dry run is missing release inputs",
  );
});

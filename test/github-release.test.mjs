import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  findSingleTarball,
  publishGitHubRelease,
  validateReleaseTag,
} from "../scripts/github-release.mjs";

test("release tags must be valid and match package.json", () => {
  assert.doesNotThrow(() => validateReleaseTag("v0.1.0", "0.1.0"));
  assert.throws(() => validateReleaseTag("release-0.1.0", "0.1.0"), /complete semver tag/);
  assert.throws(() => validateReleaseTag("v0.1", "0.1.0"), /complete semver tag/);
  assert.throws(() => validateReleaseTag("v0.2.0", "0.1.0"), /expected v0\.1\.0/);
});

test("artifact guard accepts exactly one tarball", () => {
  const directory = mkdtempSync(join(tmpdir(), "patchproof-artifact-"));
  assert.throws(() => findSingleTarball(directory), /found 0/);

  writeFileSync(join(directory, "patchproof-0.1.0.tgz"), "first");
  assert.equal(findSingleTarball(directory), join(directory, "patchproof-0.1.0.tgz"));

  writeFileSync(join(directory, "unexpected.tgz"), "second");
  assert.throws(() => findSingleTarball(directory), /found 2/);
});

test("first publish creates a release with its artifact", () => {
  const calls = [];
  const run = (args) => {
    calls.push(args);
    if (args[1] === "view") {
      const error = new Error("gh release view failed");
      error.stderr = "release not found\n";
      throw error;
    }
  };

  publishGitHubRelease({ tag: "v0.1.0", notesFile: "notes.md", artifact: "artifact.tgz", run });

  assert.deepEqual(calls, [
    ["release", "view", "v0.1.0"],
    ["release", "create", "v0.1.0", "--notes-file", "notes.md", "artifact.tgz"],
  ]);
});

test("release inspection failures do not attempt to create a release", () => {
  const calls = [];
  const inspectionError = new Error("gh release view failed");
  inspectionError.stderr = "HTTP 500: Internal Server Error\n";
  const run = (args) => {
    calls.push(args);
    throw inspectionError;
  };

  assert.throws(
    () => publishGitHubRelease({ tag: "v0.1.0", notesFile: "notes.md", artifact: "artifact.tgz", run }),
    (error) => error === inspectionError,
  );
  assert.deepEqual(calls, [["release", "view", "v0.1.0"]]);
});

test("rerun repairs notes and replaces the artifact", () => {
  const calls = [];
  const run = (args) => calls.push(args);

  publishGitHubRelease({ tag: "v0.1.0", notesFile: "notes.md", artifact: "artifact.tgz", run });

  assert.deepEqual(calls, [
    ["release", "view", "v0.1.0"],
    ["release", "edit", "v0.1.0", "--notes-file", "notes.md"],
    ["release", "upload", "v0.1.0", "artifact.tgz", "--clobber"],
  ]);
});

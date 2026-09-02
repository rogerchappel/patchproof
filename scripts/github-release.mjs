#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const semverTag = /^v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

export function validateReleaseTag(tag, version) {
  if (!semverTag.test(tag)) {
    throw new Error(`Release tag must be a complete semver tag (vX.Y.Z); received ${JSON.stringify(tag)}`);
  }

  const expected = `v${version}`;
  if (tag !== expected) {
    throw new Error(`Release tag ${tag} does not match package version ${version}; expected ${expected}`);
  }
}

export function findSingleTarball(directory) {
  const tarballs = readdirSync(directory)
    .filter((name) => name.endsWith(".tgz"))
    .sort();

  if (tarballs.length !== 1) {
    throw new Error(`Expected exactly one tarball in ${directory}; found ${tarballs.length}`);
  }

  return resolve(directory, tarballs[0]);
}

function errorOutput(error) {
  const stderr = error && "stderr" in Object(error) ? error.stderr : undefined;
  if (Buffer.isBuffer(stderr)) return stderr.toString("utf8");
  if (typeof stderr === "string") return stderr;
  return error instanceof Error ? error.message : String(error);
}

export function isReleaseNotFound(error) {
  return /(?:^|\n)(?:release not found|HTTP 404(?::[^\n]*)?)(?:\n|$)/i.test(errorOutput(error).trim());
}

export function publishGitHubRelease({ tag, notesFile, artifact, run }) {
  let exists = true;
  try {
    run(["release", "view", tag]);
  } catch (error) {
    if (!isReleaseNotFound(error)) throw error;
    exists = false;
  }

  if (exists) {
    run(["release", "edit", tag, "--notes-file", notesFile]);
    run(["release", "upload", tag, artifact, "--clobber"]);
  } else {
    run(["release", "create", tag, "--notes-file", notesFile, artifact]);
  }
}

function runGh(args) {
  if (args[0] === "release" && args[1] === "view") {
    execFileSync("gh", args, { encoding: "utf8", stdio: ["inherit", "ignore", "pipe"] });
    return;
  }
  execFileSync("gh", args, { stdio: "inherit" });
}

function packageVersion() {
  return JSON.parse(readFileSync("package.json", "utf8")).version;
}

function usage() {
  console.error("Usage: node scripts/github-release.mjs validate-tag <tag> | artifact <directory> | publish <tag> <notes-file> <directory>");
}

export function main(args) {
  const [command, ...values] = args;

  if (command === "validate-tag" && values.length === 1) {
    validateReleaseTag(values[0], packageVersion());
    console.log(`Release tag ${values[0]} matches package.json.`);
    return;
  }

  if (command === "artifact" && values.length === 1) {
    console.log(findSingleTarball(values[0]));
    return;
  }

  if (command === "publish" && values.length === 3) {
    const [tag, notesFile, directory] = values;
    validateReleaseTag(tag, packageVersion());
    publishGitHubRelease({
      tag,
      notesFile,
      artifact: findSingleTarball(directory),
      run: runGh,
    });
    return;
  }

  usage();
  throw new Error("Invalid release command");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(errorOutput(error).trim());
    process.exit(1);
  }
}

#!/usr/bin/env node
// Verify every documented `node dist/...` command in the executable
// documentation uses the built package entrypoint and behaves as documented.
//
// Run after `npm run build` (release:check does this). Exit code 1 with a
// diagnostic when a doc references a dist entrypoint that does not exist or a
// documented command misbehaves, so stale paths like dist/src/cli.js cannot
// return to the executable guides.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const DOC_FILES = [
  "examples/cli-surface-smoke.md",
  "docs/tutorials/package-surface-check.md",
];
const COMMAND_RE = /^\s*(?:if\s+)?node\s+(?:\.\/)?(dist\/\S+)(.*)$/;
const INFO_ARG = new Set(["--version", "--help"]);

// Command-line file arguments override the defaults (used by the test suite).
const FILES = process.argv.slice(2).length > 0 ? process.argv.slice(2) : DOC_FILES;

/**
 * Extract the documented `node dist/...` commands from a documentation file.
 * Each line may be wrapped in a shell guard (`if node ...; then`) that is
 * stripped before execution.
 */
function documentedCommands(doc) {
  const commands = [];
  for (const line of doc.split("\n")) {
    const match = line.match(COMMAND_RE);
    if (!match) {
      continue;
    }
    const entrypoint = match[1];
    const args = match[2].replace(/;\s*then$/, "").trim().split(/\s+/).filter(Boolean);
    commands.push({ entrypoint, args });
  }
  return commands;
}

const failures = [];
const seen = new Set();

for (const file of FILES) {
  const commands = documentedCommands(readFileSync(file, "utf8"));
  if (commands.length === 0) {
    failures.push(`${file}: no executable node commands found`);
    continue;
  }
  for (const { entrypoint, args } of commands) {
    if (!existsSync(entrypoint)) {
      failures.push(
        `${file}: documented entrypoint '${entrypoint}' does not exist; ` +
          "package.json declares the CLI at ./dist/cli.js",
      );
      continue;
    }
    const key = `${entrypoint} ${args.join(" ")}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    const informational = args.some((arg) => INFO_ARG.has(arg));
    const invocation = `node ${entrypoint} ${args.join(" ")}`;
    try {
      execFileSync(process.execPath, [entrypoint, ...args], { stdio: "pipe" });
      if (!informational) {
        failures.push(`${file}: \`${invocation}\` unexpectedly succeeded (documented as unavailable or guarded)`);
      }
    } catch (error) {
      const status = error.status ?? 1;
      if (informational) {
        failures.push(`${file}: \`${invocation}\` failed with exit ${status}; expected success`);
      }
    }
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`patchproof executable-docs check failed: ${failure}`);
  }
  process.exit(1);
}
console.log(`patchproof executable-docs check passed (${seen.size} documented command(s) validated from dist/).`);
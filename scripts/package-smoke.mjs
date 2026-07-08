#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const output = execFileSync("npm", ["pack", "--dry-run", "--json"], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "inherit"],
});
const [packument] = JSON.parse(output);
const packedFiles = new Set(packument.files.map((file) => file.path));

const requiredFiles = [
  "README.md",
  "LICENSE",
  "dist/src/cli.js",
  "dist/src/index.js",
  "examples/cli-surface-smoke.md",
];
const forbiddenPrefixes = ["dist/test/"];

const missing = requiredFiles.filter((file) => !packedFiles.has(file));
const forbidden = packument.files
  .map((file) => file.path)
  .filter((file) => forbiddenPrefixes.some((prefix) => file.startsWith(prefix)));

if (missing.length > 0 || forbidden.length > 0) {
  if (missing.length > 0) {
    console.error(`${packageJson.name} package is missing required file(s):`);
    for (const file of missing) console.error(`- ${file}`);
  }
  if (forbidden.length > 0) {
    console.error(`${packageJson.name} package includes test build artifact(s):`);
    for (const file of forbidden) console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log(
  `${packageJson.name} package smoke passed with ${packument.files.length} packed file(s).`,
);

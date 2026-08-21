#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const staleArtifact = "dist/stale-runtime.js";

mkdirSync("dist", { recursive: true });
writeFileSync(staleArtifact, "throw new Error('stale build artifact');\n");
execFileSync("npm", ["run", "build"], { stdio: "inherit" });

if (existsSync(staleArtifact)) {
  console.error(`${packageJson.name} build did not remove ${staleArtifact}.`);
  process.exit(1);
}

const output = execFileSync("npm", ["pack", "--dry-run", "--json"], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "inherit"],
});
const [packument] = JSON.parse(output);
const packedFiles = new Set(packument.files.map((file) => file.path));

const requiredFiles = [
  "README.md",
  "LICENSE",
  "dist/cli.js",
  "dist/cli.js.map",
  "dist/cli.d.ts",
  "dist/index.js",
  "dist/index.js.map",
  "dist/index.d.ts",
  "examples/cli-surface-smoke.md",
];
const forbiddenPrefixes = ["dist/test/"];
const allowedDistFiles = new Set(requiredFiles.filter((file) => file.startsWith("dist/")));

const missing = requiredFiles.filter((file) => !packedFiles.has(file));
const forbidden = packument.files
  .map((file) => file.path)
  .filter((file) => forbiddenPrefixes.some((prefix) => file.startsWith(prefix)));
const unexpectedDistFiles = packument.files
  .map((file) => file.path)
  .filter((file) => file.startsWith("dist/") && !allowedDistFiles.has(file));

if (missing.length > 0 || forbidden.length > 0 || unexpectedDistFiles.length > 0) {
  if (missing.length > 0) {
    console.error(`${packageJson.name} package is missing required file(s):`);
    for (const file of missing) console.error(`- ${file}`);
  }
  if (forbidden.length > 0) {
    console.error(`${packageJson.name} package includes test build artifact(s):`);
    for (const file of forbidden) console.error(`- ${file}`);
  }
  if (unexpectedDistFiles.length > 0) {
    console.error(`${packageJson.name} package includes unexpected build artifact(s):`);
    for (const file of unexpectedDistFiles) console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log(
  `${packageJson.name} package smoke passed with ${packument.files.length} packed file(s).`,
);

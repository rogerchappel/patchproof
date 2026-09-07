#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const staleArtifact = "dist/stale-runtime.js";

mkdirSync("dist", { recursive: true });
writeFileSync(staleArtifact, "throw new Error('stale build artifact');\n");
execFileSync("npm", ["run", "build"], { stdio: "inherit" });

if (existsSync(staleArtifact)) {
  console.error(`${packageJson.name} build did not remove ${staleArtifact}.`);
  process.exit(1);
}

const workspace = mkdtempSync(join(tmpdir(), "patchproof-package-smoke-"));
const output = execFileSync(
  "npm",
  ["pack", "--json", "--pack-destination", workspace],
  { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
);
const packuments = JSON.parse(output);

if (packuments.length !== 1) {
  console.error(`npm pack produced ${packuments.length} artifacts instead of one.`);
  process.exit(1);
}

const [packument] = packuments;
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

if (packageJson.name === "patchproof" || packageJson.name !== "@rogerchappel/patchproof") {
  console.error(`Unexpected package identity: ${packageJson.name}.`);
  process.exit(1);
}

if (
  packageJson.bin?.patchproof !== "./dist/cli.js" ||
  packageJson.main !== "./dist/index.js" ||
  packageJson.exports?.["."] !== "./dist/index.js"
) {
  console.error("The packed manifest lost the patchproof CLI or public entrypoint.");
  process.exit(1);
}

const artifacts = readdirSync(workspace).filter((file) => file.endsWith(".tgz"));
if (artifacts.length !== 1) {
  console.error(`Found ${artifacts.length} installable artifacts instead of one.`);
  process.exit(1);
}

const prefix = join(workspace, "consumer");
try {
  execFileSync(
    "npm",
    ["install", "--ignore-scripts", "--no-audit", "--no-fund", "--prefix", prefix, join(workspace, artifacts[0])],
    { stdio: "inherit" },
  );
  const binary = join(prefix, "node_modules", ".bin", "patchproof");
  const version = execFileSync(binary, ["--version"], { encoding: "utf8" }).trim();
  const help = execFileSync(binary, ["--help"], { encoding: "utf8" });
  if (version !== packageJson.version || !help.includes("Usage:\n  patchproof init")) {
    console.error("The installed patchproof binary failed its version/help contract.");
    process.exit(1);
  }
} finally {
  rmSync(workspace, { recursive: true, force: true });
}

console.log(
  `${packageJson.name} package smoke passed with ${packument.files.length} packed file(s).`,
);

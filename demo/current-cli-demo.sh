#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

out_dir="${TMPDIR:-/tmp}/patchproof-demo"
mkdir -p "$out_dir"

npm run build
node dist/cli.js --help > "$out_dir/help.txt"
node dist/cli.js --version > "$out_dir/version.txt"

grep -q "patchproof 0.1.0" "$out_dir/help.txt"
grep -q "0.1.0" "$out_dir/version.txt"

echo "CLI help: $out_dir/help.txt"
echo "CLI version: $out_dir/version.txt"

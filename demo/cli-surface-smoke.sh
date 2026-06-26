#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
out_dir="${TMPDIR:-/tmp}/patchproof-cli-surface"

cd "$repo_root"
rm -rf "$out_dir"
mkdir -p "$out_dir"

npm run build >/dev/null

node dist/src/cli.js --version >"$out_dir/version.txt"
node dist/src/cli.js --help >"$out_dir/help.txt"
node dist/src/cli.js init >"$out_dir/init.txt"
node dist/src/cli.js run --run >"$out_dir/run.txt"
node dist/src/cli.js render >"$out_dir/render.txt"

set +e
node dist/src/cli.js run >"$out_dir/run-without-flag.out" 2>"$out_dir/run-without-flag.err"
run_status=$?
set -e

test "$run_status" -eq 2
grep -q "0.1.0" "$out_dir/version.txt"
grep -q "patchproof init" "$out_dir/help.txt"
grep -q "scaffolding is not implemented yet" "$out_dir/init.txt"
grep -q "receipt capture is not implemented yet" "$out_dir/run.txt"
grep -q "rendering is not implemented yet" "$out_dir/render.txt"
grep -q "requires --run" "$out_dir/run-without-flag.err"

echo "patchproof CLI surface artifacts written to $out_dir"
find "$out_dir" -maxdepth 1 -type f -print | sort

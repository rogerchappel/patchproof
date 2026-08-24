#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
out_dir="${TMPDIR:-/tmp}/patchproof-cli-surface"

cd "$repo_root"
rm -rf "$out_dir"
mkdir -p "$out_dir"

npm run build >/dev/null

node dist/cli.js --version >"$out_dir/version.txt"
node dist/cli.js --help >"$out_dir/help.txt"
for command in "init" "run --run" "render"; do
  name="${command%% *}"
  read -r -a args <<<"$command"
  set +e
  node dist/cli.js "${args[@]}" >"$out_dir/$name.out" 2>"$out_dir/$name.err"
  status=$?
  set -e
  test "$status" -eq 2
  printf '%s\n' "$status" >"$out_dir/$name.status"
done

set +e
node dist/cli.js run >"$out_dir/run-without-flag.out" 2>"$out_dir/run-without-flag.err"
run_status=$?
set -e

test "$run_status" -eq 2
grep -q "0.1.0" "$out_dir/version.txt"
grep -q "patchproof init" "$out_dir/help.txt"
grep -q "unavailable: proof bundle scaffolding is not implemented" "$out_dir/init.err"
grep -q "unavailable: command receipt capture is not implemented" "$out_dir/run.err"
grep -q "unavailable: proof bundle rendering is not implemented" "$out_dir/render.err"
grep -q "requires --run" "$out_dir/run-without-flag.err"

echo "patchproof CLI surface artifacts written to $out_dir"
find "$out_dir" -maxdepth 1 -type f -print | sort

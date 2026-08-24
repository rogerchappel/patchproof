#!/usr/bin/env bash
set -euo pipefail

npm run build

node dist/cli.js --version | grep -q "0.1.0"
node dist/cli.js --help | grep -q "patchproof"
smoke_dir="$(mktemp -d "${TMPDIR:-/tmp}/patchproof-smoke.XXXXXX")"
trap 'rm -rf "$smoke_dir"' EXIT
for command in "init" "run --run" "render"; do
  read -r -a args <<<"$command"
  set +e
  node dist/cli.js "${args[@]}" >"$smoke_dir/out" 2>"$smoke_dir/err"
  status=$?
  set -e
  if test "$status" -eq 0; then
    echo "patchproof $command unexpectedly succeeded" >&2
    exit 1
  fi
  test "$status" -eq 2
  grep -q "is unavailable:" "$smoke_dir/err"
  grep -q "Do not use this command in proof automation" "$smoke_dir/err"
done
if node dist/cli.js run >/tmp/patchproof-run.out 2>/tmp/patchproof-run.err; then
  echo "patchproof run without --run unexpectedly succeeded" >&2
  exit 1
fi
grep -q "requires --run" /tmp/patchproof-run.err

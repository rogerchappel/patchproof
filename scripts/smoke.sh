#!/usr/bin/env bash
set -euo pipefail

node dist/src/cli.js --version | grep -q "0.1.0"
node dist/src/cli.js --help | grep -q "patchproof"
node dist/src/cli.js init | grep -q "scaffolding is not implemented yet"
node dist/src/cli.js run --run | grep -q "receipt capture is not implemented yet"
node dist/src/cli.js render | grep -q "rendering is not implemented yet"
if node dist/src/cli.js run >/tmp/patchproof-run.out 2>/tmp/patchproof-run.err; then
  echo "patchproof run without --run unexpectedly succeeded" >&2
  exit 1
fi
grep -q "requires --run" /tmp/patchproof-run.err

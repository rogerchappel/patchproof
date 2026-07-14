#!/usr/bin/env bash
set -euo pipefail

npm run build

node dist/cli.js --help | grep -q "patchproof 0.1.0"
node dist/cli.js --help | grep -q "patchproof run --run"
node dist/cli.js --version | grep -q "0.1.0"

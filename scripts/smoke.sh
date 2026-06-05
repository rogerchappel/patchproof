#!/usr/bin/env bash
set -euo pipefail

node dist/src/cli.js --version | grep -q "0.1.0"
node dist/src/cli.js --help | grep -q "patchproof"

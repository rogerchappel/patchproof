#!/usr/bin/env node
import { VERSION } from './index.js';

const command = process.argv[2] ?? 'help';

if (command === '--version' || command === '-v') {
  console.log(VERSION);
} else if (command === 'help' || command === '--help' || command === '-h') {
  console.log(`patchproof ${VERSION}

Usage:
  patchproof init
  patchproof run --run
  patchproof render
`);
} else {
  console.error(`Unknown command: ${command}`);
  process.exitCode = 1;
}

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
} else if (command === 'init') {
  console.log('patchproof init: proof bundle scaffolding is not implemented yet.');
} else if (command === 'run') {
  if (!process.argv.includes('--run')) {
    console.error('patchproof run requires --run while the command is experimental.');
    process.exitCode = 2;
  } else {
    console.log('patchproof run: command receipt capture is not implemented yet.');
  }
} else if (command === 'render') {
  console.log('patchproof render: proof bundle rendering is not implemented yet.');
} else {
  console.error(`Unknown command: ${command}`);
  process.exitCode = 1;
}

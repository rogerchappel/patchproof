#!/usr/bin/env node
import { VERSION } from './index.js';

const command = process.argv[2] ?? 'help';
const unavailable = (name: string, capability: string): void => {
  console.error(
    `patchproof ${name} is unavailable: ${capability} is not implemented. ` +
      'Do not use this command in proof automation; check --help or the README for the current CLI status.',
  );
  process.exitCode = 2;
};

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
  unavailable('init', 'proof bundle scaffolding');
} else if (command === 'run') {
  if (!process.argv.includes('--run')) {
    console.error('patchproof run requires --run while the command is experimental.');
    process.exitCode = 2;
  } else {
    unavailable('run --run', 'command receipt capture');
  }
} else if (command === 'render') {
  unavailable('render', 'proof bundle rendering');
} else {
  console.error(`Unknown command: ${command}`);
  process.exitCode = 1;
}

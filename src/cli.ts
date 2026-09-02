#!/usr/bin/env node
import { VERSION } from './index.js';

const [command = 'help', ...args] = process.argv.slice(2);
const rejectArguments = (name: string, expected: string, received: string[]): boolean => {
  if (received.length === 0) return false;
  console.error(
    `patchproof ${name} does not accept ${received.map((argument) => JSON.stringify(argument)).join(', ')}. ` +
      `Usage: ${expected}`,
  );
  process.exitCode = 1;
  return true;
};
const unavailable = (name: string, capability: string): void => {
  console.error(
    `patchproof ${name} is unavailable: ${capability} is not implemented. ` +
      'Do not use this command in proof automation; check --help or the README for the current CLI status.',
  );
  process.exitCode = 2;
};

if (command === '--version' || command === '-v') {
  if (!rejectArguments(command, 'patchproof --version', args)) console.log(VERSION);
} else if (command === 'help' || command === '--help' || command === '-h') {
  if (!rejectArguments(command, 'patchproof --help', args)) console.log(`patchproof ${VERSION}

Usage:
  patchproof init
  patchproof run --run
  patchproof render
`);
} else if (command === 'init') {
  if (!rejectArguments('init', 'patchproof init', args)) unavailable('init', 'proof bundle scaffolding');
} else if (command === 'run') {
  if (args.length === 0) {
    console.error('patchproof run requires --run while the command is experimental.');
    process.exitCode = 2;
  } else if (args.length === 1 && args[0] === '--run') {
    unavailable('run --run', 'command receipt capture');
  } else {
    rejectArguments('run', 'patchproof run --run', args);
  }
} else if (command === 'render') {
  if (!rejectArguments('render', 'patchproof render', args)) unavailable('render', 'proof bundle rendering');
} else {
  console.error(`Unknown command: ${command}`);
  process.exitCode = 1;
}

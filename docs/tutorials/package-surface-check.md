# Package Surface Check

This recipe verifies the public command surface without claiming the proof
bundle workflow is complete.

## Build

```sh
npm install
npm run build
```

## Inspect

```sh
node dist/src/cli.js --help
node dist/src/cli.js --version
```

The help output should show:

```text
patchproof init
patchproof run --run
patchproof render
```

## Exercise placeholders

```sh
node dist/src/cli.js init
node dist/src/cli.js run --run
node dist/src/cli.js render
```

These commands are intentionally wired as explicit placeholders in v0.1.0. They
let package smoke tests verify the CLI entrypoint while keeping future proof
bundle behavior out of scope until it is implemented.

## Guard the experimental run command

```sh
if node dist/src/cli.js run; then
  echo "unexpected success"
  exit 1
fi
```

`patchproof run` requires `--run` during this experimental phase.


# CLI Surface Demo

This demo verifies the public `patchproof` command surface while the proof
bundle workflow is still in its v0.1.0 placeholder phase.

## Run it

```sh
npm install
bash demo/cli-surface-smoke.sh
```

The script builds the CLI and writes command receipts under
`${TMPDIR:-/tmp}/patchproof-cli-surface`:

- `version.txt`
- `help.txt`
- `init.txt`
- `run.txt`
- `render.txt`
- `run-without-flag.err`

## What it proves

- The built CLI can be executed from `dist/src/cli.js`.
- The version command reports `0.1.0`.
- `init`, `run --run`, and `render` are wired as explicit placeholders.
- `run` without `--run` exits with status `2`, keeping experimental receipt
  capture opt-in.

## What it does not prove

This does not claim proof bundle capture is complete. It is a release and demo
smoke for the current public surface only.

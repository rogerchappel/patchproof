# Capture the current patchproof CLI surface

patchproof is early-stage. The current CLI surface is intentionally small, so a
demo should show exactly what is available today: help text and version output.

## Run the demo

```sh
npm install
bash demo/current-cli-demo.sh
```

The script builds the TypeScript entrypoint and writes:

- `/tmp/patchproof-demo/help.txt`
- `/tmp/patchproof-demo/version.txt`

## Manual commands

```sh
npm run build
node dist/cli.js --help
node dist/cli.js --version
```

## What to verify

- Help output starts with `patchproof 0.1.0`.
- The advertised commands are `init`, `run --run`, and `render`.
- Version output is `0.1.0`.

This keeps promotion material aligned with the checked-in CLI instead of
describing features that are not implemented yet.

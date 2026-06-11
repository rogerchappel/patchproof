# CLI Surface Smoke

`patchproof` v0.1.0 exposes a deliberately small command surface while proof
bundle capture is being finalized. Use this fixture as a copyable smoke script
for demos, release checks, and package verification.

```sh
npm install
npm run build
node dist/src/cli.js --version
node dist/src/cli.js --help
node dist/src/cli.js init
node dist/src/cli.js run --run
node dist/src/cli.js render
```

Expected messages:

- `--version` prints `0.1.0`.
- `--help` lists `init`, `run --run`, and `render`.
- `init`, `run --run`, and `render` print clear "not implemented yet" messages.
- `run` without `--run` exits non-zero so automation does not accidentally
  treat the experimental command as active proof capture.

The maintained smoke check is:

```sh
npm run smoke
```


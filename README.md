# patchproof

Local proof bundles for patches, command receipts, and reviewer handoffs.

## Status

This is an early v0.1.0 CLI surface for initializing, running, and rendering patch proof bundles.

## Install

```sh
npm install
npm run build
```

## Use

Create the local proof structure, run the configured proof command, then render the result:

```sh
node dist/src/cli.js init
node dist/src/cli.js run --run
node dist/src/cli.js render
```

Check the installed CLI version:

```sh
node dist/src/cli.js --version
```

`patchproof run` requires `--run` while command receipt capture is experimental.
This makes the placeholder command explicit in scripts and release smokes.

## Runnable Demo

Capture the current CLI surface as local command receipts:

```sh
bash demo/cli-surface-smoke.sh
```

The script writes version, help, placeholder command output, and the guarded
`run` failure output to `${TMPDIR:-/tmp}/patchproof-cli-surface`. See
[docs/tutorials/cli-surface-demo.md](docs/tutorials/cli-surface-demo.md) for the
walkthrough.

## Verify

```sh
npm run release:check
```

## Limitations

- Proof bundles are local artifacts and should be reviewed before sharing.
- The current CLI is intentionally small; expand examples as new commands land.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution expectations. Changes should be small, reviewable, and verified before review.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting guidance.

## License

MIT

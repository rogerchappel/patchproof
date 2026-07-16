# patchproof

Local proof bundles for patches, command receipts, and reviewer handoffs.

## Status

This is an early v0.1.0 CLI surface for initializing, running, and rendering patch proof bundles.

## Install from a checkout

```sh
git clone https://github.com/rogerchappel/patchproof.git
cd patchproof
npm install
npm run build
```

## Use

Create the local proof structure, run the configured proof command, then render the result:

```sh
node dist/cli.js init
node dist/cli.js run --run
node dist/cli.js render
```

Check the installed CLI version:

```sh
node dist/cli.js --version
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

Additional demo and launch assets from this sweep:

- [Capture the current CLI surface](docs/tutorials/current-cli-surface.md)
  shows help and version output for the checked-in CLI.
- `bash demo/current-cli-demo.sh` builds the CLI and writes help/version
  captures under `/tmp/patchproof-demo`.
- [Launch note draft](docs/promo/launch-note-draft.md) provides grounded
  promotion copy with explicit limitations.
- [Current CLI social hooks](docs/promo/current-cli-social-hooks.md) gives
  short promotion beats that name the current placeholder limitations.

## Verify

```sh
npm run check
npm test
npm run smoke
npm run package:smoke
npm run release:check
```

`release:check` is the CI and release-dry-run gate. It rebuilds the TypeScript
output, runs the CLI smoke, and checks that the package tarball contains the
CLI, library entrypoint, and example proof artifact.
## CLI Help Smoke

Confirm the packaged command starts and prints its help text before relying on a release tarball or downstream automation:

```bash
npm run build
node ./dist/cli.js --help
```

The command should exit successfully, print the available options, and avoid reading project files or contacting external services.

## Limitations

- Proof bundles are local artifacts and should be reviewed before sharing.
- The current CLI is intentionally small; expand examples as new commands land.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution expectations. Changes should be small, reviewable, and verified before review.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting guidance.

## License

MIT

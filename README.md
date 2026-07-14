# patchproof

Local proof-bundle CLI foundation for patches, command receipts, and reviewer
handoffs.

## Status

This repository is early-stage. Confirm the current support, release, and
security posture before using it in production.

## Install from a checkout

```sh
git clone https://github.com/rogerchappel/patchproof.git
cd patchproof
npm install
npm run build
```

## Use

Inspect the current CLI surface:

```sh
node dist/cli.js --help
node dist/cli.js --version
```

The current help text advertises the planned `init`, `run --run`, and `render`
commands. Those workflows are not implemented yet; keep demos limited to the
checked-in CLI behavior until the commands land.

## Demo Recipes

- [Capture the current CLI surface](docs/tutorials/current-cli-surface.md)
  shows the help and version output that exists today.
- `bash demo/current-cli-demo.sh` builds the CLI and writes help/version
  captures under `/tmp/patchproof-demo`.
- [Launch note draft](docs/promo/launch-note-draft.md) provides grounded
  promotion copy with explicit limitations.

## Verify

Run the local validation script before opening a pull request:

```sh
bash scripts/validate.sh
```

`scripts/validate.sh` runs the repository's standard local checks when they are defined and will also run `agent-qc ready` when `agent-qc` is installed. Missing `agent-qc` is treated as a skip, not a failure.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution expectations. Changes
should be small, reviewable, and verified before review.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting guidance. Replace
the default security policy before publishing the generated repository.

These links assume this README has been copied to the generated repository root.

## License

MIT

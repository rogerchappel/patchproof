# patchproof

patchproof is an early local-first CLI for collecting patch proof bundles:
command receipts, reviewer notes, and rendered evidence for handoffs.

## Status

This repository is early-stage. Confirm the current support, release, and
security posture before using it in production.

## Install

```sh
npm install
npm run build
```

## Use

Inspect the packaged CLI surface locally:

```sh
npx patchproof --help
npx patchproof --version
```

The current v0.1.0 command surface is intentionally small while the proof
bundle format is being finalized. These commands are wired as explicit
placeholders so scripts can detect the supported surface without assuming the
future bundle behavior is complete:

```sh
patchproof init
patchproof run --run
patchproof render
```

See [examples/cli-surface-smoke.md](examples/cli-surface-smoke.md) for a
copyable demo of the current package surface and
[docs/tutorials/package-surface-check.md](docs/tutorials/package-surface-check.md)
for the release-check recipe.

## Verify

Run the release-candidate checks before opening a PR or publishing a package:

```sh
npm test
npm run check
npm run build
npm run smoke
npm run package:smoke
npm run release:check
```

`npm run release:check` runs the same build, test, CLI smoke, and pack dry-run
path used for release readiness.

You can also run the repository validation helper:

```sh
bash scripts/validate.sh
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution expectations. Changes
should be small, reviewable, and verified before review.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting guidance. Avoid
including secrets, private diffs, or unreleased customer data in proof bundles.

## License

MIT

## Development

Run the same local checks that protect the package before opening a release or pull request:

- `npm run build`
- `npm test`
- `npm run check`
- `npm run smoke`
- `npm run package:smoke`
- `npm run release:check`

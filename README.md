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
node dist/cli.js init
node dist/cli.js run --run
node dist/cli.js render
```

Check the installed CLI version:

```sh
node dist/cli.js --version
```

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

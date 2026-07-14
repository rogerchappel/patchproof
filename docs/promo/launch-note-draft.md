# Launch note draft: patchproof CLI foundation

patchproof is a local proof-bundle CLI foundation for patches, command receipts,
and reviewer handoffs. The repository currently exposes a minimal TypeScript CLI
with help and version output, plus package scripts for build, smoke, package
smoke, and release checks.

## Demo path

```sh
npm install
bash demo/current-cli-demo.sh
```

The demo records the current help and version output under `/tmp/patchproof-demo`
so reviewers can confirm the public CLI surface before additional commands are
implemented.

## Current scope

- `patchproof --help`
- `patchproof --version`
- documented planned command names: `init`, `run --run`, and `render`
- local smoke script for the current CLI surface

## Honest limitations

- `init`, `run`, and `render` are advertised but not implemented yet.
- The project is early-stage and should not be promoted as a complete proof
  bundle generator until those workflows exist.
- Use this note for development updates, not production adoption claims.

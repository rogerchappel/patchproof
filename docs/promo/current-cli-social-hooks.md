# Current CLI Social Hooks

Grounded demo: `bash demo/cli-surface-smoke.sh`

## Short hooks

- `patchproof` is not claiming finished proof bundles yet. The current demo
  shows the CLI surface and the experimental guard around `run`.
- Early CLI projects still need demos. This one verifies help, version,
  placeholder commands, and the expected `run` guard.
- The useful promise is narrow today: local proof bundles for patch review are
  the direction, and the checked-in smoke script documents what exists now.

## Video beat

1. Run `node dist/cli.js --help`.
2. Run `node dist/cli.js run` and show the status `2` guard.
3. Run `bash demo/cli-surface-smoke.sh`.
4. Close with the limitation: receipt capture and rendering are still future
   implementation work.

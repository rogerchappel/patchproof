# Video Brief: patchproof CLI Surface

## Hook

"Before a proof-bundle tool claims real evidence, its command surface should be
small, explicit, and smoke tested."

## Demo beats

1. Open `README.md` and show the three current commands: `init`, `run --run`,
   and `render`.
2. Run `bash demo/cli-surface-smoke.sh`.
3. Open the generated temp directory printed by the script.
4. Show `help.txt` and `run-without-flag.err`.
5. Explain that v0.1.0 is intentionally a placeholder surface while proof
   bundle capture is finalized.

## Grounded claims

- The CLI builds locally with `npm run build`.
- `run` requires `--run` during the experimental phase.
- The demo records command output files that can be attached to a release PR.

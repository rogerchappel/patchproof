# Launch Note Draft

`patchproof` is an early local-first CLI for patch proof bundles. The current
v0.1.0 package focuses on a stable executable entrypoint and explicit command
surface:

- `patchproof init`
- `patchproof run --run`
- `patchproof render`

The commands currently print placeholder messages while proof bundle scaffolding,
command receipt capture, and rendering are finalized. That limitation is useful
for a launch note: the package is ready for CLI surface smoke testing, not for
production proof bundle workflows.

## Suggested Post

Shipping the first public surface for `patchproof`: a local-first CLI aimed at
patch proof bundles and reviewer handoffs. v0.1.0 is intentionally narrow:
`init`, `run --run`, and `render` are wired as explicit placeholders so package
and release checks can verify the command surface before the bundle format
lands.

Try the smoke path:

```sh
npm install
npm run build
npm run smoke
```


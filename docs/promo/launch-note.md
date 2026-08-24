# Launch Note Draft

`patchproof` is an early local-first CLI for patch proof bundles. The current
v0.1.0 package focuses on a stable executable entrypoint and explicit command
surface:

- `patchproof init`
- `patchproof run --run`
- `patchproof render`

The commands currently fail with status `2` and actionable stderr while proof
bundle scaffolding, command receipt capture, and rendering are finalized. The
package is ready for CLI surface smoke testing, not proof bundle workflows.

## Suggested Post

Shipping the first public surface for `patchproof`: a local-first CLI aimed at
patch proof bundles and reviewer handoffs. v0.1.0 is intentionally narrow:
`init`, `run --run`, and `render` deliberately report that they are unavailable,
so automation cannot accept a no-op as proof before the bundle format lands.

Try the smoke path:

```sh
npm install
npm run build
npm run smoke
```

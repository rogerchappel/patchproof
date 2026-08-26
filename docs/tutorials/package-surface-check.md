# Package Surface Check

This recipe verifies the public command surface without claiming the proof
bundle workflow is complete.

## Build

```sh
npm install
npm run build
```

## Inspect

```sh
node dist/cli.js --help
node dist/cli.js --version
```

The help output should show:

```text
patchproof init
patchproof run --run
patchproof render
```

## Verify unavailable workflow commands

```sh
for command in "init" "run --run" "render"; do
  if node dist/cli.js $command; then
    echo "unexpected success: $command"
    exit 1
  fi
done
```

Each command exits with status `2` and explains on stderr that the capability
is unavailable. This prevents a package or downstream script from treating an
unimplemented no-op as a successful proof workflow.

## Guard the experimental run command

```sh
if node dist/cli.js run; then
  echo "unexpected success"
  exit 1
fi
```

`patchproof run` requires `--run` during this experimental phase.

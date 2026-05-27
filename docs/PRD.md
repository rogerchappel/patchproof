# patchproof PRD

Status: in-progress

## Summary

patchproof builds a local proof bundle for a patch: changed files, test commands, command receipts, risk notes, and a reviewer-facing Markdown summary. It is a practical "show your work" tool for agents and humans.

## Problem

Pull request descriptions and commit messages often claim tests were run, but the evidence is scattered through terminal scrollback. Agentic workflows need a deterministic way to attach what changed and what passed without relying on trust-me prose.

## Users

- Developers preparing a review handoff.
- Agents finishing a coding task.
- Maintainers auditing whether a local patch was verified.

## V1 Scope

- Inspect git diff metadata for changed files and stats.
- Run configured verification commands with timeouts.
- Store receipts under `.patchproof/`.
- Render `PATCH_PROOF.md` with commands, outcomes, risks, and changed-file summary.
- Provide `init`, `run`, and `render` commands.
- Include git fixture tests and a real smoke using a temporary repo.

## Non-Goals

- Remote CI replacement.
- Cryptographic signing.
- PR creation.

## Safety

- Requires explicit `--run` before executing configured commands.
- Prints command plan first.
- Redacts secret-looking environment values.

## Inspiration

Inspired by review checklists and build receipts, narrowed to a local proof file that agents can produce and maintainers can trust.

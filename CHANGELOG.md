# Changelog

All notable changes to this project will be documented in this file.

This project follows the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
format and uses semantic versioning when versioned releases are published.

## [Unreleased]

### Added

- Initial project setup.
- Package smoke now verifies the CLI surface example is included in the npm tarball.

### Fixed

- README checkout commands now point at the actual built CLI path.
- GitHub releases now reject mismatched tags, require one package artifact,
  and safely repair release notes and assets when a workflow is rerun.

## Release Links

- Unreleased:
  `https://github.com/rogerchappel/patchproof/compare/...HEAD`
- Latest release:
  `https://github.com/rogerchappel/patchproof/releases/latest`

Replace placeholder links once the first release tag exists.

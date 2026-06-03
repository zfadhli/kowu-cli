# Changelog

## [0.10.0] - 2026-06-03

### Added

- Native `logger` — configurable logging with info/success/warn/error/debug
  levels, symbol-prefixed output, and log-level filtering
- `createLogger(config?)` — factory for creating independent logger instances
  with custom levels and tags
- `.withTag(tag)` — create a child logger with a dimmed `[tag]` prefix for
  contextual output
- Logger example showing all levels, level filtering, and tagged loggers

[0.10.0]: https://github.com/zfadhli/kowu-cli/compare/v0.9.0...v0.10.0

## [0.9.0] - 2026-06-03

### Added

- `wrapWithSpinner(callback, text, color?)` — standalone function that wraps
  any async callback with an ora spinner, auto-succeeding on resolve and
  auto-failing on reject

### Changed

- Replaced hand-written `SpinnerAccessor` interface with a mapped type
  derived from `SPINNER_COLORS`, ensuring a single source of truth for
  color methods
- Tests now test `wrapWithSpinner` directly instead of reaching into cac's
  internal `commandAction` property, reducing coupling to upstream library
  internals

[0.9.0]: https://github.com/zfadhli/kowu-cli/compare/v0.8.0...v0.9.0

## [0.8.0] - 2026-06-03

### Changed

- Package now ships compiled output via tsdown — exports point to `dist/`
  instead of raw `src/`, enabling use without TypeScript

### Added

- GitHub Actions CI workflow — runs lint, typecheck, build, and test on
  every PR and push to main
- GitHub Actions publish workflow — automatically publishes to npm when
  a version tag is pushed
- tsdown build configuration for bundling TypeScript source

[0.8.0]: https://github.com/zfadhli/kowu-cli/compare/v0.7.0...v0.8.0

## [0.7.0] - 2026-06-03

### Added

- Boxen — wrapped `boxen` with success/error/warning/info preset methods
  for styled output boxes, matching the logSymbols color scheme
- New dependency: boxen for drawing styled boxes around terminal output
- Boxen example showing all presets and custom box configuration

[0.7.0]: https://github.com/zfadhli/kowu-cli/compare/v0.6.0...v0.7.0

## [0.6.0] - 2026-06-03

### Fixed

- User input example no longer exits silently when run without a subcommand;
  now defaults to the setup action
- Replaced conflicting auto-spinner with a manual spinner for the work phase
  to avoid terminal rendering conflicts with @clack/prompts

[0.6.0]: https://github.com/zfadhli/kowu-cli/compare/v0.5.0...v0.6.0

## [0.5.0] - 2026-06-03

### Added

- Log symbols — re-exported `log-symbols` with colored info/success/warning/error
  symbols for styled terminal output, pairs naturally with `color` (picocolors)
- New dependency: log-symbols for colored log-level symbols
- Log symbols example showing deploy simulation and symbol reference

[0.5.0]: https://github.com/zfadhli/kowu-cli/compare/v0.4.0...v0.5.0

## [0.4.0] - 2026-06-03

### Added

- Interactive user input — re-exported 20 prompt and utility functions from
  @clack/prompts, including text, select, confirm, intro, and more
- New dependency: @clack/prompts for interactive terminal prompts
- User input example showing text, select, confirm prompts with auto-spinners

[0.4.0]: https://github.com/zfadhli/kowu-cli/compare/v0.3.0...v0.4.0

## [0.3.0] - 2026-06-03

### Added

- Colored spinner frames — set the spinner color with `.spinner.yellow("text")`,
  `.spinner.red("text")`, and 7 other colors (default remains cyan)
- Re-exported `picocolors` as `color` — lightweight terminal text coloring
  for action callbacks

[0.3.0]: https://github.com/zfadhli/kowu-cli/compare/v0.2.0...v0.3.0

## [0.2.0] - 2026-06-03

### Added

- Rewrote README with comprehensive documentation, API reference, and usage guide
- Added focused runnable examples for args/options, subcommands, oraPromise, and error handling
- Configured Biome.js for consistent code formatting and linting
- Added full test suite (25 tests) covering commands, program, and re-exports

[0.2.0]: https://github.com/zfadhli/kowu-cli/compare/v0.1.0...v0.2.0

## [0.1.0] - 2026-06-03

### Added

- `program()` factory — wraps `cac()` and returns an enhanced CLI instance
- `.spinner(text)` — enables auto-spinner on any command; starts before the action,
  succeeds on resolve, fails on reject
- Re-exported `spinner()` and `oraPromise()` from `ora` for direct manual spinner control
- TypeScript types for all public APIs

[0.1.0]: https://github.com/zfadhli/kowu-cli/commits/v0.1.0

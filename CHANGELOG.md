# Changelog

## [0.13.1] - 2026-06-03

### Fixed

- `onInterrupt()` now uses a single reusable listener — calling it
  multiple times replaces the handler instead of adding duplicate
  listeners, allowing consumers to override the default exit handler
  set by `program()`

[0.13.1]: https://github.com/zfadhli/kowu-cli/compare/v0.13.0...v0.13.1

## [0.13.0] - 2026-06-03

### Added

- `clearLine()` — clears the current terminal line on stderr, for
  overwriting spinner or status output before writing a final message

### Fixed

- `onInterrupt(handler)` no longer calls `process.exit(130)` after the
  handler — the handler decides whether and when to exit, enabling
  two-phase graceful shutdown patterns

[0.13.0]: https://github.com/zfadhli/kowu-cli/compare/v0.12.0...v0.13.0

## [0.12.0] - 2026-06-03

### Added

- Optional file transport — `createLogger({ file: "app.log" })` appends
  plain-text log lines with timestamps to a file
- Injectable stdout/stderr — pass custom output functions via `stdout`
  and `stderr` options for testing or redirection

### Fixed

- `logger.level = "warn"` now correctly changes the log level at runtime

### Changed

- Reduced logger internal complexity — `write()` extracted into a closure,
  eliminating ~40 lines of parameter boilerplate

[0.12.0]: https://github.com/zfadhli/kowu-cli/compare/v0.11.0...v0.12.0

## [0.11.0] - 2026-06-03

### Added

- `onInterrupt()` — detects Ctrl+C via raw stdin, restores the terminal,
  and exits cleanly
- Automatic Ctrl+C handling — `program()` now calls `onInterrupt()`
  internally, so all kowu-cli scripts handle Ctrl+C without boilerplate

### Changed

- `logger.info()` now uses white text for better readability
- `ora-promise` example runs multiple spinners sequentially instead of
  concurrently to avoid ora's concurrent spinner warning

[0.11.0]: https://github.com/zfadhli/kowu-cli/compare/v0.10.1...v0.11.0

## [0.10.1] - 2026-06-03

### Added

- Exported `Logger`, `LogLevel`, and `LoggerConfig` types from the package
  barrel for use in consumer type annotations

[0.10.1]: https://github.com/zfadhli/kowu-cli/compare/v0.10.0...v0.10.1

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

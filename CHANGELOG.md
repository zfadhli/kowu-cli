# Changelog

## [0.5.0] - 2026-06-03

### Added

- Log symbols — re-exported `log-symbols` with colored info/success/warning/error
  symbols for styled terminal output, pairs naturally with `color` (picocolors)
- New dependency: log-symbols for colored log-level symbols
- Log symbols example showing deploy simulation and symbol reference

[0.5.0]: https://github.com/zfadhli/sado/compare/v0.4.0...v0.5.0

## [0.4.0] - 2026-06-03

### Added

- Interactive user input — re-exported 20 prompt and utility functions from
  @clack/prompts, including text, select, confirm, intro, and more
- New dependency: @clack/prompts for interactive terminal prompts
- User input example showing text, select, confirm prompts with auto-spinners

[0.4.0]: https://github.com/zfadhli/sado/compare/v0.3.0...v0.4.0

## [0.3.0] - 2026-06-03

### Added

- Colored spinner frames — set the spinner color with `.spinner.yellow("text")`,
  `.spinner.red("text")`, and 7 other colors (default remains cyan)
- Re-exported `picocolors` as `color` — lightweight terminal text coloring
  for action callbacks

[0.3.0]: https://github.com/zfadhli/sado/compare/v0.2.0...v0.3.0

## [0.2.0] - 2026-06-03

### Added

- Rewrote README with comprehensive documentation, API reference, and usage guide
- Added focused runnable examples for args/options, subcommands, oraPromise, and error handling
- Configured Biome.js for consistent code formatting and linting
- Added full test suite (25 tests) covering commands, program, and re-exports

[0.2.0]: https://github.com/zfadhli/sado/compare/v0.1.0...v0.2.0

## [0.1.0] - 2026-06-03

### Added

- `program()` factory — wraps `cac()` and returns an enhanced CLI instance
- `.spinner(text)` — enables auto-spinner on any command; starts before the action,
  succeeds on resolve, fails on reject
- Re-exported `spinner()` and `oraPromise()` from `ora` for direct manual spinner control
- TypeScript types for all public APIs

[0.1.0]: https://github.com/zfadhli/sado/commits/v0.1.0

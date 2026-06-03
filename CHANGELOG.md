# Changelog

## [0.1.0] - 2026-06-03

### Added

- `program()` factory — wraps `cac()` and returns an enhanced CLI instance
- `.spinner(text)` — enables auto-spinner on any command; starts before the action,
  succeeds on resolve, fails on reject
- Re-exported `spinner()` and `oraPromise()` from `ora` for direct manual spinner control
- TypeScript types for all public APIs

[0.1.0]: https://github.com/zfadhli/sado/commits/v0.1.0

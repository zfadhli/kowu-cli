#!/usr/bin/env bun
/**
 * sado example: error handling patterns.
 *
 * Demonstrates:
 *   1. Auto-spinner with failure (error thrown in action)
 *   2. Global try/catch around cli.parse()
 *   3. Deferred parsing with { run: false } + try/catch
 *   4. User-friendly error messages and exit codes
 *
 * Usage:
 *   bun run examples/error-handling.ts fetch       # succeeds
 *   bun run examples/error-handling.ts fail        # auto-spinner catches it
 *   bun run examples/error-handling.ts validate    # global error handler
 *   bun run examples/error-handling.ts unknown     # cac validation error
 */

import { program, spinner } from "../src/index.js";

const cli = program("sado-errors");

// ── Pattern 1: Auto-spinner handles async errors ────────────
// When .spinner() is set, sado wraps the action: on reject,
// the spinner shows "✖" with the error message, then re-throws.

cli
	.command("fetch", "Simulate a successful fetch")
	.spinner("Fetching...")
	.action(async () => {
		await new Promise((r) => setTimeout(r, 1000));
	});

cli
	.command("fail", "Simulate a failing operation")
	.spinner("Running risky task...")
	.action(async () => {
		await new Promise((r) => setTimeout(r, 800));
		throw new Error("Connection timeout after 800ms");
	});

// ── Pattern 2: Manual error handling with try/catch ─────────

cli.command("validate", "Run validations (may error)").action(async () => {
	// Manual spinner for partial progress
	const s = spinner("Validating...").start();
	await new Promise((r) => setTimeout(r, 500));

	// Simulate a condition that fails
	if (Math.random() > 0.3) {
		s.fail("Validation failed: checksum mismatch");
		process.exit(1);
	} else {
		s.succeed("All validations passed");
	}
});

// ═════════════════════════════════════════════════════════════
//  Global error handling
// ═════════════════════════════════════════════════════════════
// Option A: let cli.parse() handle errors (cac prints help + exits)
//
//   cli.parse()
//
// Option B: catch everything yourself (recommended for tools)
//
//   cli.parse(process.argv, { run: false })
//   // ... then try/catch around cli.runMatchedCommand()

try {
	// Defer execution so we can catch errors
	cli.parse(process.argv, { run: false });
} catch (err) {
	// This catches cac-level errors (unknown options, missing args, etc.)
	console.error(`\n  Configuration error: ${(err as Error).message}`);
	console.error("  Use --help to see available commands.\n");
	process.exit(1);
}

// Run the matched command manually within a try/catch
const matched = cli.matchedCommand;
if (matched) {
	try {
		await cli.runMatchedCommand();
	} catch (err) {
		// This catches runtime errors from actions
		const msg = (err as Error).message;
		console.error(`\n  ✖ Command "${matched.name}" failed: ${msg}\n`);
		process.exit(1);
	}
} else {
	// No command was matched — show help
	cli.outputHelp();
}

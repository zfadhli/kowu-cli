#!/usr/bin/env bun
/**
 * kowu-cli example: colored spinners and terminal text coloring.
 *
 * Demonstrates:
 *   1. `.spinner.<color>("text")` — set the spinner frame color
 *   2. `color.*` — re-exported picocolors for terminal text coloring
 *
 * The spinner color only affects the spinning icon (e.g. ⠋, ⠙).
 * Use `color.*` to colorize the text output in your action callbacks.
 *
 * Usage:
 *   bun run examples/color.ts build    # yellow spinner + green output
 *   bun run examples/color.ts deploy   # red spinner + warning text
 *   bun run examples/color.ts status   # default cyan spinner
 */

import { color, program } from "../src/index.js";

const cli = program("kowu-cli-colors");

// ── Colored spinner + colored output ────────────────────────

cli
	.command("build", "Build with a yellow spinner")
	.spinner.yellow("Building...")
	.action(async () => {
		await new Promise((r) => setTimeout(r, 1000));
		console.log(color.green("✓ Build succeeded"));
		console.log(color.dim("  3 modules compiled in 1.2s"));
	});

cli
	.command("deploy", "Deploy with a red spinner")
	.spinner.red("Deploying...")
	.action(async () => {
		await new Promise((r) => setTimeout(r, 800));
		console.log(color.yellow("⚠ Connection unstable, retrying..."));
		await new Promise((r) => setTimeout(r, 500));
		console.log(color.green("✓ Deploy completed"));
	});

// ── Default spinner color (cyan) ────────────────────────────

cli
	.command("status", "Default cyan spinner")
	.spinner("Checking status...")
	.action(async () => {
		await new Promise((r) => setTimeout(r, 600));
		console.log(color.cyan("All systems operational"));
	});

cli.version("1.0.0");
cli.help();
cli.parse();

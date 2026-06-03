#!/usr/bin/env bun
/**
 * kowu-cli example: interactive user input via @clack/prompts.
 *
 * Demonstrates text, select, and confirm prompt functions
 * re-exported from kowu-cli, used together with auto-spinners.
 *
 * Usage:
 *   bun run examples/user-input.ts
 *   bun run examples/user-input.ts --help
 */

function exitSafely(code = 0): never {
	process.stdout.write("\u001b[?25h");
	process.stdin.setRawMode?.(false);
	process.exit(code);
}

import {
	cancel,
	confirm,
	intro,
	isCancel,
	note,
	outro,
	program,
	select,
	spinner,
	text,
} from "../src/index.js";

// ── Interactive setup command ───────────────────────────────

const cli = program("kowu-cli-input");

cli.command("setup", "Run interactive project setup").action(async () => {
	intro("Project Setup");

	// ── Text prompt ──
	const name = await text({
		message: "What is your project name?",
		placeholder: "my-project",
		validate(value) {
			if (!value || value.length === 0) return "Project name is required!";
		},
	});
	if (isCancel(name)) {
		cancel("Cancelled");
		exitSafely();
	}

	// ── Select prompt ──
	const template = await select({
		message: "Pick a template",
		options: [
			{ value: "minimal", label: "Minimal", hint: "simple starter" },
			{ value: "standard", label: "Standard", hint: "recommended" },
			{ value: "enterprise", label: "Enterprise", hint: "full setup" },
		],
	});
	if (isCancel(template)) {
		cancel("Cancelled");
		exitSafely();
	}

	// ── Confirm prompt ──
	const install = await confirm({
		message: "Install dependencies?",
		active: "Yes",
		inactive: "No",
		initialValue: true,
	});
	if (isCancel(install)) {
		cancel("Cancelled");
		exitSafely();
	}

	// ── Manual spinner handles the work ──
	console.log(`  Project: ${name}`);
	console.log(`  Template: ${template}`);
	console.log(`  Install: ${install ? "yes" : "no"}`);

	// Simulate setup work with a manual spinner
	const s = spinner("Installing dependencies...").start();
	await new Promise((r) => setTimeout(r, 1500));
	s.succeed("Dependencies installed");

	outro("Setup complete!");
	note(`Created project "${name}" with ${template} template`, "Summary");
});

cli.command("quick", "Quick demo of all prompt types").action(async () => {
	intro("Quick Demo");

	const favorite = await text({
		message: "Favorite color?",
		initialValue: "blue",
	});
	if (isCancel(favorite)) exitSafely();

	const size = await select({
		message: "Size?",
		options: [
			{ value: "s", label: "Small" },
			{ value: "m", label: "Medium" },
			{ value: "l", label: "Large" },
		],
	});
	if (isCancel(size)) exitSafely();

	const ok = await confirm({ message: "All good?" });
	if (isCancel(ok)) exitSafely();

	if (ok) {
		outro(`You chose ${favorite} in size ${size}!`);
	} else {
		cancel("Maybe next time");
	}
});

cli.version("1.0.0");
cli.help();

// Run setup by default when no subcommand is given
if (!process.argv.slice(2).length) {
	process.argv.push("setup");
}
cli.parse();

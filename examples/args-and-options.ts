#!/usr/bin/env bun
/**
 * sado example: commands with arguments and options.
 *
 * Demonstrates positional arguments, option flags, and how
 * they interact with the auto-spinner pattern.
 *
 * Usage:
 *   bun run examples/args-and-options.ts greet --title Dr "Ada Lovelace"
 *   bun run examples/args-and-options.ts greet --caps "hello world"
 *   bun run examples/args-and-options.ts math:add 3.5 2.1
 *   bun run examples/args-and-options.ts math:add 3.5 2.1 --no-decimal
 *   bun run examples/args-and-options.ts add 1 2 3 4 5
 */

import { program } from "../src/index.js";

const cli = program("sado-demo");

// --- Command with positional argument and options ---
// Note: `.spinner()` must come *before* `.action()`.

cli
	.command("greet <name>", "Greet someone with an optional title")
	.option("--title <title>", "Honorific title (e.g. Dr, Prof)")
	.option("--caps", "Uppercase the greeting")
	.spinner("Preparing greeting...")
	.action((name: string, options: { title?: string; caps?: boolean }) => {
		let greeting = `Hello`;
		if (options.title) {
			greeting += `, ${options.title}`;
		}
		greeting += ` ${name}!`;
		if (options.caps) {
			greeting = greeting.toUpperCase();
		}
		console.log(greeting);
	});

// --- Command with multiple positional arguments ---

cli
	.command("math:add <a> <b>", "Add two numbers")
	.option("--no-decimal", "Output as integer")
	.spinner("Calculating...")
	.action((a: string, b: string, options: { decimal?: boolean }) => {
		const result = Number.parseFloat(a) + Number.parseFloat(b);
		if (options.decimal === false) {
			console.log(Math.round(result));
		} else {
			console.log(result);
		}
	});

// --- Command with variadic (rest) arguments ---
// Note: cac uses `<...name>` (dots before the name) for variadic args.

cli
	.command("add <...numbers>", "Sum any number of values")
	.spinner("Summing...")
	.action((numbers: string[]) => {
		const total = numbers.reduce((acc, n) => acc + Number.parseFloat(n), 0);
		console.log(total);
	});

// --- Shared config and parse ---
cli.version("1.0.0");
cli.help();
cli.parse();

#!/usr/bin/env bun
/**
 * sado example: styled log output with log-symbols and picocolors.
 *
 * Demonstrates info, success, warning, and error symbols
 * paired with color for styled terminal output.
 *
 * Usage:
 *   bun run examples/log-symbols.ts deploy
 *   bun run examples/log-symbols.ts show
 */

import { color, logSymbols, program } from "../src/index.js";

const cli = program("sado-log");

cli
	.command("deploy", "Simulate a deploy with styled logs")
	.spinner.cyan("Deploying...")
	.action(async () => {
		console.log(logSymbols.info, color.blue("Starting deployment..."));

		await new Promise((r) => setTimeout(r, 1500));

		console.log(logSymbols.success, color.green("Deployment complete!"));
		console.log(
			logSymbols.warning,
			color.yellow("Cache warming in progress..."),
		);
		console.log(
			logSymbols.error,
			color.red("Deprecation warning: v1 API will be removed"),
		);
	});

cli.command("show", "Show all log symbols").action(() => {
	console.log(logSymbols.info, color.blue("info — general information"));
	console.log(logSymbols.success, color.green("success — completed OK"));
	console.log(logSymbols.warning, color.yellow("warning — something to note"));
	console.log(logSymbols.error, color.red("error — something failed"));
});

cli.version("1.0.0");
cli.help();
cli.parse();

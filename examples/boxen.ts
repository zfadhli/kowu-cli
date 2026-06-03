#!/usr/bin/env bun
/**
 * sado example: styled boxes with boxen.
 *
 * Demonstrates preset methods (success, error, warning, info)
 * and custom box configuration.
 *
 * Usage:
 *   bun run examples/boxen.ts show
 *   bun run examples/boxen.ts custom
 */

import { boxen, program } from "../src/index.js";

const cli = program("sado-boxen");

cli
	.command("show", "Show all boxen presets")
	.action(() => {
		console.log(boxen.success("Deployment complete!"));
		console.log(boxen.error("Connection failed"));
		console.log(boxen.warning("Disk space low"));
		console.log(boxen.info("Server started on port 3000"));
	});

cli
	.command("custom", "Show a custom box")
	.action(() => {
		console.log(
			boxen("Custom box with double border", {
				borderStyle: "double",
				padding: 2,
				borderColor: "cyan",
			}),
		);
	});

cli.version("1.0.0");
cli.help();
cli.parse();

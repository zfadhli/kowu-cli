#!/usr/bin/env bun
/**
 * kowu-cli example: native logger with levels and tagging.
 *
 * Demonstrates info, success, warn, error, debug methods,
 * log level filtering, and tagged loggers.
 *
 * Usage:
 *   bun run examples/logger.ts
 *   bun run examples/logger.ts --silent
 *   bun run examples/logger.ts --tag db
 *   bun run examples/logger.ts file
 */

import { createLogger, program } from "../src/index.js";

const cli = program("kowu-cli-logger");

cli.command("all", "Show all log levels").action(() => {
	const logger = createLogger({ level: "debug" });

	logger.debug("This is debug — dimmed, verbose");
	logger.info("Server started on port 3000");
	logger.success("Deployment complete!");
	logger.warn("Disk space below 10%");
	logger.error("Connection refused", { retry: 3 });
});

cli.command("levels", "Show log level filtering").action(() => {
	const logger = createLogger({ level: "warn" });

	console.log("  Level: warn (info/debug suppressed)\n");

	logger.info("You should NOT see this");
	logger.success("You should NOT see this");
	logger.warn("You SHOULD see this");
	logger.error("You SHOULD see this");
});

cli.command("tagged", "Show tagged logger context").action(() => {
	const main = createLogger({ level: "debug" });

	main.info("Main process started");

	const db = main.withTag("db");
	db.info("Connected to database");
	db.success("Migration complete");

	const http = main.withTag("http");
	http.info("GET /api/users 200");
	http.warn("Rate limit at 80%");
	http.error("POST /api/order 503");
});

cli.command("file", "Show file transport").action(() => {
	const logFile = "/tmp/kowu-cli-example.log";
	const logger = createLogger({ level: "debug", file: logFile });

	logger.info(`This goes to console and ${logFile}`);
	logger.success("File transport works!");
	logger.warn("Check the file for plain-text logs");
	logger.error("Errors also go to the file");

	console.log(`\n  See: cat ${logFile}`);
});

cli.version("1.0.0");
cli.help();
cli.parse();

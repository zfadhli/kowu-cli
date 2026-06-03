#!/usr/bin/env bun
/**
 * sado example: subcommands and nested CLIs.
 *
 * Demonstrates colon-delimited subcommand names for building
 * tree-like CLI structures (e.g. `db:migrate`, `db:seed`).
 * This is how cac supports subcommands — the colon becomes a
 * natural grouping without needing separate CAC instances.
 *
 * Usage:
 *   bun run examples/subcommands.ts db:migrate initial_setup
 *   bun run examples/subcommands.ts db:migrate add_users --dry-run
 *   bun run examples/subcommands.ts db:seed users --count 50
 *   bun run examples/subcommands.ts db:seed products
 *   bun run examples/subcommands.ts db:status
 */

import { program, spinner } from "../src/index.js";

const cli = program("sado-subcommands");
let migrated = false;

// ── db:migrate ────────────────────────────────────────────────

cli
	.command("db:migrate <name>", "Run a database migration")
	.option("--dry-run", "Show SQL without executing")
	.spinner("Running migration...")
	.action((name: string, options: { dryRun?: boolean }) => {
		if (options.dryRun) {
			console.log(`[DRY-RUN] Would apply migration: ${name}`);
			return;
		}
		// Simulate migration
		console.log(`Applied migration: ${name}`);
		migrated = true;
	});

// ── db:seed ───────────────────────────────────────────────────

cli
	.command("db:seed <table>", "Seed a database table")
	.option("--count <n>", "Number of rows to insert", { default: "10" })
	.spinner("Seeding table...")
	.action((table: string, options: { count?: string }) => {
		const rows = Number.parseInt(options.count ?? "10", 10);
		console.log(`Seeded ${table} with ${rows} rows`);
	});

// ── db:status ────────────────────────────────────────────────

cli.command("db:status", "Show database state").action(() => {
	// Manual spinner for cases where you want conditional text
	migrated
		? spinner("Database ready").succeed("Database is up to date")
		: spinner("No migrations run").info("No migrations have been applied yet");
	console.log(`  Migrated: ${migrated}`);
});

// ── Root-level command ───────────────────────────────────────

cli.command("help", "Show available commands").action(() => {
	cli.outputHelp();
});

cli.version("1.0.0");
cli.help();
cli.parse();

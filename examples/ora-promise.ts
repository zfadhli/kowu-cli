#!/usr/bin/env bun
/**
 * kowu-cli example: using oraPromise for promise-based spinner control.
 *
 * `oraPromise` is a convenience utility re-exported from ora.
 * It wraps a promise (or a function that returns one) with a
 * spinner that succeeds on resolve and fails on reject.
 *
 * This is useful when you don't want to define a full CLI command
 * but still want spinner behaviour for ad-hoc async operations.
 *
 * Usage:
 *   bun run examples/ora-promise.ts
 */

import { onInterrupt, oraPromise } from "../src/index.js";

onInterrupt();

async function main() {
	// ── Basic: wrap an existing promise ─────────────────────────

	const fetchData = new Promise<string>((resolve) =>
		setTimeout(() => resolve("{ data: [1, 2, 3] }"), 1500),
	);

	const data = await oraPromise(fetchData, {
		text: "Fetching data...",
		successText: "Data received",
		failText: (err) => `Fetch failed: ${(err as Error).message}`,
	});
	console.log(`  Payload: ${data}`);

	// ── Async function (lazy evaluation) ─────────────────────────

	const processed = await oraPromise(
		async () => {
			await new Promise((r) => setTimeout(r, 1000));
			return "processed_ok";
		},
		{
			text: "Processing...",
			successText: "Processing complete",
		},
	);
	console.log(`  Result: ${processed}`);

	// ── Multiple spinners (sequential) ───────────────────────────
	// ora doesn't support concurrent spinners, so we run them
	// one at a time to avoid visual corruption.

	const a = await oraPromise(
		new Promise((r) => setTimeout(() => r("Task A done"), 800)),
		{ text: "Task A", successText: "A finished" },
	);
	const b = await oraPromise(
		new Promise((r) => setTimeout(() => r("Task B done"), 1200)),
		{ text: "Task B", successText: "B finished" },
	);
	const c = await oraPromise(
		new Promise((r) => setTimeout(() => r("Task C done"), 600)),
		{ text: "Task C", successText: "C finished" },
	);
	console.log(`  All tasks: ${a}, ${b}, ${c}`);

	// ── Failure case ─────────────────────────────────────────────

	try {
		await oraPromise(
			async () => {
				await new Promise((r) => setTimeout(r, 500));
				throw new Error("Intentional failure");
			},
			{
				text: "Running risky operation...",
				failText: "Operation failed",
			},
		);
	} catch (err) {
		console.log(`  Caught: ${(err as Error).message}`);
	}

	console.log("\nAll oraPromise examples completed.");
}

main().catch(console.error);

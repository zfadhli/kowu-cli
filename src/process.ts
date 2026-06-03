/**
 * Register a Ctrl+C handler that restores the terminal before
 * exiting. Uses raw stdin to detect the `\x03` byte — works
 * regardless of how the shell routes SIGINT.
 *
 * When called without a handler, the process exits with code 130
 * (128 + SIGINT). When a handler is provided, it is called instead
 * — the handler decides whether and when to exit, enabling patterns
 * like two-phase graceful shutdown.
 *
 * @param handler - Optional callback invoked on Ctrl+C. When
 *   omitted, the process exits with code 130.
 *
 * @example
 * import { onInterrupt } from 'kowu-cli'
 * onInterrupt() // exits immediately
 *
 * @example
 * onInterrupt(() => { /* custom cleanup, no auto-exit *\/ })
 */
export function onInterrupt(handler?: () => void): void {
	if (!process.stdin.isTTY) return;

	process.stdin.setRawMode(true);
	process.stdin.on("data", (data) => {
		if (data[0] !== 3) return;
		process.stdout.write("\u001b[?25h");
		process.stdin.setRawMode(false);
		if (handler) {
			handler();
		} else {
			process.exit(130);
		}
	});
	process.stdin.resume();
	process.stdin.unref();
}

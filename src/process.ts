/**
 * Register a Ctrl+C handler that restores the terminal before
 * exiting. Uses raw stdin to detect the `\x03` byte — works
 * regardless of how the shell routes SIGINT.
 *
 * If a custom handler is provided, it runs before the process
 * exits. The default behavior is to show the cursor and exit
 * with code 130 (128 + SIGINT).
 *
 * @param handler - Optional callback to run before exit.
 *
 * @example
 * import { onInterrupt } from 'kowu-cli'
 * onInterrupt(() => { cleanup() })
 */
export function onInterrupt(handler?: () => void): void {
	if (!process.stdin.isTTY) return;

	process.stdin.setRawMode(true);
	process.stdin.on("data", (data) => {
		if (data[0] !== 3) return;
		process.stdout.write("\u001b[?25h");
		process.stdin.setRawMode(false);
		handler?.();
		process.exit(130);
	});
	process.stdin.resume();
	process.stdin.unref();
}

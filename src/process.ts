let interruptHandler: (() => void) | undefined;
let interruptSetup = false;

/**
 * Register a Ctrl+C handler that restores the terminal before
 * exiting. Uses raw stdin to detect the `\x03` byte — works
 * regardless of how the shell routes SIGINT.
 *
 * Only one stdin listener is ever created. Calling onInterrupt()
 * multiple times replaces the handler without adding extra listeners.
 *
 * When called without a handler, the process exits with code 130
 * (128 + SIGINT). When a handler is provided, it is called instead
 * — the handler decides whether and when to exit, enabling patterns
 * like two-phase graceful shutdown.
 *
 * @param fn - Optional callback invoked on Ctrl+C. When omitted,
 *   the process exits with code 130.
 *
 * @example
 * import { onInterrupt } from 'kowu-cli'
 * onInterrupt() // exits immediately
 *
 * @example
 * program()            // calls onInterrupt() with default exit
 * onInterrupt(myHandler) // replaces the default handler
 */
export function onInterrupt(fn?: () => void): void {
	if (!process.stdin.isTTY) return;

	// Replace the handler (or set default)
	if (fn) {
		interruptHandler = fn;
	}
	if (!interruptHandler) {
		interruptHandler = () => process.exit(130);
	}

	// Only set up the stdin listener once
	if (interruptSetup) return;
	interruptSetup = true;

	process.stdin.setRawMode(true);
	process.stdin.on("data", (data) => {
		if (data[0] !== 3) return;
		process.stdout.write("\u001b[?25h");
		process.stdin.setRawMode(false);
		interruptHandler?.();
	});
	process.stdin.resume();
	process.stdin.unref();
}

/**
 * Clear the current terminal line using `\r\x1b[K`.
 * Useful for overwriting spinner or status output on stderr
 * before writing a final message on the same line.
 *
 * @param stream - Output stream (default: "stderr").
 *
 * @example
 * import { clearLine, color } from 'kowu-cli'
 * clearLine()
 * process.stderr.write(color.yellow("[!] Warning") + "\n")
 */
export function clearLine(stream: "stdout" | "stderr" = "stderr"): void {
	process[stream].write("\r\u001b[K");
}

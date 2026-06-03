import { appendFileSync } from "node:fs";
import logSymbols from "log-symbols";
import color from "picocolors";

export type LogLevel = "silent" | "error" | "warn" | "info" | "debug";

const LOG_LEVELS: Record<LogLevel, number> = {
	silent: 0,
	error: 1,
	warn: 2,
	info: 3,
	debug: 4,
};

export interface Logger {
	/**
	 * Current log level. Messages below this threshold are suppressed.
	 */
	level: LogLevel;

	/**
	 * Log an info message (blue).
	 */
	info: (message: string, ...args: unknown[]) => void;

	/**
	 * Log a success message (green).
	 */
	success: (message: string, ...args: unknown[]) => void;

	/**
	 * Log a warning message (yellow).
	 */
	warn: (message: string, ...args: unknown[]) => void;

	/**
	 * Log an error message (red). Writes to stderr.
	 */
	error: (message: string, ...args: unknown[]) => void;

	/**
	 * Log a debug message (dim). Suppressed at level `info` or above.
	 */
	debug: (message: string, ...args: unknown[]) => void;

	/**
	 * Create a child logger with a tagged prefix.
	 *
	 * @example
	 * const db = logger.withTag("db")
	 * db.info("Connected") // [db] ℹ Connected
	 */
	withTag: (tag: string) => Logger;
}

export interface LoggerConfig {
	level?: LogLevel;
	tag?: string;
	/** Optional file path to append log lines (plain text, no ANSI codes). */
	file?: string;
}

function write(
	method: "log" | "error",
	level: LogLevel,
	currentLevel: LogLevel,
	tag: string | undefined,
	symbol: string,
	message: string,
	colorFn: (text: string) => string,
	args: unknown[],
	file?: string,
	fileLabel?: string,
): void {
	if (LOG_LEVELS[level] > LOG_LEVELS[currentLevel]) return;

	const prefix = tag ? `${color.dim(`[${tag}]`)} ` : "";
	console[method](prefix + symbol, colorFn(message), ...args);

	if (file) {
		const label = fileLabel ?? level.toUpperCase();
		const plainTag = tag ? ` [${tag}]` : "";
		const ts = new Date().toISOString();
		const line = `${ts}${plainTag} ${label} ${message}\n`;
		try {
			appendFileSync(file, line);
		} catch {
			// ignore file write errors
		}
	}
}

/**
 * Create a configurable logger instance.
 *
 * @example
 * const logger = createLogger({ level: "info" })
 * logger.success("Done!")
 */
export function createLogger(config: LoggerConfig = {}): Logger {
	const level = config.level ?? "info";
	const tag = config.tag;
	const file = config.file;

	return {
		level,

		info(message: string, ...args: unknown[]) {
			write(
				"log",
				"info",
				level,
				tag,
				logSymbols.info,
				message,
				color.white,
				args,
				file,
				"INFO",
			);
		},

		success(message: string, ...args: unknown[]) {
			write(
				"log",
				"info",
				level,
				tag,
				logSymbols.success,
				message,
				color.green,
				args,
				file,
				"SUCCESS",
			);
		},

		warn(message: string, ...args: unknown[]) {
			write(
				"log",
				"warn",
				level,
				tag,
				logSymbols.warning,
				message,
				color.yellow,
				args,
				file,
				"WARN",
			);
		},

		error(message: string, ...args: unknown[]) {
			write(
				"error",
				"error",
				level,
				tag,
				logSymbols.error,
				message,
				color.red,
				args,
				file,
				"ERROR",
			);
		},

		debug(message: string, ...args: unknown[]) {
			write(
				"log",
				"debug",
				level,
				tag,
				"",
				message,
				color.dim,
				args,
				file,
				"DEBUG",
			);
		},

		withTag(newTag: string): Logger {
			return createLogger({ level, tag: newTag, file });
		},
	};
}

/**
 * Default logger instance at level `info`.
 *
 * @example
 * import { logger } from 'kowu-cli'
 * logger.success("Deployment complete!")
 */
export const logger: Logger = createLogger();

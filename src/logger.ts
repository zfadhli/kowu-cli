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
): void {
	if (LOG_LEVELS[level] > LOG_LEVELS[currentLevel]) return;

	const prefix = tag ? `${color.dim(`[${tag}]`)} ` : "";
	console[method](prefix + symbol, colorFn(message), ...args);
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
			);
		},

		debug(message: string, ...args: unknown[]) {
			write("log", "debug", level, tag, "", message, color.dim, args);
		},

		withTag(newTag: string): Logger {
			return createLogger({ level, tag: newTag });
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

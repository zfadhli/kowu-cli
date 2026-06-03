import { Command } from "cac";
import ora, { type Color } from "ora";

const SPINNER_COLORS = [
	"black",
	"red",
	"green",
	"yellow",
	"blue",
	"magenta",
	"cyan",
	"white",
	"gray",
] as const satisfies readonly Exclude<Color, boolean>[];

type SpinnerColor = (typeof SPINNER_COLORS)[number];

type SpinnerAccessor = ((text: string) => CoraCommand) & {
	[K in SpinnerColor]: (text: string) => CoraCommand;
};

/**
 * Wrap a callback with an ora spinner that starts before the action
 * and succeeds/fails on resolve/reject.
 */
// biome-ignore lint/suspicious/noExplicitAny: constraint for "any function" pattern
export function wrapWithSpinner<T extends (...args: any[]) => any>(
	callback: T,
	text: string,
	color?: Color,
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
	return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
		const spinner = ora({ text, color }).start();
		try {
			const result = await callback(...args);
			spinner.succeed();
			return result;
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : String(err);
			spinner.fail(message);
			throw err;
		}
	};
}

export class CoraCommand extends Command {
	private _spinnerText: string | undefined;
	private _spinnerColor: SpinnerColor | undefined;

	/**
	 * Enable auto-spinner for this command.
	 *
	 * Calling `.spinner("text")` creates a spinner with the default
	 * color (cyan). Calling `.spinner.yellow("text")` creates a spinner
	 * with a specific color. Available: black, red, green, yellow, blue,
	 * magenta, cyan, white, gray.
	 */
	get spinner(): SpinnerAccessor {
		const fn = ((text: string) => {
			this._spinnerText = text;
			this._spinnerColor = undefined;
			return this;
		}) as unknown as SpinnerAccessor;

		for (const color of SPINNER_COLORS) {
			fn[color] = (text: string) => {
				this._spinnerText = text;
				this._spinnerColor = color;
				return this;
			};
		}

		return fn;
	}

	/**
	 * Register a callback as the command action.
	 *
	 * If `.spinner("...")` or `.spinner.<color>("...")` was called on this
	 * command, the callback is automatically wrapped with an ora spinner
	 * that starts before the action and succeeds/fails on resolve/reject.
	 */
	override action(
		// biome-ignore lint/suspicious/noExplicitAny: matches cac's Command.action() signature
		callback: (...args: any[]) => any,
	): this {
		if (this._spinnerText) {
			return super.action(
				wrapWithSpinner(callback, this._spinnerText, this._spinnerColor),
			);
		}
		return super.action(callback);
	}
}

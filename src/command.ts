import { Command } from "cac";
import ora, { type Color } from "ora";

type SpinnerColor = Exclude<Color, boolean>;

const SPINNER_COLORS: SpinnerColor[] = [
	"black",
	"red",
	"green",
	"yellow",
	"blue",
	"magenta",
	"cyan",
	"white",
	"gray",
];

interface SpinnerAccessor {
	(text: string): CoraCommand;
	black(text: string): CoraCommand;
	red(text: string): CoraCommand;
	green(text: string): CoraCommand;
	yellow(text: string): CoraCommand;
	blue(text: string): CoraCommand;
	magenta(text: string): CoraCommand;
	cyan(text: string): CoraCommand;
	white(text: string): CoraCommand;
	gray(text: string): CoraCommand;
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
			const spinnerText = this._spinnerText;
			const spinnerColor = this._spinnerColor;
			// biome-ignore lint/suspicious/noExplicitAny: matches cac's variadic callback signature
			const wrappedCallback = async (...args: any[]) => {
				const spinner = ora({
					text: spinnerText,
					color: spinnerColor,
				}).start();
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
			return super.action(wrappedCallback);
		}
		return super.action(callback);
	}
}

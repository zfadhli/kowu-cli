import { CAC } from "cac";
import { CoraCommand } from "./command.js";
import { onInterrupt } from "./process.js";

interface CommandConfig {
	allowUnknownOptions?: boolean;
	ignoreOptionDefaultValue?: boolean;
}

class CoraCAC extends CAC {
	override command(
		rawName: string,
		description?: string,
		config?: CommandConfig,
	): CoraCommand {
		const command = new CoraCommand(rawName, description ?? "", config, this);
		command.globalCommand = this.globalCommand;
		this.commands.push(command);
		return command;
	}
}

/**
 * Create a CLI program.
 *
 * Thin wrapper around `cac()` that returns a CAC instance whose
 * `.command()` method returns `CoraCommand` instances with spinner support.
 *
 * @param name - The program name to display in help and version message.
 */
export function program(name?: string): CoraCAC {
	onInterrupt();
	return new CoraCAC(name);
}

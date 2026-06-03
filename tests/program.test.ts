import { describe, expect, it } from "bun:test";
import { CoraCommand } from "../src/command.js";
import { program } from "../src/program.js";

describe("program()", () => {
	it("returns a CLI instance", () => {
		const cli = program("my-app");
		expect(cli).toBeDefined();
		expect(cli.name).toBe("my-app");
	});

	it("defaults name to empty string", () => {
		const cli = program();
		expect(cli.name).toBe("");
	});

	describe("command()", () => {
		it("returns a CoraCommand", () => {
			const cli = program("my-app");
			const cmd = cli.command("build", "Build the project");
			expect(cmd).toBeInstanceOf(CoraCommand);
		});

		it("has .spinner() method on returned commands", () => {
			const cli = program("my-app");
			const cmd = cli.command("build", "Build the project");
			expect(cmd.spinner).toBeDefined();
			expect(typeof cmd.spinner).toBe("function");
		});

		it("registers commands on the CLI instance", () => {
			const cli = program("my-app");
			cli.command("build", "Build the project");
			cli.command("deploy", "Deploy to production");
			expect(cli.commands.length).toBe(2);
		});
	});

	describe("cac compatibility", () => {
		it("supports .option()", () => {
			const cli = program("my-app");
			const result = cli.option("--verbose", "Verbose output");
			expect(result).toBe(cli);
		});

		it("supports .version()", () => {
			const cli = program("my-app");
			const result = cli.version("1.0.0");
			expect(result).toBe(cli);
		});

		it("supports .help()", () => {
			const cli = program("my-app");
			const result = cli.help();
			expect(result).toBe(cli);
		});

		it("supports .usage()", () => {
			const cli = program("my-app");
			const result = cli.usage("<command> [options]");
			expect(result).toBe(cli);
		});

		it("command supports .option(), .alias(), .example()", () => {
			const cli = program("my-app");
			const cmd = cli
				.command("build <dir>", "Build the project")
				.option("--out <dir>", "Output directory")
				.alias("b")
				.example("my-app build src --out dist");

			expect(cmd.options.length).toBeGreaterThan(0);
			expect(cmd.aliasNames).toContain("b");
			expect(cmd.examples.length).toBe(1);
		});
	});

	describe("parse integration", () => {
		it("matches a command and runs its action", () => {
			const cli = program("test-cli");
			let ran = false;
			cli.command("hello", "Says hello").action(() => {
				ran = true;
			});

			cli.parse(["node", "test-cli", "hello"], { run: true });

			expect(ran).toBe(true);
		});

		it("forwards args and options to the action", () => {
			const cli = program("test-cli");
			const received: any[] = [];
			cli
				.command("greet <name>", "Greet someone")
				.option("--title <title>", "Title")
				.action((name: string, options: any) => {
					received.push(name, options);
				});

			cli.parse(["node", "test-cli", "greet", "Alice", "--title", "Ms."], {
				run: true,
			});

			expect(received[0]).toBe("Alice");
			expect(received[1]).toHaveProperty("title", "Ms.");
		});

		it("runs default command when no match", () => {
			const cli = program("test-cli");
			let ran = false;
			cli.command("[...files]", "Process files").action(() => {
				ran = true;
			});

			cli.parse(["node", "test-cli", "file1.txt", "file2.txt"], {
				run: true,
			});

			expect(ran).toBe(true);
		});
	});
});

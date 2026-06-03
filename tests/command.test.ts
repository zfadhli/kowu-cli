import { afterEach, describe, expect, it, mock } from "bun:test";

// --- Mock ora before any import that pulls it in ---

const mockOra = mock(
	(_options: { text?: string; color?: string }) => mockOraInstance,
);
const mockStart = mock(() => mockOraInstance);
const mockSucceed = mock(() => {});
const mockFail = mock((_msg: string) => {});

const mockOraInstance = {
	start: mockStart,
	succeed: mockSucceed,
	fail: mockFail,
};

mock.module("ora", () => ({
	default: mockOra,
}));

// --- Now import source (uses mocked ora) ---

import { CoraCommand } from "../src/command.js";

describe("CoraCommand", () => {
	afterEach(() => {
		mockOra.mockClear();
		mockStart.mockClear();
		mockSucceed.mockClear();
		mockFail.mockClear();
	});

	describe("spinner accessor", () => {
		it("returns this for chaining via default call", () => {
			const cmd = new CoraCommand("test", "desc", {}, null as any);
			const result = cmd.spinner("Loading...");
			expect(result).toBe(cmd);
		});

		it("returns this for chaining via color method", () => {
			const cmd = new CoraCommand("test", "desc", {}, null as any);
			const result = cmd.spinner.yellow("Loading...");
			expect(result).toBe(cmd);
		});

		it("exposes all spinner colors as methods", () => {
			const cmd = new CoraCommand("test", "desc", {}, null as any);
			const colors = [
				"black",
				"red",
				"green",
				"yellow",
				"blue",
				"magenta",
				"cyan",
				"white",
				"gray",
			] as const;
			for (const c of colors) {
				expect(typeof (cmd.spinner as any)[c]).toBe("function");
			}
		});
	});

	describe("action() without spinner()", () => {
		it("sets commandAction to the given callback", () => {
			const cmd = new CoraCommand("test", "desc", {}, null as any);
			const fn = () => "ok";
			cmd.action(fn);
			expect(cmd.commandAction).toBe(fn);
		});

		it("forwards arguments to the callback", () => {
			const cmd = new CoraCommand("test", "desc", {}, null as any);
			const fn = mock((a: string, b: number) => [a, b]);
			cmd.action(fn);
			const result = cmd.commandAction!("hello", 42);
			expect(fn).toHaveBeenCalledWith("hello", 42);
			expect(result).toEqual(["hello", 42]);
		});
	});

	describe("action() with spinner()", () => {
		it("wraps callback and calls ora({text}).start()", async () => {
			const cmd = new CoraCommand("test", "desc", {}, null as any);
			cmd.spinner("Working...");
			cmd.action(async () => "done");

			expect(cmd.commandAction).toBeDefined();

			const result = await cmd.commandAction!();

			expect(mockOra).toHaveBeenCalledWith({
				text: "Working...",
				color: undefined,
			});
			expect(mockStart).toHaveBeenCalled();
			expect(result).toBe("done");
		});

		it("calls succeed() on resolve", async () => {
			const cmd = new CoraCommand("test", "desc", {}, null as any);
			cmd.spinner("Working...");
			cmd.action(async () => "ok");

			await cmd.commandAction!();

			expect(mockSucceed).toHaveBeenCalled();
		});

		it("calls fail(msg) on reject and re-throws", async () => {
			const cmd = new CoraCommand("test", "desc", {}, null as any);
			cmd.spinner("Working...");
			cmd.action(async () => {
				throw new Error("boom");
			});

			await expect(cmd.commandAction!()).rejects.toThrow("boom");
			expect(mockFail).toHaveBeenCalledWith("boom");
		});

		it("forwards arguments through the wrapped callback", async () => {
			const cmd = new CoraCommand("test", "desc", {}, null as any);
			cmd.spinner("Working...");
			const fn = mock(async (x: string) => `hello ${x}`);
			cmd.action(fn);

			const result = await cmd.commandAction!("world");

			expect(fn).toHaveBeenCalledWith("world");
			expect(result).toBe("hello world");
		});

		it("does not wrap when spinner is not set", async () => {
			const cmd = new CoraCommand("test", "desc", {}, null as any);
			const fn = mock(async () => "raw");
			cmd.action(fn);

			await cmd.commandAction!();

			expect(mockOra).not.toHaveBeenCalled();
			expect(mockStart).not.toHaveBeenCalled();
		});

		it("passes the color to ora when using a color method", async () => {
			const cmd = new CoraCommand("test", "desc", {}, null as any);
			cmd.spinner.yellow("Colored spinner");
			cmd.action(async () => "ok");

			await cmd.commandAction!();

			expect(mockOra).toHaveBeenCalledWith({
				text: "Colored spinner",
				color: "yellow",
			});
		});

		it("passes undefined color for default .spinner(text) call", async () => {
			const cmd = new CoraCommand("test", "desc", {}, null as any);
			cmd.spinner("Default color");
			cmd.action(async () => "ok");

			await cmd.commandAction!();

			expect(mockOra).toHaveBeenCalledWith({
				text: "Default color",
				color: undefined,
			});
		});
	});
});

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

import { CoraCommand, wrapWithSpinner } from "../src/command.js";

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

	describe("wrapWithSpinner", () => {
		it("calls ora({text}).start() with given text", async () => {
			const fn = mock(async () => "done");
			const wrapped = wrapWithSpinner(fn, "Working...");

			await wrapped();

			expect(mockOra).toHaveBeenCalledWith({
				text: "Working...",
				color: undefined,
			});
			expect(mockStart).toHaveBeenCalled();
		});

		it("calls succeed() on resolve", async () => {
			const fn = mock(async () => "ok");
			const wrapped = wrapWithSpinner(fn, "Working...");

			await wrapped();

			expect(mockSucceed).toHaveBeenCalled();
		});

		it("calls fail(msg) on reject and re-throws", async () => {
			const fn = mock(async () => {
				throw new Error("boom");
			});
			const wrapped = wrapWithSpinner(fn, "Working...");

			await expect(wrapped()).rejects.toThrow("boom");
			expect(mockFail).toHaveBeenCalledWith("boom");
		});

		it("forwards arguments to the callback", async () => {
			const fn = mock(async (x: string) => `hello ${x}`);
			const wrapped = wrapWithSpinner(fn, "Working...");

			const result = await wrapped("world");

			expect(fn).toHaveBeenCalledWith("world");
			expect(result).toBe("hello world");
		});

		it("passes the color to ora when provided", async () => {
			const fn = mock(async () => "ok");
			const wrapped = wrapWithSpinner(fn, "Colored spinner", "yellow");

			await wrapped();

			expect(mockOra).toHaveBeenCalledWith({
				text: "Colored spinner",
				color: "yellow",
			});
		});

		it("returns the callback result", async () => {
			const fn = mock(async () => 42);
			const wrapped = wrapWithSpinner(fn, "Working...");

			const result = await wrapped();

			expect(result).toBe(42);
		});

		it("handles synchronous callbacks", async () => {
			const fn = mock(() => "sync");
			const wrapped = wrapWithSpinner(fn, "Working...");

			const result = await wrapped();

			expect(result).toBe("sync");
			expect(mockSucceed).toHaveBeenCalled();
		});
	});
});

import { describe, expect, it } from "bun:test";
import {
	CoraCommand,
	color,
	confirm,
	intro,
	isCancel,
	log,
	logSymbols,
	note,
	oraPromise,
	program,
	select,
	spinner,
	text,
} from "../src/index.js";

describe("exports", () => {
	it("exports program as a function", () => {
		expect(typeof program).toBe("function");
	});

	it("exports CoraCommand as a class", () => {
		// A class is typeof "function"
		expect(typeof CoraCommand).toBe("function");
	});

	it("exports spinner as a function", () => {
		expect(typeof spinner).toBe("function");
	});

	it("exports oraPromise as a function", () => {
		expect(typeof oraPromise).toBe("function");
	});

	it("exports color as an object with color functions", () => {
		expect(typeof color).toBe("object");
		expect(typeof color.red).toBe("function");
		expect(typeof color.green).toBe("function");
		expect(typeof color.bold).toBe("function");
	});

	it("exports logSymbols as an object with symbol strings", () => {
		expect(typeof logSymbols).toBe("object");
		expect(typeof logSymbols.info).toBe("string");
		expect(typeof logSymbols.success).toBe("string");
		expect(typeof logSymbols.warning).toBe("string");
		expect(typeof logSymbols.error).toBe("string");
	});

	describe("prompt re-exports from @clack/prompts", () => {
		it("exports text as a function", () => {
			expect(typeof text).toBe("function");
		});

		it("exports confirm as a function", () => {
			expect(typeof confirm).toBe("function");
		});

		it("exports select as a function", () => {
			expect(typeof select).toBe("function");
		});

		it("exports isCancel as a function", () => {
			expect(typeof isCancel).toBe("function");
		});

		it("exports intro as a function", () => {
			expect(typeof intro).toBe("function");
		});

		it("exports note as a function", () => {
			expect(typeof note).toBe("function");
		});

		it("exports log as an object with log methods", () => {
			expect(typeof log).toBe("object");
			expect(typeof log.info).toBe("function");
			expect(typeof log.success).toBe("function");
			expect(typeof log.error).toBe("function");
		});
	});
});

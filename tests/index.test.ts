import { describe, expect, it } from "bun:test";
import { CoraCommand, oraPromise, program, spinner } from "../src/index.js";

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
});

import { describe, expect, it } from "bun:test";
import {
	CoraCommand,
	color,
	oraPromise,
	program,
	spinner,
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
});

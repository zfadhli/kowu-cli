import {
	afterAll,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	mock,
} from "bun:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { createLogger } from "../src/logger.js";

describe("createLogger", () => {
	const mockLog = mock(() => {});
	const mockError = mock(() => {});

	afterEach(() => {
		mockLog.mockClear();
		mockError.mockClear();
	});

	// Replace console.log/error just for this test suite
	const originalLog = console.log;
	const originalError = console.error;

	beforeEach(() => {
		console.log = mockLog;
		console.error = mockError;
	});

	afterAll(() => {
		console.log = originalLog;
		console.error = originalError;
	});

	it("calls console.log for success()", () => {
		const logger = createLogger({ level: "debug" });
		logger.success("Done!");
		expect(mockLog).toHaveBeenCalledTimes(1);
	});

	it("calls console.log for info()", () => {
		const logger = createLogger({ level: "debug" });
		logger.info("Started");
		expect(mockLog).toHaveBeenCalledTimes(1);
	});

	it("calls console.log for warn()", () => {
		const logger = createLogger({ level: "debug" });
		logger.warn("Caution");
		expect(mockLog).toHaveBeenCalledTimes(1);
	});

	it("calls console.error for error()", () => {
		const logger = createLogger({ level: "debug" });
		logger.error("Failed");
		expect(mockError).toHaveBeenCalledTimes(1);
	});

	it("calls console.log for debug()", () => {
		const logger = createLogger({ level: "debug" });
		logger.debug("Verbose");
		expect(mockLog).toHaveBeenCalledTimes(1);
	});

	it("suppresses info and debug when level is warn", () => {
		const logger = createLogger({ level: "warn" });

		logger.info("should not appear");
		expect(mockLog).not.toHaveBeenCalled();

		logger.debug("should not appear");
		expect(mockLog).not.toHaveBeenCalled();

		logger.warn("should appear");
		expect(mockLog).toHaveBeenCalledTimes(1);
	});

	it("suppresses debug when level is info (default)", () => {
		const logger = createLogger();

		logger.debug("should not appear");
		expect(mockLog).not.toHaveBeenCalled();

		logger.info("should appear");
		expect(mockLog).toHaveBeenCalledTimes(1);
	});

	it("suppresses all output when level is silent", () => {
		const logger = createLogger({ level: "silent" });

		logger.info("no");
		logger.success("no");
		logger.warn("no");
		logger.error("no");
		logger.debug("no");

		expect(mockLog).not.toHaveBeenCalled();
		expect(mockError).not.toHaveBeenCalled();
	});

	it("forwards extra args to console.log", () => {
		const logger = createLogger({ level: "debug" });
		const extra = { key: "value" };
		logger.success("Done", extra);

		expect(mockLog).toHaveBeenCalledWith(
			expect.any(String),
			expect.any(String),
			extra,
		);
	});

	it("withTag creates a child logger", () => {
		const logger = createLogger({ level: "debug" });
		const tagged = logger.withTag("db");

		tagged.info("Connected");
		expect(mockLog).toHaveBeenCalledTimes(1);
	});

	it("tagged logger respects parent log level", () => {
		const logger = createLogger({ level: "warn" });
		const tagged = logger.withTag("db");

		tagged.info("should not appear");
		expect(mockLog).not.toHaveBeenCalled();

		tagged.warn("should appear");
		expect(mockLog).toHaveBeenCalledTimes(1);
	});

	it("level property returns the configured level", () => {
		const logger = createLogger({ level: "error" });
		expect(logger.level).toBe("error");
	});

	it("defaults level to info", () => {
		const logger = createLogger();
		expect(logger.level).toBe("info");
	});

	describe("file transport", () => {
		const tmpDir = mkdtempSync("/tmp/kowu-cli-test-");
		const logFile = join(tmpDir, "test.log");

		afterAll(() => {
			rmSync(tmpDir, { recursive: true, force: true });
		});

		it("writes to file with level prefix", () => {
			const logger = createLogger({ level: "debug", file: logFile });
			logger.info("Info message");
			logger.success("Success message");

			const content = readFileSync(logFile, "utf-8");
			expect(content).toContain("INFO Info message");
			expect(content).toContain("SUCCESS Success message");
		});

		it("writes tag prefix in file when provided", () => {
			const logger = createLogger({
				level: "debug",
				file: logFile,
				tag: "app",
			});
			logger.warn("Warning message");

			const content = readFileSync(logFile, "utf-8");
			expect(content).toContain("[app]");
			expect(content).toContain("WARN Warning message");
		});

		it("includes ISO timestamp in file output", () => {
			const logger = createLogger({ level: "debug", file: logFile });
			logger.info("Timestamp check");

			const content = readFileSync(logFile, "utf-8");
			// ISO format: 2026-06-03T...
			expect(content).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
		});

		it("does not write to file when level suppresses the message", () => {
			const logger = createLogger({ level: "error", file: logFile });
			logger.info("Should not appear");

			const content = readFileSync(logFile, "utf-8");
			expect(content).not.toContain("Should not appear");
		});

		it("child logger inherits file from parent", () => {
			const logger = createLogger({ level: "debug", file: logFile });
			const child = logger.withTag("child");
			child.info("Child message");

			const content = readFileSync(logFile, "utf-8");
			expect(content).toContain("[child]");
			expect(content).toContain("INFO Child message");
		});
	});
});

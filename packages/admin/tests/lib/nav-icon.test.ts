import { describe, expect, it } from "vitest";

import { parsePathIcon } from "../../src/lib/nav-icon.js";

describe("parsePathIcon", () => {
	it("normalizes a valid icon with Phosphor's viewBox by default", () => {
		expect(parsePathIcon({ path: "M0 0L10 10Z" })).toEqual({
			viewBox: "0 0 256 256",
			paths: ["M0 0L10 10Z"],
			activePaths: ["M0 0L10 10Z"],
			fillRule: "nonzero",
		});
	});

	it("uses activePath for the active state when given", () => {
		const icon = parsePathIcon({
			viewBox: "0 0 24 24",
			path: ["M1 1Z"],
			activePath: "M2 2Z",
			fillRule: "evenodd",
		});
		expect(icon?.activePaths).toEqual(["M2 2Z"]);
		expect(icon?.fillRule).toBe("evenodd");
	});

	it("rejects anything that isn't plain path data", () => {
		expect(parsePathIcon({ path: '"/><script>alert(1)</script>' })).toBeNull();
		expect(parsePathIcon({ path: "url(https://example.com/x.svg)" })).toBeNull();
		expect(parsePathIcon({ path: "" })).toBeNull();
		expect(parsePathIcon({ path: ["M0 0Z", 5] })).toBeNull();
		expect(parsePathIcon({ path: "M0 0Z", fillRule: "inherit" })).toBeNull();
		expect(parsePathIcon("calendar")).toBeNull();
	});

	it("rejects bad viewBoxes and oversized path data", () => {
		expect(parsePathIcon({ viewBox: "0 0 0 24", path: "M0 0Z" })).toBeNull();
		expect(parsePathIcon({ viewBox: "0 0 24", path: "M0 0Z" })).toBeNull();
		expect(parsePathIcon({ path: `M${"1 ".repeat(9000)}Z` })).toBeNull();
	});
});

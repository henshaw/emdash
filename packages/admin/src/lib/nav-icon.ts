/**
 * Icons a plugin can declare for its admin pages: a Phosphor icon name, or an
 * icon drawn from SVG path data in the current text color.
 */

export interface PathIcon {
	/** SVG viewBox. Defaults to Phosphor's grid. */
	viewBox?: string;
	/** Path data, filled with the current text color. */
	path: string | string[];
	/** Path data for the active state. Defaults to `path`. */
	activePath?: string | string[];
	fillRule?: "nonzero" | "evenodd";
}

export type NavIconSource = string | PathIcon;

export interface ParsedPathIcon {
	viewBox: string;
	paths: string[];
	activePaths: string[];
	fillRule: "nonzero" | "evenodd";
}

const DEFAULT_VIEW_BOX = "0 0 256 256";
/** Path commands, numbers, signs, separators and whitespace: nothing that can carry markup or URLs. */
const PATH_DATA = /^[MmZzLlHhVvCcSsQqTtAa0-9eE.,\s+-]+$/;
const VIEW_BOX_SEPARATOR = /[\s,]+/;
const MAX_PATH_DATA_LENGTH = 16 * 1024;

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toPathList(value: unknown): string[] | null {
	const list = typeof value === "string" ? [value] : Array.isArray(value) ? value : null;
	if (!list || list.length === 0) return null;
	const paths: string[] = [];
	for (const entry of list) {
		if (typeof entry !== "string") return null;
		const path = entry.trim();
		if (!path || !PATH_DATA.test(path)) return null;
		paths.push(path);
	}
	return paths;
}

function parseViewBox(value: unknown): string | null {
	if (value === undefined) return DEFAULT_VIEW_BOX;
	if (typeof value !== "string") return null;
	const numbers = value.trim().split(VIEW_BOX_SEPARATOR).map(Number);
	const [, , width = 0, height = 0] = numbers;
	if (numbers.length !== 4 || !numbers.every(Number.isFinite)) return null;
	return width > 0 && height > 0 ? numbers.join(" ") : null;
}

/** A valid path icon in normalized form, or null for anything else (including strings). */
export function parsePathIcon(value: unknown): ParsedPathIcon | null {
	if (!isRecord(value)) return null;
	const viewBox = parseViewBox(value.viewBox);
	const paths = toPathList(value.path);
	const activePaths = value.activePath === undefined ? [] : toPathList(value.activePath);
	if (!viewBox || !paths || !activePaths) return null;
	const length = [...paths, ...activePaths].reduce((total, path) => total + path.length, 0);
	if (length > MAX_PATH_DATA_LENGTH) return null;
	const fillRule = value.fillRule === undefined ? "nonzero" : value.fillRule;
	if (fillRule !== "nonzero" && fillRule !== "evenodd") return null;
	return {
		viewBox,
		paths,
		activePaths: activePaths.length > 0 ? activePaths : paths,
		fillRule,
	};
}

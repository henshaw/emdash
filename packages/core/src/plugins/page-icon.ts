import { z } from "zod";

/** Path commands, numbers, signs, separators and whitespace: nothing that can carry markup or URLs. */
const PATH_DATA = /^[MmZzLlHhVvCcSsQqTtAa0-9eE.,\s+-]+$/;
const MAX_PATH_DATA_LENGTH = 16 * 1024;

const pathData = z
	.string()
	.trim()
	.min(1)
	.regex(PATH_DATA, "Path data may contain only SVG path commands and numbers");
const pathList = z.union([pathData, z.array(pathData).min(1)]);

const viewBox = z.string().refine((value) => {
	const numbers = value
		.trim()
		.split(/[\s,]+/)
		.map(Number);
	return (
		numbers.length === 4 && numbers.every(Number.isFinite) && numbers[2]! > 0 && numbers[3]! > 0
	);
}, "viewBox must be four numbers with a positive width and height");

const pathLength = (value: string | string[] | undefined) =>
	value === undefined
		? 0
		: (typeof value === "string" ? [value] : value).reduce((total, path) => total + path.length, 0);

/** A plugin admin page icon: a Phosphor icon name, or SVG path data drawn in the current text color. */
export const pluginPageIconSchema = z.union([
	z.string(),
	z
		.object({
			viewBox: viewBox.optional(),
			path: pathList,
			activePath: pathList.optional(),
			fillRule: z.enum(["nonzero", "evenodd"]).optional(),
		})
		.strict()
		.refine(
			(icon) => pathLength(icon.path) + pathLength(icon.activePath) <= MAX_PATH_DATA_LENGTH,
			`An icon's path data may be at most ${MAX_PATH_DATA_LENGTH} characters`,
		),
]);

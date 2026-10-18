import type { PluginDescriptor, ResolvedPlugin } from "emdash";
import { definePlugin } from "emdash";

import { COYWOLF_ICON } from "./logo-path.js";

const pages = [
	{ path: "/features", label: "Features", icon: COYWOLF_ICON, group: "Coywolf Pack" },
	{ path: "/performance", label: "Performance", icon: "lightning", group: "Coywolf Pack" },
	{ path: "/redirects", label: "Redirects", icon: "path", group: "Coywolf Pack" },
];

const here = new URL(".", import.meta.url).pathname;

/** Prototype only: a plugin whose sidebar folder uses a custom path icon. */
export function iconDemoPlugin(): PluginDescriptor {
	return {
		id: "icon-demo",
		version: "0.0.0",
		entrypoint: `${here}index.ts`,
		adminEntry: `${here}admin.tsx`,
		adminPages: pages,
	};
}

export function createPlugin(): ResolvedPlugin {
	return definePlugin({
		id: "icon-demo",
		version: "0.0.0",
		admin: { entry: `${here}admin.tsx`, pages },
	});
}

export default createPlugin;

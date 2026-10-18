import type { PluginAdminExports } from "emdash";

function Page({ title }: { title: string }) {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-semibold">{title}</h1>
		</div>
	);
}

export const pages: PluginAdminExports["pages"] = {
	"/features": () => <Page title="Features" />,
	"/performance": () => <Page title="Performance" />,
	"/redirects": () => <Page title="Redirects" />,
};

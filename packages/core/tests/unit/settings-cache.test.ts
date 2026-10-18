import type { Kysely } from "kysely";
import { beforeEach, describe, it, expect, afterEach } from "vitest";

import type { Database } from "../../src/database/types.js";
import { runWithContext } from "../../src/request-context.js";
import {
	getSiteSettings,
	setSiteSettings,
	__setSiteSettingsCacheForTests,
	invalidateSiteSettingsCache,
} from "../../src/settings/index.js";
import { setupTestDatabaseWithCollections, teardownTestDatabase } from "../utils/test-db.js";

describe("site settings isolate cache", () => {
	let db: Kysely<Database>;

	beforeEach(async () => {
		db = await setupTestDatabaseWithCollections();
	});

	afterEach(async () => {
		await teardownTestDatabase(db);
		invalidateSiteSettingsCache();
	});

	it("bypasses the isolate cache during a route-cache fill", async () => {
		await setSiteSettings({ title: "Fresh" }, db);
		__setSiteSettingsCacheForTests({ title: "Stale" });

		const settings = await runWithContext({ editMode: false, db, routeCacheFill: true }, () =>
			getSiteSettings(),
		);

		expect(settings.title).toBe("Fresh");
	});

	it("uses the isolate cache outside of route-cache fills", async () => {
		await setSiteSettings({ title: "Fresh" }, db);
		__setSiteSettingsCacheForTests({ title: "Stale" });

		const settings = await runWithContext({ editMode: false, db }, () => getSiteSettings());

		expect(settings.title).toBe("Stale");
	});
});

import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { DATABASE_URL } from "$constants/index";
import { dirname } from "path";
import { mkdirSync } from "fs";

const dir = dirname(DATABASE_URL);
if (dir && dir !== "." && dir !== "") {
    try {
        mkdirSync(dir, { recursive: true });
    } catch (_) {}
}

export const sqlite = new Database(DATABASE_URL);
sqlite.exec("PRAGMA journal_mode = WAL;");
export const db = drizzle(sqlite);

export async function checkDB() {
    try {
        sqlite.query("SELECT 1").get();
        console.log("✅ Database connection verified");
        return true;
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        return false;
    }
}

export async function migrateDB() {
    try {
        await migrate(db, { migrationsFolder: "./drizzle" });
        console.log("✅ Database migration successful");
        return true;
    } catch (error) {
        const message = (error instanceof Error ? error.message.toLowerCase() : "") || "";

        if (message.includes("already exists") || message.includes("relation") && message.includes("already exists")) {
            console.warn("⚠️ Migration attempted to create existing table. Skipping...");
            return true;
        }

        console.error("❌ Database migration failed:", error);
        return false;
    }
}
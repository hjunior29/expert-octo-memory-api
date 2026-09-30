import { defineConfig } from "drizzle-kit";

export const DATABASE_URL = process.env.DATABASE_URL || "/data/expert.db";

export default defineConfig({
    dialect: "sqlite",
    schema: "./src/core/database/models.ts",
    out: "./drizzle",

    dbCredentials: {
        url: DATABASE_URL,
    },
});
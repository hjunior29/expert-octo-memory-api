import { DATABASE_URL } from "$constants/index";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/core/database/models.ts",
    out: "./drizzle",

    dbCredentials: {
        url: DATABASE_URL,
    },
});
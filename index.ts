import { startServer } from "$api/server";
import { checkDB, migrateDB } from "$core/database";

async function bootstrap() {
    console.log("🚀 Starting application...");

    try {
        const dbConnected = await checkDB();
        if (!dbConnected) {
            console.error("❌ Database connection failed. Exiting...");
            process.exit(1);
        }

        const migrationsApplied = await migrateDB();
        if (!migrationsApplied) {
            console.error("❌ Migrations failed. Exiting...");
            process.exit(1);
        }

        startServer();
    } catch (error) {
        console.error("❌ Critical error during startup:", error);
        process.exit(1);
    }
}

bootstrap();
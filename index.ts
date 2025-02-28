import { server } from "$api/server";
import { db } from "$core/database";

db.connect()
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.error("Failed to connect to database:", err);
        process.exit(1);
    });

console.log(`Server running at http://${server.hostname}:${server.port}`);

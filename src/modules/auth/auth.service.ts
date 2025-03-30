import { db } from "$core/database";
import { users } from "$core/database/models";
import { eq } from "drizzle-orm";

export class AuthService {
    async findByEmail(email: string) {
        const result = await db.select().from(users).where(eq(users.email, email));
        return result.length ? result[0] : null;
    }
}
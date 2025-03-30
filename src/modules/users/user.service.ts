import { db } from "$core/database";
import { users } from "$core/database/models";
import { eq, isNull } from "drizzle-orm";

export class UserService {
	async findAll() {
		return await db.select().from(users).where(isNull(users.deletedAt));
	}

	async findById(data: Partial<typeof users.$inferInsert>) {
		if (!data.id) return null;
		const result = await db.select().from(users).where(eq(users.id, data.id));
		return result.length ? result[0] : null;
	}

	async create(data: Partial<typeof users.$inferInsert>) {
		const result = await db
			.insert(users)
			.values(data)
			.returning();

		return result.length ? result[0] : null;
	}

	async update(data: Partial<typeof users.$inferInsert>) {
		if (!data.id) return null;

		const result = await db
			.update(users)
			.set(data)
			.where(eq(users.id, data.id))
			.returning();

		return result.length ? result[0] : null;
	}

	async delete(data: Partial<typeof users.$inferInsert>) {
		if (!data.id) return null;

		const result = await db
			.update(users)
			.set({ deletedAt: new Date() })
			.where(eq(users.id, data.id))
			.returning();

		return result.length ? result[0] : null;
	}
}
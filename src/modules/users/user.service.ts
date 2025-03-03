import { db } from "$core/database";
import { users } from "$core/database/models";
import { eq } from "drizzle-orm";

export class UserService {
	async findAll() {
		return await db.select().from(users);
	}

	async findById(id: number) {
		const result = await db.select().from(users).where(eq(users.id, id));
		return result.length ? result[0] : null;
	}

	async create(
		firstName: string,
		lastName: string,
		email: string,
		phoneNumber: string,
		hashedPassword: string
	) {
		const result = await db
			.insert(users)
			.values({ firstName, lastName, email, phoneNumber, hashedPassword })
			.returning();

		return result.length ? result[0] : null;
	}

	async update(
		id: number,
		updatedData: Partial<Omit<typeof users.$inferInsert, "id">>
	) {
		const result = await db
			.update(users)
			.set(updatedData)
			.where(eq(users.id, id))
			.returning();

		return result.length ? result[0] : null;
	}

	async delete(id: number) {
		const result = await db
			.update(users)
			.set({ deletedAt: new Date() })
			.where(eq(users.id, id))
			.returning();

		return result.length ? result[0] : null;
	}
}
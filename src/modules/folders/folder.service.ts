import { db } from "$core/database";
import { folders } from "$core/database/models";
import { eq, isNull } from "drizzle-orm";

export class FolderService {
    async findAll() {
        return await db.select().from(folders).where(isNull(folders.deletedAt));
    }

    async findById(id: number) {
        const result = await db.select().from(folders).where(eq(folders.id, id));
        return result.length ? result[0] : null;
    }

    async create(
        name: string,
        creatorId: number
    ) {
        const result = await db
            .insert(folders)
            .values({ name, creatorId })
            .returning();

        return result.length ? result[0] : null;
    }

    async update(
        id: number,
        updatedData: Partial<Omit<typeof folders.$inferInsert, "id">>
    ) {
        const result = await db
            .update(folders)
            .set(updatedData)
            .where(eq(folders.id, id))
            .returning();

        return result.length ? result[0] : null;
    }

    async delete(id: number) {
        const result = await db
            .update(folders)
            .set({ deletedAt: new Date() })
            .where(eq(folders.id, id))
            .returning();

        return result.length ? result[0] : null;
    }
}
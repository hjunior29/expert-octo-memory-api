import { db } from "$core/database";
import { folders, topics } from "$core/database/models";
import { eq, isNull } from "drizzle-orm";

export class FolderService {
    async findAll() {
        return await db.select().from(folders).where(isNull(folders.deletedAt));
    }

    async findById(data: Partial<typeof folders.$inferInsert>) {
        if (!data.id) return null;
        const result = await db.select().from(folders).where(eq(folders.id, data.id));
        return result.length ? result[0] : null;
    }

    async create(data: Partial<typeof folders.$inferInsert>) {
        const result = await db
            .insert(folders)
            .values(data)
            .returning();

        return result.length ? result[0] : null;
    }

    async update(data: Partial<typeof folders.$inferInsert>) {
        if (!data.id) return null;
        const result = await db
            .update(folders)
            .set(data)
            .where(eq(folders.id, data.id))
            .returning();

        return result.length ? result[0] : null;
    }

    async delete(data: Partial<typeof folders.$inferInsert>) {
        if (!data.id) return null;
        const result = await db
            .update(folders)
            .set({ deletedAt: new Date() })
            .where(eq(folders.id, data.id))
            .returning();

        return result.length ? result[0] : null;
    }

    async getFolderTopics(data: Partial<typeof folders.$inferInsert>) {
        if (!data.id) return null;
        return await db.select().from(topics).where(eq(topics.folderId, data.id));
    }
}
import { db } from "$core/database";
import { folders, topics } from "$core/database/models";
import { eq, isNull, and } from "drizzle-orm";

export class FolderService {
    async findAll(data: Partial<typeof folders.$inferInsert>) {
        if (!data.creatorId) return null;
        const result = await db
            .select()
            .from(folders)
            .where(
                and(
                    eq(folders.creatorId, data.creatorId),
                    isNull(folders.deletedAt)
                )
            );
        return result.length ? result : null;
    }

    async findById(data: Partial<typeof folders.$inferInsert>) {
        if (!data.id || !data.creatorId) return null;
        const result = await db
            .select()
            .from(folders)
            .where(
                and(
                    eq(folders.id, data.id),
                    eq(folders.creatorId, data.creatorId),
                    isNull(folders.deletedAt)
                )
            );
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
        if (!data.id || !data.creatorId) return null;
        const result = await db
            .select()
            .from(topics)
            .where(
                and(
                    eq(topics.folderId, data.id),
                    eq(topics.creatorId, data.creatorId),
                    isNull(topics.deletedAt)
                )
            );
        return result.length ? result : null;
    }
}
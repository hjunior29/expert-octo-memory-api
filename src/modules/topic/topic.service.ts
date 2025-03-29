import { db } from "$core/database";
import { flashcards, topics } from "$core/database/models";
import { eq, isNull, and } from "drizzle-orm";

export class TopicService {
    async findAll() {
        return await db.select().from(topics).where(isNull(topics.deletedAt));
    }

    async findById(data: Partial<typeof topics.$inferInsert>) {
        if (!data.id) return null;
        const result = await db.select().from(topics).where(eq(topics.id, data.id));
        return result.length ? result[0] : null;
    }

    async create(data: Partial<typeof topics.$inferInsert>) {
        const result = await db
            .insert(topics)
            .values(data)
            .returning();

        return result.length ? result[0] : null;
    }

    async update(data: Partial<typeof topics.$inferInsert>) {
        if (!data.id) return null;
        const result = await db
            .update(topics)
            .set(data)
            .where(eq(topics.id, data.id))
            .returning();

        return result.length ? result[0] : null;
    }

    async delete(data: Partial<typeof topics.$inferInsert>) {
        if (!data.id) return null;
        const result = await db
            .update(topics)
            .set({ deletedAt: new Date() })
            .where(eq(topics.id, data.id))
            .returning();

        return result.length ? result[0] : null;
    }

    async getTopicFlashcards(data: Partial<typeof topics.$inferInsert>) {
        if (!data.id) return null;

        return await db.select().from(flashcards).where(and(eq(flashcards.topicId, data.id), isNull(flashcards.deletedAt)));
    }
}
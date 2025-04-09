import { db } from "$core/database";
import { flashcards, topics } from "$core/database/models";
import { eq, isNull, and } from "drizzle-orm";

export class TopicService {
    async findAll(data: Partial<typeof topics.$inferInsert>) {
        if (!data.creatorId) return null;

        const result = await db
            .select()
            .from(topics)
            .where(
                and(
                    eq(topics.creatorId, data.creatorId),
                    isNull(topics.deletedAt)
                )
            );
        return result.length ? result : null;

    }

    async findById(data: Partial<typeof topics.$inferInsert>) {
        if (!data.id || !data.creatorId) return null;

        const result = await db
            .select()
            .from(topics)
            .where(
                and(
                    eq(topics.id, data.id),
                    eq(topics.creatorId, data.creatorId),
                    isNull(topics.deletedAt)
                )
            );
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
        if (!data.id || !data.creatorId) return null;

        const result = await db
            .select()
            .from(flashcards)
            .where(
                and(
                    eq(flashcards.topicId, data.id),
                    eq(flashcards.creatorId, data.creatorId),
                    isNull(flashcards.deletedAt)
                )
            );
        return result.length ? result : null;
    }

    async getTopicBySharedId(data: Partial<typeof topics.$inferInsert>) {
        if (!data.sharedId) return null;

        const result = await db
            .select()
            .from(topics)
            .where(
                and(
                    eq(topics.sharedId, data.sharedId),
                    isNull(topics.deletedAt)
                )
            );
        return result.length ? result[0] : null;
    }
}
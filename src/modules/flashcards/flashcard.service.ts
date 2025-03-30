import { db } from "$core/database";
import { flashcards } from "$core/database/models";
import { GeminiService } from "$modules/gemini/gemini.service";
import { eq, isNull, and } from "drizzle-orm";

export class FlashcardService {
    geminiService = new GeminiService();

    async findAll(data: Partial<typeof flashcards.$inferInsert>) {
        if (!data.creatorId) return null;
        const result = await db
            .select()
            .from(flashcards)
            .where(
                and(
                    eq(flashcards.creatorId, data.creatorId),
                    isNull(flashcards.deletedAt)
                )
            );
        return result.length ? result : null;
    }

    async findById(data: Partial<typeof flashcards.$inferInsert>) {
        if (!data.id || !data.creatorId) return null;
        const result = await db
            .select()
            .from(flashcards)
            .where(
                and(
                    eq(flashcards.id, data.id),
                    eq(flashcards.creatorId, data.creatorId),
                    isNull(flashcards.deletedAt)
                )
            );
        return result.length ? result[0] : null;
    }

    async create(data: Partial<typeof flashcards.$inferInsert>) {
        const result = await db
            .insert(flashcards)
            .values(data)
            .returning();

        return result.length ? result[0] : null;
    }

    async update(data: Partial<typeof flashcards.$inferInsert>) {
        if (!data.id) return null;
        const result = await db
            .update(flashcards)
            .set(data)
            .where(eq(flashcards.id, data.id))
            .returning();

        return result.length ? result[0] : null;
    }

    async delete(data: Partial<typeof flashcards.$inferInsert>) {
        if (!data.id) return null;
        const result = await db
            .update(flashcards)
            .set({ deletedAt: new Date() })
            .where(eq(flashcards.id, data.id))
            .returning();

        return result.length ? result[0] : null;
    }
}
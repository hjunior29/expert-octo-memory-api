import { db } from "$core/database";
import { flashcards } from "$core/database/models";
import { GeminiService } from "$modules/gemini/gemini.service";
import { eq, isNull } from "drizzle-orm";

export class FlashcardService {
    geminiService = new GeminiService();

    async findAll() {
        return await db.select().from(flashcards).where(isNull(flashcards.deletedAt));
    }

    async findById(data: Partial<typeof flashcards.$inferInsert>) {
        if (!data.id) return null;
        const result = await db.select().from(flashcards).where(eq(flashcards.id, data.id));
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
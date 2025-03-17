import { db } from "$core/database";
import { flashcards } from "$core/database/models";
import { GeminiService } from "$modules/gemini/gemini.service";
import { eq } from "drizzle-orm";

export class FlashcardService {
    geminiService = new GeminiService();

    async findAll() {
        return await db.select().from(flashcards);
    }

    async findById(id: number) {
        const result = await db.select().from(flashcards).where(eq(flashcards.id, id));
        return result.length ? result[0] : null;
    }

    async create(
        title: string,
        question: string,
        answer: string,
        folderId: number,
        tags: string[],
        difficulty: string,
        lastReviewed: Date,
        reviewCount: number
    ) {
        const result = await db
            .insert(flashcards)
            .values({ title, question, answer, folderId, tags, difficulty, lastReviewed, reviewCount })
            .returning();

        return result.length ? result[0] : null;
    }

    async update(
        id: number,
        updatedData: Partial<Omit<typeof flashcards.$inferInsert, "id">>
    ) {
        const result = await db
            .update(flashcards)
            .set(updatedData)
            .where(eq(flashcards.id, id))
            .returning();

        return result.length ? result[0] : null;
    }

    async delete(id: number) {
        const result = await db
            .update(flashcards)
            .set({ deletedAt: new Date() })
            .where(eq(flashcards.id, id))
            .returning();

        return result.length ? result[0] : null;
    }


    async generateFromFile(req: Request) {
        const { file } = await req.json();
        // Parse the file and generate flashcards
    }

    async generateFromLink(req: Request) {
        const { link } = await req.json();
        // Fetch the link and generate flashcards
    }

    async generateFromText(text: string) {
        return this.geminiService.generateFlashcardsFromText(text);
    }

    async generateFromTopic(req: Request) {
        const { topic } = await req.json();
        // Fetch data from the topic and generate flashcards
    }
}
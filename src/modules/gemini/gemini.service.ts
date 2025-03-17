import { GeminiClient } from "./gemini.client";
import { prompts } from "$constants/index";
import type { FlashcardGenerate } from "$modules/flashcards/flashcard.model";

export class GeminiService {
    client = new GeminiClient();

    async generateFlashcardsFromText(flashcard: FlashcardGenerate) {
        const prompt = await prompts.generateFlashcardsFromText + flashcard.text;
        return await this.client.generateFlashcard(prompt);
    }

    async generateFlashcardsFromLink(flashcard: FlashcardGenerate) {
        const prompt = await prompts.generateFlashcardsFromLink + flashcard.link;
        return await this.client.generateFlashcard(prompt);
    }
}; 
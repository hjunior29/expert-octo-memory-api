import { prompts } from "$constants/index";
import { GeminiClient } from "./gemini.client";

export class GeminiService {
    async generateFlashcardsFromText(text: string) {
        const prompt = await prompts.generateFlashcardsFromText + text;
        const client = new GeminiClient();
        return await client.generateContent(prompt);
    }
}; 
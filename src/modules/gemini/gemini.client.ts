import { GEMINI_API_KEY } from "$constants/index";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
});

export class GeminiClient {

    async generateFlashcard(prompt: string) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash-001",
                contents: prompt,
            });

            if (response.text) {
                try {
                    let cleanText = response.text.trim();

                    if (cleanText.startsWith("```json") && cleanText.endsWith("```")) {
                        cleanText = cleanText.slice(7, -3).trim();
                    } else if (cleanText.startsWith("```") && cleanText.endsWith("```")) {
                        cleanText = cleanText.slice(3, -3).trim();
                    }

                    return JSON.parse(cleanText);
                } catch (parseError) {
                    console.error("Error parsing JSON from Gemini response:", parseError);
                    return { error: "Invalid JSON response", rawResponse: response.text };
                }
            }

            return { error: "No response received." };
        } catch (error) {
            console.error("Error calling Gemini:", error);
            return { error: "Error processing request." };
        }
    }
}
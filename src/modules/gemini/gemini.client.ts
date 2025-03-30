import { GEMINI_API_KEY } from "$constants/index";
import type { FlashcardGenerate } from "$modules/flashcards/flashcard.model";
import { UtilsService } from "$modules/utils/utils.service";
import { createPartFromUri, GoogleGenAI, type Part } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
});

export class GeminiClient {
    private readonly utilsService = new UtilsService();

    async generateFlashcard(prompt: string, files?: FlashcardGenerate["files"], link?: FlashcardGenerate["link"]) {
        const fileParts: Part[] = [];
        const linkParts: Part[] = [];
        try {
            if (files && files.length > 0) {
                const fileData = files[0];
                const mimeTypeMatch = /^data:(.+);base64/.exec(fileData.base64);
                const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "application/octet-stream";
                const uploadedFile = await ai.files.upload({
                    file: this.utilsService.base64ToFile(fileData.base64, fileData.name),
                    config: { mimeType },
                });
                fileParts.push(createPartFromUri(uploadedFile.uri ?? "", uploadedFile.mimeType ?? "application/octet-stream"));
            }
            if (link) {
                if (link.includes("youtube.com") || link.includes("youtu.be")) {
                    const youtubeVideo = createPartFromUri(link, "video/*");
                    linkParts.push(youtubeVideo);
                }
            }

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: [
                    ...fileParts || [],
                    ...linkParts || [],
                    "\n\n",
                    prompt
                ],
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
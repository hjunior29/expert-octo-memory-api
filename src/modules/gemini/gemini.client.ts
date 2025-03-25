import { GEMINI_API_KEY } from "$constants/index";
import type { FlashcardGenerate } from "$modules/flashcards/flashcard.model";
import { UtilsService } from "$modules/utils/utils.service";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
});

export class GeminiClient {
    private readonly utilsService = new UtilsService();

    async generateFlashcard(prompt: string, files?: FlashcardGenerate["files"]) {
        try {
            const fileParts = [];

            if (files && files.length > 0) {
                for (const file of files) {
                    const uploadedFile = await this.uploadBase64File(file);
                    if (uploadedFile) {
                        fileParts.push(this.createPartFromUri(uploadedFile.uri ?? "", uploadedFile.mimeType ?? "application/octet-stream"));
                    }
                }
            }

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash-001",
                contents: [...fileParts, "\n\n", prompt],
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

    private async uploadBase64File(file: { name: string, base64: string }) {
        try {
            const [header, base64Data] = file.base64.split(",");
            const regex = /:(.*?);/;
            const mimeMatch = regex.exec(header);
            const mimeType = mimeMatch ? mimeMatch[1] : "application/octet-stream";
            const buffer = Buffer.from(base64Data, "base64");

            const uploadedFile = await ai.files.upload({
                file: new Blob([buffer], { type: mimeType }),
                config: { mimeType: mimeType },
            });

            console.log(`Uploaded file: ${file.name} -> ${uploadedFile.uri}`);

            return uploadedFile;
        } catch (error) {
            console.error(`Error uploading file ${file.name}:`, error);
            return null;
        }
    }

    private createPartFromUri(uri: string, mimeType: string): { text: string, uri: string, mimeType: string } {
        return { text: "", uri, mimeType };
    }
}
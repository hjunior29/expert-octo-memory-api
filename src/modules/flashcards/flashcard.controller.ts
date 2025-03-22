import { GeminiService } from "$modules/gemini/gemini.service";
import type { Flashcard, FlashcardGenerate } from "./flashcard.model";
import { FlashcardService } from "./flashcard.service";

export class FlashcardController {
    private flashcardService = new FlashcardService();
    private geminiService = new GeminiService();

    getAllFlashcards = async () => {
        const flashcards = await this.flashcardService.findAll();
        return new Response(JSON.stringify(flashcards), {
            headers: { "Content-Type": "application/json" },
        });
    };

    getFlashcard = async (req: Request & { params: { id: string } }) => {
        const id = Number(req.params.id);

        const flashcard = await this.flashcardService.findById(id);
        return flashcard
            ? new Response(JSON.stringify(flashcard), {
                headers: { "Content-Type": "application/json" },
            })
            : new Response("Flashcard not found", { status: 404 });
    };

    createFlashcard = async (req: Request) => {
        const { title, question, answer, folderId, tags, difficulty, lastReviewed, reviewCount } = await req.json();

        const flashcard = await this.flashcardService.create(
            title,
            question,
            answer,
            folderId,
            tags,
            difficulty,
            lastReviewed,
            reviewCount
        );
        return new Response(JSON.stringify(flashcard), {
            headers: { "Content-Type": "application/json" },
            status: 201,
        });
    };


    createFlashcardsBatch = async (flashcards: Flashcard[], folderId: number) => {
        if (!Array.isArray(flashcards) || flashcards.length === 0) {
            return new Response(JSON.stringify({ error: "Invalid input: must be a non-empty array" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const createdFlashcards = [];
        for (const f of flashcards) {
            const created = await this.flashcardService.create(
                f.title, f.question, f.answer, folderId, f.tags, f.difficulty, f.lastReviewed, f.reviewCount
            );
            createdFlashcards.push(created);
        }

        return new Response(JSON.stringify(createdFlashcards), {
            headers: { "Content-Type": "application/json" },
            status: 201,
        });
    };

    updateFlashcard = async (req: Request & { params: { id: string } }) => {
        const id = Number(req.params.id);

        const updatedData = await req.json();
        const updatedFlashcard = await this.flashcardService.update(id, updatedData);
        return updatedFlashcard
            ? new Response(JSON.stringify(updatedFlashcard), {
                headers: { "Content-Type": "application/json" },
            })
            : new Response("Flashcard not found", { status: 404 });
    };

    deleteFlashcard = async (req: Request & { params: { id: string } }) => {
        const id = Number(req.params.id);

        const deleted = await this.flashcardService.delete(id);
        return deleted
            ? new Response("Flashcard deleted successfully", { status: 200 })
            : new Response("Flashcard not found", { status: 404 });
    };

    generateFlashcardsFromText = async (req: Request & { params: { folderId: string } }) => {
        const folderId = Number(req.params.folderId);
        const flashcardGenerate: FlashcardGenerate = await req.json();

        if (!flashcardGenerate.text || !folderId) {
            return new Response(JSON.stringify({ error: "Missing fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const flashcards = await this.geminiService.generateFlashcardsFromText(flashcardGenerate);

        if (!flashcards.valid) {
            return new Response(JSON.stringify({ error: "Invalid flascards" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        return await this.createFlashcardsBatch(flashcards.flashcards, folderId);
    };

    generateFlashcardsFromLink = async (req: Request) => {
        try {
            const flashcardGenerate: FlashcardGenerate = await req.json();
            if (!flashcardGenerate.link) {
                return new Response(JSON.stringify({ error: "Missing 'link' field" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }

            const flashcards = await this.geminiService.generateFlashcardsFromLink(flashcardGenerate);

            return new Response(JSON.stringify(flashcards), {
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Erro ao processar JSON:", error);
            return new Response(JSON.stringify({ error: "Invalid JSON format" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
    };

    generateFlashcardsFromTopic = async (req: Request) => {
        try {
            const flashcardGenerate: FlashcardGenerate = await req.json();
            if (!flashcardGenerate.text) {
                return new Response(JSON.stringify({ error: "Missing 'text' field" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }

            const flashcards = await this.geminiService.generateFlashcardsFromText(flashcardGenerate);

            return new Response(JSON.stringify(flashcards), {
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Erro ao processar JSON:", error);
            return new Response(JSON.stringify({ error: "Invalid JSON format" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
    };

    generateFlashcardsFromFile = async (req: Request) => {
        try {
            const flashcardGenerate: FlashcardGenerate = await req.json();
            if (!flashcardGenerate.text) {
                return new Response(JSON.stringify({ error: "Missing 'text' field" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }

            const flashcards = await this.geminiService.generateFlashcardsFromText(flashcardGenerate);

            return new Response(JSON.stringify(flashcards), {
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Erro ao processar JSON:", error);
            return new Response(JSON.stringify({ error: "Invalid JSON format" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
    };
}
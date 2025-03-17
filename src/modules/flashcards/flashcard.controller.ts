import { FlashcardService } from "./flashcard.service";

export class FlashcardController {
    private flashcardService = new FlashcardService();

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

    generateFlashcardsFromFile = async (req: Request) => {
        const { file } = await req.json();

        const flashcards = await this.flashcardService.generateFromFile(file);
        return new Response(JSON.stringify(flashcards), {
            headers: { "Content-Type": "application/json" },
        });
    };

    generateFlashcardsFromLink = async (req: Request) => {
        const { link } = await req.json();

        const flashcards = await this.flashcardService.generateFromLink(link);
        return new Response(JSON.stringify(flashcards), {
            headers: { "Content-Type": "application/json" },
        });
    };

    generateFlashcardsFromText = async (req: Request) => {
        try {
            const { text } = await req.json();
            if (!text) {
                return new Response(JSON.stringify({ error: "Missing 'text' field" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }

            const flashcards = await this.flashcardService.generateFromText(text);

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
        const { topic } = await req.json();

        const flashcards = await this.flashcardService.generateFromTopic(topic);
        return new Response(JSON.stringify(flashcards), {
            headers: { "Content-Type": "application/json" },
        });
    };
}
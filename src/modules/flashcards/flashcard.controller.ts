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
}
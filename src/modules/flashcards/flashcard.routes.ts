import { FlashcardController } from "./flashcard.controller";

const flashcardController = new FlashcardController();

export const flashcardRoutes = {
    "/api/flashcards": {
        GET: (req: Request) => flashcardController.getAllFlashcards(req as Request & { user: { id: number } }),
        POST: (req: Request) => flashcardController.createFlashcard(req as Request & { user: { id: number } })
    },
    "/api/flashcards/:id": {
        GET: (req: Request) => flashcardController.getFlashcard(req as Request & { params: { id: string }, user: { id: number } }),
        PUT: (req: Request) => flashcardController.updateFlashcard(req as Request & { params: { id: string } }),
        DELETE: (req: Request) => flashcardController.deleteFlashcard(req as Request & { params: { id: string } }),
    },
    "/api/flashcards/generate/text/:folderId": {
        POST: (req: Request) => flashcardController.generateFlashcardsFromText(req as Request & { params: { folderId: number }, user: { id: number } })
    },
    "/api/flashcards/generate/link/:folderId": {
        POST: (req: Request) => flashcardController.generateFlashcardsFromLink(req as Request & { params: { folderId: number }, user: { id: number } })
    },
    "/api/flashcards/generate/topic/:folderId": {
        POST: (req: Request) => flashcardController.generateFlashcardsFromTopic(req as Request & { params: { folderId: number }, user: { id: number } })
    },
    "/api/flashcards/generate/file/:folderId": {
        POST: (req: Request) => flashcardController.generateFlashcardsFromFile(req as Request & { params: { folderId: number }, user: { id: number } })
    },
};
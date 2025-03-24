import { FlashcardController } from "./flashcard.controller";

const flashcardController = new FlashcardController();

export const flashcardRoutes = {
    "/api/flashcards": {
        GET: (req: Request) => flashcardController.getAllFlashcards(),
        POST: (req: Request) => flashcardController.createFlashcard(req)
    },
    "/api/flashcards/:id": {
        GET: (req: Request) => flashcardController.getFlashcard(req as Request & { params: { id: string } }),
        PUT: (req: Request) => flashcardController.updateFlashcard(req as Request & { params: { id: string } }),
        DELETE: (req: Request) => flashcardController.deleteFlashcard(req as Request & { params: { id: string } }),
    },
    "/api/flashcards/generate/text/:folderId": {
        POST: (req: Request) => flashcardController.generateFlashcardsFromText(req as Request & { params: { folderId: number } })
    },
    "/api/flashcards/generate/link": {
        POST: (req: Request) => flashcardController.generateFlashcardsFromLink(req)
    },
    "/api/flashcards/generate/topic": {
        POST: (req: Request) => flashcardController.generateFlashcardsFromTopic(req)
    },
    "/api/flashcards/generate/file": {
        POST: (req: Request) => flashcardController.generateFlashcardsFromFile(req)
    },
};
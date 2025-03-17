import { FlashcardController } from "./flashcard.controller";

const flashcardController = new FlashcardController();

export const flashcardRoutes = {
    "/api/flashcards": {
        GET: (req: Request) => flashcardController.getAllFlashcards(),
        POST: (req: Request) => flashcardController.createFlashcard(req)
    },
    "/api/flashcards/batch": {
        POST: (req: Request) => flashcardController.createFlashcardsBatch(req)
    },
    "/api/flashcards/:id": {
        GET: (req: Request) => flashcardController.getFlashcard(req as Request & { params: { id: string } }),
        PUT: (req: Request) => flashcardController.updateFlashcard(req as Request & { params: { id: string } }),
        DELETE: (req: Request) => flashcardController.deleteFlashcard(req as Request & { params: { id: string } }),
    },
    "/api/flashcards/generate/file": {
        POST: (req: Request) => flashcardController.generateFlashcardsFromFile(req)
    },
    "/api/flashcards/generate/link": {
        POST: (req: Request) => flashcardController.generateFlashcardsFromLink(req)
    },
    "/api/flashcards/generate/text": {
        POST: (req: Request) => flashcardController.generateFlashcardsFromText(req)
    },
    "/api/flashcards/generate/topic": {
        POST: (req: Request) => flashcardController.generateFlashcardsFromTopic(req)
    }
};
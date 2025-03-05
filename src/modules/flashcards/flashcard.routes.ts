import { FlashcardController } from "./flashcard.controller";

const userController = new FlashcardController();

export const userRoutes = {
    "/api/flashcards": {
        GET: (req: Request) => userController.getAllFlashcards(),
        POST: (req: Request) => userController.createFlashcard(req)
    },
    "/api/flashcards/:id": {
        GET: (req: Request) => userController.getFlashcard(req as Request & { params: { id: string } }),
        PUT: (req: Request) => userController.updateFlashcard(req as Request & { params: { id: string } }),
        DELETE: (req: Request) => userController.deleteFlashcard(req as Request & { params: { id: string } }),
    },
};
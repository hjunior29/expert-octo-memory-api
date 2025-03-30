import { TopicController } from "./topic.controller";

const topicController = new TopicController();

export const topicRoutes = {
    "/api/topics": {
        GET: (req: Request) => topicController.getAllTopics(req as Request & { user: { id: number } }),
        POST: (req: Request) => topicController.createTopic(req as Request & { user: { id: number } })
    },
    "/api/topics/:id": {
        GET: (req: Request) => topicController.getTopic(req as Request & { params: { id: string }, user: { id: number } }),
        PUT: (req: Request) => topicController.updateTopic(req as Request & { params: { id: string } }),
        DELETE: (req: Request) => topicController.deleteTopic(req as Request & { params: { id: string } }),
    },
    "/api/topics/:id/flashcards": {
        GET: (req: Request) => topicController.getTopicFlashcards(req as Request & { params: { id: string }, user: { id: number } }),
    },
};
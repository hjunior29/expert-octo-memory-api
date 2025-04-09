import { UtilsService } from "$modules/utils/utils.service";
import { TopicService } from "./topic.service";

export class TopicController {
    private readonly utilsService = new UtilsService();
    private readonly topicService = new TopicService();

    getAllTopics = async (req: Request & { user: { id: number } }) => {
        const creatorId = req.user.id;

        if (!creatorId) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const topics = await this.topicService.findAll({ creatorId });
        return topics
            ? this.utilsService.createResponse(200, "Tópicos encontrados", topics)
            : this.utilsService.createResponse(404, "Tópicos não encontrados");
    };

    getTopic = async (req: Request & { params: { id: string }, user: { id: number } }) => {
        const id = Number(req.params.id);
        const creatorId = req.user.id;

        if (!id || !creatorId) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const topic = await this.topicService.findById({ id, creatorId });
        return topic
            ? this.utilsService.createResponse(200, "Tópico encontrado", topic)
            : this.utilsService.createResponse(404, "Tópico não encontrado",);
    };

    createTopic = async (req: Request & { user: { id: number } }) => {
        const data = await req.json();
        data.creatorId = req.user.id;

        if (!data?.name || !data?.creatorId) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const topic = await this.topicService.create(data);

        if (!topic?.id) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        return topic
            ? this.utilsService.createResponse(201, "Tópico criado", topic)
            : this.utilsService.createResponse(400, "Erro ao criar tópico");
    };

    updateTopic = async (req: Request & { params: { id: string } }) => {
        const id = Number(req.params.id);

        if (!id) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const updatedData = await req.json();
        const updatedTopic = await this.topicService.update({ id, ...updatedData });
        return updatedTopic
            ? this.utilsService.createResponse(200, "Tópico atualizado", updatedTopic)
            : this.utilsService.createResponse(404, "Tópico não encontrado");
    };

    deleteTopic = async (req: Request & { params: { id: string } }) => {
        const id = Number(req.params.id);

        if (!id) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const deleted = await this.topicService.delete({ id });
        return deleted
            ? this.utilsService.createResponse(200, "Tópico deletado")
            : this.utilsService.createResponse(404, "Tópico não encontrado");
    };

    getTopicFlashcards = async (req: Request & { params: { id: string }, user: { id: number } }) => {
        const id = Number(req.params.id);
        const creatorId = req.user.id;

        if (!id || !creatorId) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const topic = await this.topicService.findById({ id, creatorId });

        if (!topic?.id) {
            return this.utilsService.createResponse(404, "Tópico não encontrado");
        }

        const flashcards = await this.topicService.getTopicFlashcards({ id, creatorId });
        return flashcards
            ? this.utilsService.createResponse(200, "Flashcards encontrados", { topic, flashcards })
            : this.utilsService.createResponse(404, "Flashcards não encontrados");
    }

    shareTopic = async (req: Request & { params: { id: string }, user: { id: number } }) => {
        const id = Number(req.params.id);
        const creatorId = req.user.id;

        if (!id || !creatorId) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const topic = await this.topicService.findById({ id, creatorId });

        if (!topic?.id) {
            return this.utilsService.createResponse(404, "Tópico não encontrado");
        }

        const sharedData = {
            sharedId: this.utilsService.generateRandomString(20)
        }

        const updatedTopic = await this.topicService.update({ id, ...sharedData });
        return updatedTopic
            ? this.utilsService.createResponse(200, "Flashcards compartilhados", updatedTopic)
            : this.utilsService.createResponse(404, "Flashcards não encontrados");
    }

    getSharedTopic = async (req: Request & { params: { id: string, sharedId: string } }) => {
        const sharedId = req.params.sharedId;

        if (!sharedId) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const topic = await this.topicService.getTopicBySharedId({ sharedId });
        if (!topic?.id) {
            return this.utilsService.createResponse(404, "Tópico não encontrado");
        }

        const flashcards = await this.topicService.getTopicFlashcards({ id: topic.id, creatorId: topic.creatorId });
        return flashcards
            ? this.utilsService.createResponse(200, "Flashcards encontrados", { topic, flashcards })
            : this.utilsService.createResponse(404, "Flashcards não encontrados");
    }
}
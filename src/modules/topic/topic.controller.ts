import { UtilsService } from "$modules/utils/utils.service";
import { TopicService } from "./topic.service";

export class TopicController {
    private readonly utilsService = new UtilsService();
    private readonly topicService = new TopicService();

    getAllTopics = async () => {
        const topics = await this.topicService.findAll();
        return topics
            ? this.utilsService.createResponse(200, "Tópicos encontrados", topics)
            : this.utilsService.createResponse(404, "Tópicos não encontrados");
    };

    getTopic = async (req: Request & { params: { id: string } }) => {
        const id = Number(req.params.id);

        if (!id) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const topic = await this.topicService.findById({ id });
        return topic
            ? this.utilsService.createResponse(200, "Tópico encontrado", topic)
            : this.utilsService.createResponse(404, "Tópico não encontrado",);
    };

    createTopic = async (req: Request) => {
        const data = await req.json();
        const topic = await this.topicService.create(data);

        if (!topic?.name) {
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

    getTopicFlashcards = async (req: Request & { params: { id: string } }) => {
        const id = Number(req.params.id);

        if (!id) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const topic = await this.topicService.findById({ id });
        const flashcards = await this.topicService.getTopicFlashcards({ id });
        return flashcards
            ? this.utilsService.createResponse(200, "Flashcards encontrados", { topic, flashcards })
            : this.utilsService.createResponse(404, "Flashcards não encontr");
    }
}
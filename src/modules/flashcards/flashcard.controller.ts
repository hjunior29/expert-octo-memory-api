import { FolderService } from "$modules/folders/folder.service";
import { GeminiService } from "$modules/gemini/gemini.service";
import { TopicService } from "$modules/topic/topic.service";
import { UtilsService } from "$modules/utils/utils.service";
import type { Flashcard, FlashcardGenerate } from "./flashcard.model";
import { FlashcardService } from "./flashcard.service";

export class FlashcardController {
    private readonly utilsService = new UtilsService();
    private readonly flashcardService = new FlashcardService();
    private readonly foldersService = new FolderService();
    private readonly topicsService = new TopicService();
    private readonly geminiService = new GeminiService();

    getAllFlashcards = async (req: Request & { user: { id: number } }) => {
        const creatorId = req.user.id;

        if (!creatorId) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const flashcards = await this.flashcardService.findAll({ creatorId });
        return flashcards
            ? this.utilsService.createResponse(200, "Flashcards encontrados", flashcards)
            : this.utilsService.createResponse(404, "Flashcards não encontrados");
    };

    getFlashcard = async (req: Request & { params: { id: string }, user: { id: number } }) => {
        const id = Number(req.params.id);
        const creatorId = req.user.id;

        if (!id || !creatorId) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const flashcard = await this.flashcardService.findById({ id, creatorId });
        return flashcard
            ? this.utilsService.createResponse(200, "Flashcard encontrado", flashcard)
            : this.utilsService.createResponse(404, "Flashcard não encontrado");
    };

    createFlashcard = async (req: Request & { user: { id: number } }) => {
        const data = await req.json();
        data.creatorId = req.user.id;

        if (!data?.title || !data?.question || !data?.answer || !data.creatorId) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const flashcard = await this.flashcardService.create(data);
        return flashcard
            ? this.utilsService.createResponse(201, "Flashcard criado", flashcard)
            : this.utilsService.createResponse(400, "Erro ao criar flashcard");
    };


    createFlashcardsBatch = async (flashcards: Flashcard[], topicId: number, creatorId: number) => {
        if (!Array.isArray(flashcards) || flashcards.length === 0 || !topicId || !creatorId) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        for (const f of flashcards) {
            if (!f.title || !f.question || !f.answer) {
                return this.utilsService.createResponse(400, "Erro no corpo da requisição");
            }
        }

        const createdFlashcards = [];
        for (const f of flashcards) {
            const flashcard = await this.flashcardService.create({ ...f, topicId, creatorId });
            createdFlashcards.push(flashcard);
        }

        return createdFlashcards.length > 0
            ? this.utilsService.createResponse(201, "Flashcards criados", createdFlashcards)
            : this.utilsService.createResponse(400, "Erro ao criar flashcards");
    };

    updateFlashcard = async (req: Request & { params: { id: string } }) => {
        const id = Number(req.params.id);

        if (!id) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const updatedData = await req.json();
        const updatedFlashcard = await this.flashcardService.update({ id, ...updatedData });
        return updatedFlashcard
            ? this.utilsService.createResponse(200, "Flashcard atualizado", updatedFlashcard)
            : this.utilsService.createResponse(404, "Flashcard não encontrado");
    };

    deleteFlashcard = async (req: Request & { params: { id: string } }) => {
        const id = Number(req.params.id);

        if (!id) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const deleted = await this.flashcardService.delete({ id });
        return deleted
            ? this.utilsService.createResponse(200, "Flashcard deletado")
            : this.utilsService.createResponse(404, "Flashcard não encontrado");
    };

    generateFlashcardsFromText = async (req: Request & { params: { folderId: number }, user: { id: number } }) => {
        const folderId = Number(req.params.folderId);
        const creatorId = req.user.id;
        const flashcardGenerate: FlashcardGenerate = await req.json();

        if (!folderId || !creatorId || !flashcardGenerate.text) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const generateFlashcard = await this.geminiService.generateFlashcardsFromText(flashcardGenerate);

        if (!generateFlashcard.valid) {
            return this.utilsService.createResponse(400, "Erro ao gerar flashcards");
        }

        const topic = await this.topicsService.create({ name: generateFlashcard.topic.name, folderId, creatorId });

        if (!topic?.id) {
            return this.utilsService.createResponse(400, "Erro ao criar tópico");
        }

        return this.createFlashcardsBatch(generateFlashcard.flashcards, topic.id, creatorId);
    };

    generateFlashcardsFromLink = async (req: Request & { params: { folderId: number }, user: { id: number } }) => {
        const folderId = Number(req.params.folderId);
        const creatorId = req.user.id;
        const flashcardGenerate: FlashcardGenerate = await req.json();

        if (!flashcardGenerate.link || !folderId || !creatorId) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const generateFlashcard = await this.geminiService.generateFlashcardsFromText(flashcardGenerate);

        if (!generateFlashcard.valid) {
            return this.utilsService.createResponse(400, "Erro ao gerar flashcards");
        }

        const topic = await this.topicsService.create({ name: generateFlashcard.topic.name, folderId, creatorId });

        if (!topic?.id) {
            return this.utilsService.createResponse(400, "Erro ao criar tópico");
        }

        return this.createFlashcardsBatch(generateFlashcard.flashcards, topic.id, creatorId);
    };

    generateFlashcardsFromTopic = async (req: Request & { params: { folderId: number }, user: { id: number } }) => {
        const folderId = Number(req.params.folderId);
        const creatorId = req.user.id;
        const flashcardGenerate: FlashcardGenerate = await req.json();

        if (!flashcardGenerate.topic || !folderId || !creatorId) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const generateFlashcard = await this.geminiService.generateFlashcardsFromTopic(flashcardGenerate);

        if (!generateFlashcard.valid) {
            return this.utilsService.createResponse(400, "Erro ao gerar flashcards");
        }

        const topic = await this.topicsService.create({ name: generateFlashcard.topic.name, folderId, creatorId });

        if (!topic?.id) {
            return this.utilsService.createResponse(400, "Erro ao criar tópico");
        }

        return this.createFlashcardsBatch(generateFlashcard.flashcards, topic.id, creatorId);
    };

    generateFlashcardsFromFile = async (req: Request & { params: { folderId: number }, user: { id: number } }) => {
        const folderId = Number(req.params.folderId);
        const creatorId = req.user.id;
        const flashcardGenerate: FlashcardGenerate = await req.json();

        if (flashcardGenerate.files?.length === 0 || !folderId || !creatorId) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const generateFlashcard = await this.geminiService.generateFlashcardsFromFile(flashcardGenerate);

        if (!generateFlashcard.valid) {
            return this.utilsService.createResponse(400, "Erro ao gerar flashcards");
        }

        const topic = await this.topicsService.create({ name: generateFlashcard.topic.name, folderId, creatorId });

        if (!topic?.id) {
            return this.utilsService.createResponse(400, "Erro ao criar tópico");
        }

        return this.createFlashcardsBatch(generateFlashcard.flashcards, topic.id, creatorId);
    }
}
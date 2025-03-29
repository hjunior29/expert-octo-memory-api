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

    getAllFlashcards = async () => {
        const flashcards = await this.flashcardService.findAll();
        return flashcards
            ? this.utilsService.createResponse(200, "Flashcards encontrados", flashcards)
            : this.utilsService.createResponse(404, "Flashcards não encontrados");
    };

    getFlashcard = async (req: Request & { params: { id: string } }) => {
        const id = Number(req.params.id);

        if (!id) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const flashcard = await this.flashcardService.findById({ id });
        return flashcard
            ? this.utilsService.createResponse(200, "Flashcard encontrado", flashcard)
            : this.utilsService.createResponse(404, "Flashcard não encontrado");
    };

    createFlashcard = async (req: Request) => {
        const data = await req.json();
        const flashcard = await this.flashcardService.create(data);

        if (!flashcard?.topicId || !flashcard?.title || !flashcard?.question || !flashcard?.answer) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        return flashcard
            ? this.utilsService.createResponse(201, "Flashcard criado", flashcard)
            : this.utilsService.createResponse(400, "Erro ao criar flashcard");
    };


    createFlashcardsBatch = async (flashcards: Flashcard[], topicId: number) => {
        if (!Array.isArray(flashcards) || flashcards.length === 0) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        for (const f of flashcards) {
            if (!f.title || !f.question || !f.answer) {
                return this.utilsService.createResponse(400, "Erro no corpo da requisição");
            }
        }

        const createdFlashcards = [];
        for (const f of flashcards) {
            const flashcard = await this.flashcardService.create({ ...f, topicId });
            createdFlashcards.push(flashcard);
        }

        return this.utilsService.createResponse(201, "Flashcards criados", createdFlashcards);
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

    generateFlashcardsFromText = async (req: Request & { params: { folderId: number } }) => {
        const folderId = Number(req.params.folderId);
        const flashcardGenerate: FlashcardGenerate = await req.json();

        if (!flashcardGenerate.text || !folderId) {
            console.log(flashcardGenerate.text, folderId);
            return this.utilsService.createResponse(400, "Faltando 'text' ou 'folderId' no corpo da requisição");
        }

        const generateFlashcard = await this.geminiService.generateFlashcardsFromText(flashcardGenerate);
        const topic = await this.topicsService.create({ name: generateFlashcard.topic.name, folderId });

        if (!topic?.id) {
            return this.utilsService.createResponse(400, "Erro ao criar tópico");
        }

        if (!generateFlashcard.valid) {
            return this.utilsService.createResponse(400, "Erro ao gerar flashcards");
        }

        return this.createFlashcardsBatch(generateFlashcard.flashcards, topic.id);
    };

    generateFlashcardsFromLink = async (req: Request & { params: { folderId: number } }) => {
        const folderId = Number(req.params.folderId);
        const flashcardGenerate: FlashcardGenerate = await req.json();

        if (!flashcardGenerate.link || !folderId) {
            return this.utilsService.createResponse(400, "Faltando 'link' ou 'folderId' no corpo da requisição");
        }

        const generateFlashcard = await this.geminiService.generateFlashcardsFromLink(flashcardGenerate);
        const topic = await this.topicsService.create({ name: generateFlashcard.topic.name, folderId });

        if (!topic?.id) {
            return this.utilsService.createResponse(400, "Erro ao criar tópico");
        }

        if (!generateFlashcard.valid) {
            return this.utilsService.createResponse(400, "Erro ao gerar flashcards");
        }

        return this.createFlashcardsBatch(generateFlashcard.flashcards, topic.id);
    };

    generateFlashcardsFromTopic = async (req: Request & { params: { folderId: number } }) => {
        const folderId = Number(req.params.folderId);
        const flashcardGenerate: FlashcardGenerate = await req.json();

        if (!flashcardGenerate.topic || !folderId) {
            return this.utilsService.createResponse(400, "Faltando 'topic' ou 'folderId' no corpo da requisição");
        }

        const generateFlashcard = await this.geminiService.generateFlashcardsFromTopic(flashcardGenerate);
        const topic = await this.topicsService.create({ name: generateFlashcard.topic.name, folderId });

        console.log(topic);

        if (!topic?.id) {
            return this.utilsService.createResponse(400, "Erro ao criar tópico");
        }

        if (!generateFlashcard.valid) {
            return this.utilsService.createResponse(400, "Erro ao gerar flashcards");
        }

        return this.createFlashcardsBatch(generateFlashcard.flashcards, topic.id);
    };

    generateFlashcardsFromFile = async (req: Request & { params: { folderId: number } }) => {
        const folderId = Number(req.params.folderId);
        const flashcardGenerate: FlashcardGenerate = await req.json();

        if (flashcardGenerate.files?.length === 0 || !folderId) {
            return this.utilsService.createResponse(400, "Faltando 'file' ou 'folderId' no corpo da requisição");
        }

        const generateFlashcard = await this.geminiService.generateFlashcardsFromFile(flashcardGenerate);
        const topic = await this.topicsService.create({ name: generateFlashcard.topic.name, folderId });

        if (!topic?.id) {
            return this.utilsService.createResponse(400, "Erro ao criar tópico");
        }

        if (!generateFlashcard.valid) {
            return this.utilsService.createResponse(400, "Erro ao gerar flashcards");
        }

        return this.createFlashcardsBatch(generateFlashcard.flashcards, topic.id);
    }
}
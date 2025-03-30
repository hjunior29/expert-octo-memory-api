import { UtilsService } from "$modules/utils/utils.service";
import { FolderService } from "./folder.service";

export class FolderController {
    private readonly utilsService = new UtilsService();
    private readonly folderService = new FolderService();

    getAllFolders = async (req: Request & { user: { id: number } }) => {
        const creatorId = req.user.id;

        if (!creatorId) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const folders = await this.folderService.findAll({ creatorId });
        return folders
            ? this.utilsService.createResponse(200, "Pastas encontradas", folders)
            : this.utilsService.createResponse(404, "Pastas não encontradas");
    }

    getFolder = async (req: Request & { params: { id: string }, user: { id: number } }) => {
        const id = Number(req.params.id);
        const creatorId = req.user.id;

        if (!id || !creatorId) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const folder = await this.folderService.findById({ id, creatorId });
        return folder
            ? this.utilsService.createResponse(200, "Pasta encontrada", folder)
            : this.utilsService.createResponse(404, "Pasta não encontrada");
    };

    createFolder = async (req: Request & { user: { id: number } }) => {
        const data = await req.json();
        data.creatorId = req.user.id;

        if (!data.name || !data.creatorId) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const folder = await this.folderService.create(data);

        if (!folder?.id) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        return folder
            ? this.utilsService.createResponse(201, "Pasta criada", folder)
            : this.utilsService.createResponse(400, "Erro ao criar pasta");
    };

    updateFolder = async (req: Request & { params: { id: string } }) => {
        const id = Number(req.params.id);

        if (!id) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const updatedData = await req.json();
        const updatedFolder = await this.folderService.update({ id, ...updatedData });
        return updatedFolder
            ? this.utilsService.createResponse(200, "Pasta atualizada", updatedFolder)
            : this.utilsService.createResponse(404, "Pasta não encontrada");
    };

    deleteFolder = async (req: Request & { params: { id: string } }) => {
        const id = Number(req.params.id);

        if (!id) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const deletedFolder = await this.folderService.delete({ id });
        return deletedFolder
            ? this.utilsService.createResponse(200, "Pasta deletada", deletedFolder)
            : this.utilsService.createResponse(404, "Pasta não encontrada");
    };

    getFolderTopics = async (req: Request & { params: { id: string }, user: { id: number } }) => {
        const id = Number(req.params.id);
        const creatorId = req.user.id;

        if (!id || !creatorId) {
            return this.utilsService.createResponse(400, "Erro no corpo da requisição");
        }

        const folder = await this.folderService.findById({ id, creatorId });

        if (!folder?.id) {
            return this.utilsService.createResponse(404, "Pasta não encontrada");
        }

        const topics = await this.folderService.getFolderTopics({ id, creatorId });
        return topics
            ? this.utilsService.createResponse(200, "Tópicos encontrados", { folder, topics })
            : this.utilsService.createResponse(404, "Tópicos não encontrados");
    };
}
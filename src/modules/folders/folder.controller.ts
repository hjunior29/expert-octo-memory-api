import { UtilsService } from "$modules/utils/utils.service";
import { FolderService } from "./folder.service";

export class FolderController {
    private folderService = new FolderService();
    private utilsService = new UtilsService();

    getAllFolders = async () => {
        const folders = await this.folderService.findAll();
        return this.utilsService.createResponse(200, "Pastas encontradas", folders);
    };

    getFolder = async (req: Request & { params: { id: string } }) => {
        const id = Number(req.params.id);

        const folder = await this.folderService.findById(id);
        return folder
            ? this.utilsService.createResponse(200, "Pasta encontrada", folder)
            : this.utilsService.createResponse(404, "Pasta não encontrada");
    };

    createFolder = async (req: Request) => {
        const { name, creatorId } = await req.json();

        const folder = await this.folderService.create(
            name,
            creatorId
        );
        return this.utilsService.createResponse(201, "Pasta criada", folder);
    };

    updateFolder = async (req: Request & { params: { id: string } }) => {
        const id = Number(req.params.id);

        const updatedData = await req.json();
        const updatedFolder = await this.folderService.update(id, updatedData);
        return updatedFolder
            ? this.utilsService.createResponse(200, "Pasta atualizada", updatedFolder)
            : this.utilsService.createResponse(404, "Pasta não encontrada");
    };

    deleteFolder = async (req: Request & { params: { id: string } }) => {
        const id = Number(req.params.id);

        const deleted = await this.folderService.delete(id);
        return deleted
            ? this.utilsService.createResponse(200, "Pasta deletada")
            : this.utilsService.createResponse(404, "Pasta não encontrada");
    };
}
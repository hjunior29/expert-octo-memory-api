import { FolderService } from "./folder.service";

export class FolderController {
    private folderService = new FolderService();

    getAllFolders = async () => {
        const folders = await this.folderService.findAll();
        return new Response(JSON.stringify(folders), {
            headers: { "Content-Type": "application/json" },
        });
    };

    getFolder = async (req: Request & { params: { id: string } }) => {
        const id = Number(req.params.id);

        const folder = await this.folderService.findById(id);
        return folder
            ? new Response(JSON.stringify(folder), {
                headers: { "Content-Type": "application/json" },
            })
            : new Response("Folder not found", { status: 404 });
    };

    createFolder = async (req: Request) => {
        const { name, creatorId } = await req.json();

        const folder = await this.folderService.create(
            name,
            creatorId
        );
        return new Response(JSON.stringify(folder), {
            headers: { "Content-Type": "application/json" },
            status: 201,
        });
    };

    updateFolder = async (req: Request & { params: { id: string } }) => {
        const id = Number(req.params.id);

        const updatedData = await req.json();
        const updatedFolder = await this.folderService.update(id, updatedData);
        return updatedFolder
            ? new Response(JSON.stringify(updatedFolder), {
                headers: { "Content-Type": "application/json" },
            })
            : new Response("Folder not found", { status: 404 });
    };

    deleteFolder = async (req: Request & { params: { id: string } }) => {
        const id = Number(req.params.id);

        const deleted = await this.folderService.delete(id);
        return deleted
            ? new Response("Folder deleted successfully", { status: 200 })
            : new Response("Folder not found", { status: 404 });
    };
}
import { FolderController } from "./folder.controller";

const folderController = new FolderController();

export const folderRoutes = {
    "/api/folders": {
        GET: (req: Request) => folderController.getAllFolders(),
        POST: (req: Request) => folderController.createFolder(req)
    },
    "/api/folders/:id": {
        GET: (req: Request) => folderController.getFolder(req as Request & { params: { id: string } }),
        PUT: (req: Request) => folderController.updateFolder(req as Request & { params: { id: string } }),
        DELETE: (req: Request) => folderController.deleteFolder(req as Request & { params: { id: string } }),
    },
    "/api/folders/:id/topics": {
        GET: (req: Request) => folderController.getFolderTopics(req as Request & { params: { id: string } }),
    },
}
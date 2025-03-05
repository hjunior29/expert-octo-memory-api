import { FolderController } from "./folder.controller";

const userController = new FolderController();

export const userRoutes = {
    "/api/folders": {
        GET: (req: Request) => userController.getAllFolders(),
        POST: (req: Request) => userController.createFolder(req)
    },
    "/api/folders/:id": {
        GET: (req: Request) => userController.getFolder(req as Request & { params: { id: string } }),
        PUT: (req: Request) => userController.updateFolder(req as Request & { params: { id: string } }),
        DELETE: (req: Request) => userController.deleteFolder(req as Request & { params: { id: string } }),
    },
};
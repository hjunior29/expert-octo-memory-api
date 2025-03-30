import { UserController } from "./user.controller";

const userController = new UserController();

export const userRoutes = {
	"/api/users": {
		GET: (req: Request) => userController.getAllUsers(),
	},
	"/api/users/:id": {
		GET: (req: Request) => userController.getUser(req as Request & { params: { id: string } }),
		PUT: (req: Request) => userController.updateUser(req as Request & { params: { id: string } }),
		DELETE: (req: Request) => userController.deleteUser(req as Request & { params: { id: string } }),
	},
};
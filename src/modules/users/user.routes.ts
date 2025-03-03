import { UserController } from "./user.controller";

const userController = new UserController();

export const userRoutes = {
	"/api/users": {
		GET: userController.getAllUsers,
		POST: userController.createUser
	},
	"/api/users/:id": {
		GET: userController.getUser,
		PUT: userController.updateUser,
		DELETE: userController.deleteUser
	},
};
import { UserController } from "./user.controller";

const userController = new UserController();

export const userRoutes = {
    "/api/users": {
        // GET: userController.getUsers,
        GET: userController.helloWorld,
        // POST: userController.createUser,
    },
    "/api/users/:id": {
        GET: userController.getUser,
    },
};

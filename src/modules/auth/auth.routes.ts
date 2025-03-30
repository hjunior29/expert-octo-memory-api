import { UserController } from "$modules/users/user.controller";
import { AuthController } from "./auth.controller";

const authController = new AuthController();
const userController = new UserController();

export const authRoutes = {
    "/api/auth/register": {
        POST: (req: Request) => userController.createUser(req)
    },
    "/api/auth/login": {
        POST: (req: Request) => authController.login(req)
    },
    "/api/auth/verify": {
        GET: (req: Request) => authController.verify(req)
    }
};
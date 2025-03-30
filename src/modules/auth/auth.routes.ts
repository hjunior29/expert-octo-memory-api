import { AuthController } from "./auth.controller";

const authController = new AuthController();

export const authRoutes = {
    "/api/auth/login": {
        POST: (req: Request) => authController.login(req)
    }

    , "/api/auth/verify": {
        GET: (req: Request) => authController.verify(req)
    }
};
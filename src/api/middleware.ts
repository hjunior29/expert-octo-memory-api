import { AUTH_BYPASS } from "$constants/index";
import { AuthController } from "$modules/auth/auth.controller";
import { UtilsService } from "$modules/utils/utils.service";

const authController = new AuthController();
const utilsService = new UtilsService();

export function applyMiddleware(routes: Record<string, Record<string, (req: Request) => Promise<Response>>>) {
    const result: Record<string, Record<string, (req: Request) => Promise<Response>>> = {};

    for (const [path, handlers] of Object.entries(routes)) {
        result[path] = {};

        for (const [method, handler] of Object.entries(handlers)) {
            result[path][method] = async (req: Request) => {
                const pathname = new URL(req.url).pathname;
                const publicRoutes = [
                    "/",
                    "/api/ping",
                    "/api/auth/login",
                    "/api/auth/register",
                    "/api/auth/verify",
                ];
                const { method: reqMethod, url } = req;
                let body = null;

                if (reqMethod !== "GET" && reqMethod !== "HEAD") {
                    body = await req.clone().json().catch(() => null);
                }

                console.log(`[${reqMethod}] ${url}`, body || "", req.headers.get("authorization") ? "Auth" : "[No Auth]");

                if (!publicRoutes.includes(pathname) || AUTH_BYPASS) {
                    const verifyResponse = await authController.verify(req);
                    const response = await verifyResponse.json();

                    if (verifyResponse.status !== 200) {
                        const errorResponse = utilsService.createResponse(
                            verifyResponse.status,
                            "Token inválido ou expirado"
                        );

                        verifyResponse.headers.forEach((value, key) => {
                            errorResponse.headers.set(key, value);
                        });

                        return errorResponse;
                    }

                    const reqWithUser = Object.assign(req, { user: response.data.payload });
                    const handlerResponse = await handler(reqWithUser);

                    verifyResponse.headers.forEach((value, key) => {
                        handlerResponse.headers.set(key, value);
                    });

                    return handlerResponse;
                }

                return handler(req);
            };
        }
    }

    return result;
}
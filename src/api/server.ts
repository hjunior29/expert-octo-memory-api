import { AUTH_BYPASS } from "$constants/index";
import { AuthController } from "$modules/auth/auth.controller";
import { authRoutes } from "$modules/auth/auth.routes";
import { flashcardRoutes } from "$modules/flashcards/flashcard.routes";
import { folderRoutes } from "$modules/folders/folder.routes";
import { topicRoutes } from "$modules/topic/topic.routes";
import { userRoutes } from "$modules/users/user.routes";

const authController = new AuthController();

export function startServer() {
	const server = Bun.serve({
		routes: applyMiddleware({
			...userRoutes,
			...folderRoutes,
			...flashcardRoutes,
			...topicRoutes,
			...authRoutes,
		}),
	});

	console.log(`✅ Server running at http://${server.hostname}:${server.port}`);
	return server;
}

function applyMiddleware(routes: Record<string, Record<string, (req: Request) => Promise<Response>>>) {
	const result: Record<string, Record<string, (req: Request) => Promise<Response>>> = {};

	for (const [path, handlers] of Object.entries(routes)) {
		result[path] = {};

		for (const [method, handler] of Object.entries(handlers)) {
			result[path][method] = async (req: Request) => {
				const { method: reqMethod, url } = req;
				let body = null;

				if (reqMethod !== "GET" && reqMethod !== "HEAD") {
					body = await req.clone().json().catch(() => null);
				}

				console.log(`[${reqMethod}] ${url}`, body || "", req.headers.get("authorization") ? "Auth" : "[No Auth]");

				const pathname = new URL(req.url).pathname;
				const publicRoutes = [
					"/api/auth/login",
					"/api/auth/register",
					"/api/auth/verify",
				];

				if (!publicRoutes.includes(pathname) || AUTH_BYPASS) {
					const response = await authController.verify(req);

					if (response instanceof Response && response.status !== 200) {
						return response;
					}
				}

				return handler(req);
			};
		}
	}
	return result;
}
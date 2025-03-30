import { authRoutes } from "$modules/auth/auth.routes";
import { flashcardRoutes } from "$modules/flashcards/flashcard.routes";
import { folderRoutes } from "$modules/folders/folder.routes";
import { topicRoutes } from "$modules/topic/topic.routes";
import { userRoutes } from "$modules/users/user.routes";

export function startServer() {
	const server = Bun.serve({
		routes: applyLogging({
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

function withLogging(handlers: Record<string, (req: Request) => Promise<unknown>>) {
	const loggedHandlers: Record<string, (req: Request) => Promise<unknown>> = {};
	for (const [method, handler] of Object.entries(handlers)) {
		loggedHandlers[method] = async (req: Request) => {
			const { method: reqMethod, url, } = req;
			let body = null;

			if (reqMethod !== "GET" && reqMethod !== "HEAD") {
				body = await req.clone().json().catch(() => null);
			}

			console.log(`[${reqMethod}] ${url}`,
				body || ""
			);

			return handler(req);
		};
	}
	return loggedHandlers;
}

function applyLogging(routes: Record<string, Record<string, (req: Request) => Promise<unknown>>>) {
	const loggedRoutes: Record<string, Record<string, (req: Request) => Promise<unknown>>> = {};
	for (const [path, handlers] of Object.entries(routes)) {
		loggedRoutes[path] = withLogging(handlers);
	}
	return loggedRoutes;
}
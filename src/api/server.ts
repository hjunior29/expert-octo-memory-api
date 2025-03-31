import { authRoutes } from "$modules/auth/auth.routes";
import { flashcardRoutes } from "$modules/flashcards/flashcard.routes";
import { folderRoutes } from "$modules/folders/folder.routes";
import { topicRoutes } from "$modules/topic/topic.routes";
import { home } from "public/home";
import { cors } from "./cors";
import { applyMiddleware } from "./middleware";
import { ping } from "./ping";

export function startServer() {
	const server = Bun.serve({
		routes: applyMiddleware({
			...cors,
			...ping,
			...home,
			// ...userRoutes,
			...folderRoutes,
			...flashcardRoutes,
			...topicRoutes,
			...authRoutes,
		}),
	});

	console.log(`✅ Server running at http://${server.hostname}:${server.port}`);
	return server;
}
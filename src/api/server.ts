import { flashcardRoutes } from "$modules/flashcards/flashcard.routes";
import { folderRoutes } from "$modules/folders/folder.routes";
import { userRoutes } from "$modules/users/user.routes";

export function startServer() {
	const server = Bun.serve({
		routes: {
			...userRoutes,
			...folderRoutes,
			...flashcardRoutes,
		},
	});

	console.log(`✅ Server running at http://${server.hostname}:${server.port}`);
	return server;
}
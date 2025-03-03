import { userRoutes } from "$modules/users/user.routes";

export function startServer() {
	const server = Bun.serve({
		routes: {
			...userRoutes,
			"/api/*": () => new Response("Not Found", { status: 404 }),
		},
	});

	console.log(`✅ Server running at http://${server.hostname}:${server.port}`);
	return server;
}
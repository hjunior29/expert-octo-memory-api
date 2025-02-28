import { userRoutes } from "$modules/users/user.routes";

export const server = Bun.serve({
	routes: {
		...userRoutes,
		"/api/*": () => new Response("Not Found", { status: 404 }),
	},
});

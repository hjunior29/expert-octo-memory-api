export const home = {
    "/": {
        GET: async () =>
            new Response(await Bun.file("src/public/home.html").text(), {
                headers: { "Content-Type": "text/html" },
            }),
    },
}
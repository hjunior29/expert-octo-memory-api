import { ORIGIN_URL } from "$constants/index";

export const cors = {
    "/*": {
        OPTIONS: async () =>
            new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": ORIGIN_URL ?? "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            }),
    },
};
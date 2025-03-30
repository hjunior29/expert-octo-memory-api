import { importPKCS8, importSPKI } from "jose";

export const DATABASE_HOST = Bun.env.DATABASE_HOST;
export const DATABASE_USER = Bun.env.DATABASE_USER;
export const DATABASE_PASS = Bun.env.DATABASE_PASS;
export const DATABASE_NAME = Bun.env.DATABASE_NAME;
export const DATABASE_PORT = Bun.env.DATABASE_PORT;

export const DATABASE_URL = Bun.env.DATABASE_URL
    ? Bun.env.DATABASE_URL
    : `postgres://${DATABASE_USER}:${DATABASE_PASS}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;

export const GEMINI_API_KEY = Bun.env.GEMINI_API_KEY;

export const prompts = {
    generateFlashcardsFromText: Bun.file(`${import.meta.dir}/prompts/generateFlashcardsFromText.txt`).text(),
    generateFlashcardsFromLink: Bun.file(`${import.meta.dir}/prompts/generateFlashcardsFromLink.txt`).text(),
    generateFlashcardsFromTopic: Bun.file(`${import.meta.dir}/prompts/generateFlashcardsFromTopic.txt`).text(),
    generateFlashcardsFromFile: Bun.file(`${import.meta.dir}/prompts/generateFlashcardsFromFile.txt`).text(),
};

export const PRIVATE_KEY = await (async () => {
    if (!Bun.env.PRIVATE_KEY) {
        throw new Error("PRIVATE_KEY is not defined in environment variables.");
    }
    const rawKey = Bun.env.PRIVATE_KEY;
    const key = rawKey.replace(/\\n/g, "\n");
    return importPKCS8(key, "RS256");
})();

export const PUBLIC_KEY = await (async () => {
    if (!Bun.env.PUBLIC_KEY) {
        throw new Error("PUBLIC_KEY is not defined in environment variables.");
    }
    const rawKey = Bun.env.PUBLIC_KEY;
    const key = rawKey.replace(/\\n/g, "\n");
    return importSPKI(key, "RS256");
})();

export const AUTH_BYPASS = (() => {
    if (Bun.env.AUTH_BYPASS === "true") {
        return true;
    }
    if (Bun.env.AUTH_BYPASS === "false") {
        return false;
    }
    throw new Error("AUTH_BYPASS environment variable must be either 'true' or 'false'");
})();
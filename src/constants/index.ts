export const DATABASE_HOST = Bun.env.DATABASE_HOST;
export const DATABASE_USER = Bun.env.DATABASE_USER;
export const DATABASE_PASS = Bun.env.DATABASE_PASS;
export const DATABASE_NAME = Bun.env.DATABASE_NAME;
export const DATABASE_PORT = Bun.env.DATABASE_PORT;

export const DATABASE_URL = `postgres://${DATABASE_USER}:${DATABASE_PASS}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;

export const GEMINI_API_KEY = Bun.env.GEMINI_API_KEY;

export const prompts = {
    generateFlashcardsFromText: Bun.file(`${import.meta.dir}/prompts/generateFlashcardsFromText.txt`).text(),
    generateFlashcardsFromLink: Bun.file(`${import.meta.dir}/prompts/generateFlashcardsFromLink.txt`).text(),
    generateFlashcardsFromTopic: Bun.file(`${import.meta.dir}/prompts/generateFlashcardsFromTopic.txt`).text(),
    generateFlashcardsFromFile: Bun.file(`${import.meta.dir}/prompts/generateFlashcardsFromFile.txt`).text(),
};
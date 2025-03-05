import * as p from "drizzle-orm/pg-core"

const defaultModel = {
    id: p.serial().primaryKey(),
    createdAt: p.timestamp().defaultNow().notNull(),
    updatedAt: p.timestamp().defaultNow().$onUpdate(() => new Date()).notNull(),
    deletedAt: p.timestamp(),
}

export const users = p.pgTable("users", {
    ...defaultModel,
    firstName: p.text(),
    lastName: p.text(),
    email: p.text(),
    phoneNumber: p.text(),
    hashedPassword: p.text(),
});

export const folders = p.pgTable("folders", {
    ...defaultModel,
    name: p.text(),
    creatorId: p.integer().references(() => users.id),
});

export const flashcards = p.pgTable("flashcards", {
    ...defaultModel,
    title: p.text(),
    question: p.text(),
    answer: p.text(),
    folderId: p.integer().references(() => folders.id),
    tags: p.text().array(),
    difficulty: p.text(),
    lastReviewed: p.timestamp(),
    reviewCount: p.integer(),
});

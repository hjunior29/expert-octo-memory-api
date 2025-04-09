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
    email: p.text().unique(),
    phoneNumber: p.text(),
    hashedPassword: p.text(),
});

export const folders = p.pgTable("folders", {
    ...defaultModel,
    creatorId: p.integer().references(() => users.id),
    name: p.text(),
});

export const topics = p.pgTable("topics", {
    ...defaultModel,
    folderId: p.integer().references(() => folders.id),
    creatorId: p.integer().references(() => users.id),
    name: p.text(),
    description: p.text(),
    sharedId: p.text().unique(),
});

export const flashcards = p.pgTable("flashcards", {
    ...defaultModel,
    topicId: p.integer().references(() => topics.id),
    creatorId: p.integer().references(() => users.id),
    title: p.text(),
    question: p.text(),
    answer: p.text(),
    tags: p.text().array(),
    difficulty: p.text(),
    lastReviewed: p.timestamp(),
    reviewCount: p.integer(),
});

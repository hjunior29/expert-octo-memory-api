import { sql } from "drizzle-orm";
import * as p from "drizzle-orm/sqlite-core";

const defaultModel = {
    id: p.integer().primaryKey({ autoIncrement: true }),
    createdAt: p.integer({ mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
    updatedAt: p.integer({ mode: "timestamp" }).default(sql`(unixepoch())`).$onUpdate(() => new Date()).notNull(),
    deletedAt: p.integer({ mode: "timestamp" }),
};

export const users = p.sqliteTable("users", {
    ...defaultModel,
    firstName: p.text(),
    lastName: p.text(),
    email: p.text().unique(),
    phoneNumber: p.text(),
    hashedPassword: p.text(),
});

export const folders = p.sqliteTable("folders", {
    ...defaultModel,
    creatorId: p.integer().references(() => users.id),
    name: p.text(),
});

export const topics = p.sqliteTable("topics", {
    ...defaultModel,
    folderId: p.integer().references(() => folders.id),
    creatorId: p.integer().references(() => users.id),
    name: p.text(),
    description: p.text(),
    sharedId: p.text().unique(),
});

export const flashcards = p.sqliteTable("flashcards", {
    ...defaultModel,
    topicId: p.integer().references(() => topics.id),
    creatorId: p.integer().references(() => users.id),
    title: p.text(),
    question: p.text(),
    answer: p.text(),
    tags: p.text({ mode: "json" }).$type<string[]>(),
    difficulty: p.text(),
    lastReviewed: p.integer({ mode: "timestamp" }),
    reviewCount: p.integer(),
});

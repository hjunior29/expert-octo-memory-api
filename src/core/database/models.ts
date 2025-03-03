import * as p from "drizzle-orm/pg-core"

const defaultModel = {
    id: p.serial(),
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

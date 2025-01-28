import { PgEnum, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './user';
import { relations } from 'drizzle-orm';
import { patent } from './patent';

export const patentUser = pgTable('patentUser', {
    id: text('id').notNull().primaryKey(),
    patentId: text('patentId')
        .references(() => patent.id)
        .notNull(),
    userId: text('userId')
        .references(() => user.id)
        .notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const patentUserRelation = relations(patentUser, ({ one }) => ({
    patent: one(patent, {
        fields: [patentUser.patentId],
        references: [patent.id],
    }),
    user: one(user, {
        fields: [patentUser.userId],
        references: [user.id],
    }),
}));

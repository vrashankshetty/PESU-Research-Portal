import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { journal } from './journal';
import { user } from './user';
import { relations } from 'drizzle-orm';

export const journalUser = pgTable('journalUser', {
    id: text('id').notNull().primaryKey(),
    journalId: text('journalId')
        .references(() => journal.id)
        .notNull(),
    userId: text('userId')
        .references(() => user.id)
        .notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const journalUserRelation = relations(journalUser, ({ one }) => ({
    journal: one(journal, {
        fields: [journalUser.journalId],
        references: [journal.id],
    }),
    user: one(user, {
        fields: [journalUser.userId],
        references: [user.id],
    }),
}));

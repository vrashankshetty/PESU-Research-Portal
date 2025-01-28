import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './user';
import { relations } from 'drizzle-orm';
import { conference } from './conference';

export const conferenceUser = pgTable('conferenceUser', {
    id: text('id').notNull().primaryKey(),
    conferenceId: text('conferenceId')
        .references(() => conference.id)
        .notNull(),
    userId: text('userId')
        .references(() => user.id)
        .notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const conferenceUserRelation = relations(conferenceUser, ({ one }) => ({
    conference: one(conference, {
        fields: [conferenceUser.conferenceId],
        references: [conference.id],
    }),
    user: one(user, {
        fields: [conferenceUser.userId],
        references: [user.id],
    }),
}));

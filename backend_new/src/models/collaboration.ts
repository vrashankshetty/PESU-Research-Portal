import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './user';
import { relations } from 'drizzle-orm';

export const collaboration = pgTable('collaboration', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    teacherAdminId: text('teacherAdminId')
                    .notNull()
                    .references(() => user.id),
    collaboratingAgency: text('collaboratingAgency').notNull(),
    participantName: text('participantName').notNull(),
    yearOfCollaboration: text('yearOfCollaboration').notNull(),
    duration: text('duration').notNull(), 
    natureOfActivity: text('natureOfActivity').notNull(),
    documentLink: text('documentLink'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});


export const collaborationRelation = relations(collaboration, ({ one, many }) => ({
    teacherAdmin: one(user, {
        fields: [collaboration.teacherAdminId],
        references: [user.id],
    }),
}));
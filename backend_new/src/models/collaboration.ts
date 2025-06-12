import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const collaboration = pgTable('collaboration', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    collaboratingAgency: text('collaboratingAgency').notNull(),
    participantName: text('participantName').notNull(),
    yearOfCollaboration: text('yearOfCollaboration').notNull(),
    duration: text('duration').notNull(), 
    natureOfActivity: text('natureOfActivity').notNull(),
    documentLink: text('documentLink'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});
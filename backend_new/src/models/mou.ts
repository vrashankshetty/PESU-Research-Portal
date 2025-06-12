import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';


export const mou = pgTable('mou', {
    id: text('id').primaryKey(),
    organizationName: text('organizationName').notNull(),
    yearOfSigning: text('yearOfSigning').notNull(),
    duration: text('duration').notNull(),
    activities: text('activities').notNull(),
    documentLink: text('documentLink'),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
});

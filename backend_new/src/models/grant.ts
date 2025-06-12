import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';


export const grant = pgTable('grant', {
    id: text('id').primaryKey(),
    schemeName: text('schemeName').notNull(),
    investigatorName: text('investigatorName').notNull(),
    fundingAgency: text('fundingAgency').notNull(),
    type: text('type').notNull(),
    department: text('department').notNull(),
    yearOfAward: text('yearOfAward').notNull(),
    fundsProvided: text('fundsProvided').notNull(),
    duration: text('duration').notNull(),
    documentLink: text('documentLink'),
    status: text('status'),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
});

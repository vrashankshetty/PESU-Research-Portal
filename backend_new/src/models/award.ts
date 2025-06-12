import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';


export const award = pgTable('award', {
    id: text('id').primaryKey(),
    yearOfAward: text('yearOfAward').notNull(),
    titleOfInnovation: text('titleOfInnovation').notNull(),
    awardeeName: text('awardeeName').notNull(),
    awardingAgency: text('awardingAgency').notNull(),
    category: text('category').notNull(),
    status: text('status'),
    documentLink: text('documentLink'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});


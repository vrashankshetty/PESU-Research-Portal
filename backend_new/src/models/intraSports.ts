
import { pgTable, text,timestamp} from 'drizzle-orm/pg-core';



export const intraSports = pgTable('intraSports', {
    id: text('id').primaryKey(),
    event: text('event').notNull(),
    startDate: timestamp('startDate').notNull(),
    endDate:timestamp('endDate').notNull(),
    link: text('link').notNull(),
    yearOfEvent: text('yearOfEvent').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
});
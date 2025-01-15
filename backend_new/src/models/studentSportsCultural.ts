
import { pgTable, text,timestamp} from 'drizzle-orm/pg-core';




export const studentSportsCultural = pgTable('studentSportsCultural', {
    id: text('id').primaryKey(),
    year: text('year').notNull(),
    eventDate: timestamp('eventDate').notNull(),
    eventName: text('eventName').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
});
 


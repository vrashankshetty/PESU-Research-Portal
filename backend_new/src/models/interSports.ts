
import { pgTable, text,timestamp} from 'drizzle-orm/pg-core';



export const interSports = pgTable('interSports', {
    id: text('id').primaryKey(),
    nameOfStudent: text('nameOfStudent').notNull(),
    nameOfEvent: text('nameOfEvent').notNull(),
    link: text('link').notNull(),
    nameOfUniv: text('nameOfUniv').notNull(),
    yearOfEvent: text('yearOfEvent').notNull(),
    teamOrIndi: text('teamOrIndi').notNull(),
    level: text('level').notNull(),
    nameOfAward: text('nameOfAward').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
});
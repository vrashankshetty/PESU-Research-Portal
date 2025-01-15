
import { integer, pgTable, text,timestamp} from 'drizzle-orm/pg-core';




export const studentCareerCounselling = pgTable('studentCareerCounselling', {
    id: text('id').primaryKey(),
    year: text('year').notNull(),
    activityName: text('activityName').notNull(),
    numberOfStudents: integer('numberOfStudents').notNull(),
    documentLink: text('documentLink'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
});
 


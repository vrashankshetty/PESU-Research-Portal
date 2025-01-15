
import { pgTable, text,timestamp} from 'drizzle-orm/pg-core';
import { user } from './user';
import { relations } from 'drizzle-orm';




export const departmentConductedActivity = pgTable('departmentConductedActivity', {
    id: text('id').primaryKey(),
    userId: text('userId').notNull().references(() => user.id),
    programTitle: text('programTitle').notNull(),
    durationStartDate: timestamp('durationStartDate').notNull(),
    durationEndDate: timestamp('durationEndDate').notNull(),
    documentLink: text('documentLink'),
    year: text('year').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
});
 

export const departmentConductedActivityRelation = relations(departmentConductedActivity, ({ one , many}) => ({
    user: one(user,{
      fields: [departmentConductedActivity.userId],
      references: [user.id]
    }),
  }));

import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './user';
import { relations } from 'drizzle-orm';

export const departmentAttendedActivity = pgTable('departmentAttendedActivity', {
    id: text('id').primaryKey(),
    userId: text('userId')
        .notNull()
        .references(() => user.id),
    programTitle: text('programTitle').notNull(),
    durationStartDate: timestamp('durationStartDate').notNull(),
    durationEndDate: timestamp('durationEndDate').notNull(),
    documentLink: text('documentLink'),
    year: text('year').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const departmentAttendedActivityRelation = relations(departmentAttendedActivity, ({ one, many }) => ({
    user: one(user, {
        fields: [departmentAttendedActivity.userId],
        references: [user.id],
    }),
}));

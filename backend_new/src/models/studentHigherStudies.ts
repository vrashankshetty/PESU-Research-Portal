import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const studentHigherStudies = pgTable('studentHigherStudies', {
    id: text('id').primaryKey(),
    studentName: text('studentName').notNull(),
    programGraduatedFrom: text('programGraduatedFrom').notNull(),
    institutionAdmittedTo: text('institutionAdmittedTo').notNull(),
    programmeAdmittedTo: text('programmeAdmittedTo').notNull(),
    documentLink: text('documentLink'),
    year: text('year').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
});

import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { user } from './user';
import { relations } from 'drizzle-orm';
import { patentUser } from './patentUser';

export const patent = pgTable('patent', {
    id: text('id').primaryKey(),
    teacherAdminId: text('teacherAdminId')
        .notNull()
        .references(() => user.id),
    campus: text('campus').notNull(),
    dept: text('dept').notNull(),
    patentNumber: text('patentNumber').notNull(),
    patentTitle: text('patentTitle').notNull(),
    isCapstone: boolean('isCapstone').default(false),
    year: text('year').notNull(),
    documentLink: text('documentLink').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const patentRelation = relations(patent, ({ one, many }) => ({
    teacherAdmin: one(user, {
        fields: [patent.teacherAdminId],
        references: [user.id],
    }),
    teachers: many(patentUser),
}));

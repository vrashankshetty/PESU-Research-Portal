import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './user';
import { relations } from 'drizzle-orm';


export const mou = pgTable('mou', {
    id: text('id').primaryKey(),
    teacherAdminId: text('teacherAdminId')
                    .notNull()
                    .references(() => user.id),
    organizationName: text('organizationName').notNull(),
    yearOfSigning: text('yearOfSigning').notNull(),
    duration: text('duration').notNull(),
    activities: text('activities').notNull(),
    documentLink: text('documentLink'),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
});



export const mouRelation = relations(mou, ({ one, many }) => ({
    teacherAdmin: one(user, {
        fields: [mou.teacherAdminId],
        references: [user.id],
    }),
}));
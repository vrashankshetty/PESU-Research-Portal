import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './user';
import { relations } from 'drizzle-orm';


export const award = pgTable('award', {
    id: text('id').primaryKey(),
    teacherAdminId: text('teacherAdminId')
            .notNull()
            .references(() => user.id),
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



export const awardRelation = relations(award, ({ one, many }) => ({
    teacherAdmin: one(user, {
        fields: [award.teacherAdminId],
        references: [user.id],
    }),
}));
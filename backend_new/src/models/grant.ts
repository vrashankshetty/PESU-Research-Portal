import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './user';
import { relations } from 'drizzle-orm';


export const grant = pgTable('grant', {
    id: text('id').primaryKey(),
    teacherAdminId: text('teacherAdminId')
                .notNull()
                .references(() => user.id),
    schemeName: text('schemeName').notNull(),
    investigatorName: text('investigatorName').notNull(),
    fundingAgency: text('fundingAgency').notNull(),
    type: text('type').notNull(),
    department: text('department').notNull(),
    yearOfAward: text('yearOfAward').notNull(),
    fundsProvided: text('fundsProvided').notNull(),
    duration: text('duration').notNull(),
    documentLink: text('documentLink'),
    status: text('status'),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
});



export const grantRelation = relations(grant, ({ one, many }) => ({
    teacherAdmin: one(user, {
        fields: [grant.teacherAdminId],
        references: [user.id],
    }),
}));
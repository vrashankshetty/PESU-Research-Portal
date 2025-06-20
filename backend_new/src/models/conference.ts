import { pgTable, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { user } from './user';
import { relations } from 'drizzle-orm';
import { conferenceUser } from './conferenceUser';

export const conference = pgTable('conference', {
    id: text('id').primaryKey(),
    teacherAdminId: text('teacherAdminId')
        .notNull()
        .references(() => user.id),
    totalAuthors: integer('totalAuthors').default(0),
    campus: text('campus').notNull(),
    dept: text('dept').notNull(),
    bookTitle: text('bookTitle').notNull(),
    paperTitle: text('paperTitle').notNull(),
    proceedings_conference_title: text('proceedings_conference_title').notNull(),
    volumeNo: text('volumeNo').notNull(),
    status:text('status'),
    issueNo: text('issueNo').notNull(),
    year: text('year').notNull(),
    pageNumber: integer('pageNumber').default(0),
    issn: text('issn').notNull(),
    is_affiliating_institution_same: boolean('is_affiliating_institution_same').default(false),
    publisherName: text('publisherName').notNull(),
    impactFactor: text('impactFactor').notNull(),
    core: text('core').notNull().default('NA'),
    link_of_paper: text('link_of_paper').notNull(),
    isCapstone: boolean('isCapstone').default(false),
    abstract: text('abstract').notNull(),
    keywords: text('keywords').array(),
    domain: text('domain').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const conferenceRelation = relations(conference, ({ one, many }) => ({
    teacherAdmin: one(user, {
        fields: [conference.teacherAdminId],
        references: [user.id],
    }),
    teachers: many(conferenceUser),
}));

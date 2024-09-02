
import { PgEnum, pgEnum, pgTable, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { campusEnum,departmentEnum } from './journal';



export const conference = pgTable('conference', {
    id: text('id').primaryKey(),
    serial_no:text('serial_no').notNull(),
    teacherName:text('teacherName').notNull(),
    coAuthors:text('coAuthors').array(),
    totalAuthors:integer('totalAuthors').default(0),
    facultyNames:text('facultyNames').array(),
    campus:campusEnum('campus').notNull(),
    dept:departmentEnum('dept').notNull(),
    bookTitle:text('bookTitle').notNull(),
    paperTitle:text('paperTitle').notNull(),
    proceedings_conference_title:text('proceedings_conference_title').notNull(),
    volumeNo:text('volumeNo').notNull(),
    issueNo:text('issueNo').notNull(),
    year:text('year').notNull(),
    issn:text('issn').notNull(),
    is_affiliating_institution_same:boolean('is_affiliating_institution_same').default(false),
    publisherName:text('publisherName').notNull(),
    impactFactor:text('impactFactor').notNull(),
    link_of_paper:text('link_of_paper').notNull(),
    isCapstone:boolean('isCapstone').default(false),
    abstract:text('abstract').notNull(),
    keywords:text('keywords').array(),
    domainExpertise:text('domainExpertise').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
});

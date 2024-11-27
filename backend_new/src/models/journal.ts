
import { PgEnum, pgEnum, pgTable, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { user } from './user';
import { relations } from 'drizzle-orm';
import { journalUser } from './journalUser';



const campusEnum: PgEnum<['EC','RR','HSN']> = pgEnum('campus', [
    'EC',
    'RR',
    'HSN'
]);


const departmentEnum: PgEnum<['EC','CSE']> = pgEnum('dept', [
    'EC','CSE'
]);


export const qnoEnum: PgEnum<['Q1','Q2','Q3','Q4','NA']> = pgEnum('qNo', [
    'Q1','Q2','Q3','Q4','NA'
]);


export const journal = pgTable('journal', {
    id: text('id').primaryKey(),
    title:text('title').notNull(),
    teacherAdminId:text('teacherAdminId').notNull().references(()=>user.id),
    campus:text('campus').notNull(),
    dept:text('dept').notNull(),
    journalName:text('journalName').notNull(),
    month:text('month').notNull(),
    year:text('year').notNull(),
    volumeNo:text('volumeNo').notNull(),
    issueNo:text('issueNo').notNull(),
    issn:text('issn').notNull(),
    websiteLink:text('websiteLink'),
    articleLink:text('articleLink'),
    isUGC:boolean('isUGC').default(false),
    isScopus:boolean('isScopus').default(false),
    isWOS:boolean('isWOS').default(false),
    qNo:text('qNo').notNull().default('NA'),
    impactFactor:text('impactFactor'),
    isCapstone:boolean('isCapstone').default(false),
    isAffiliating:boolean('isAffiliating').default(false),
    pageNumber:integer('pageNumber').default(0),
    abstract:text('abstract').notNull(),
    keywords:text('keywords').array(),
    domain:text('domain').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
});


export const journalRelation = relations(journal, ({ one,many }) => ({
    teacherAdmin: one(user,{
      fields: [journal.teacherAdminId],
      references: [user.id]
    }),
    teachers:many(journalUser)
  }));

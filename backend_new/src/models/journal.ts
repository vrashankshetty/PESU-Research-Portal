
import { PgEnum, pgEnum, pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';



export const campusEnum: PgEnum<['EC','RR','HSN']> = pgEnum('campus', [
    'EC',
    'RR',
    'HSN'
]);


export const departmentEnum: PgEnum<['EC','RR','HSN']> = pgEnum('dept', [
    'EC',
    'RR',
    'HSN'
]);

export const journal = pgTable('journal', {
    id: text('id').primaryKey(),
    serial_no:text('serial_no').notNull(),
    title:text('title').notNull(),
    facultyNames:text('facultyNames').array(),
    campus:campusEnum('campus').notNull(),
    dept:departmentEnum('dept').notNull(),
    journalName:text('journalName').notNull(),
    month:text('month').notNull(),
    year:text('year').notNull(),
    volumeNo:text('volumeNo').notNull(),
    issueNo:text('issueNo').notNull(),
    issn:text('issn').notNull(),
    websiteLink:text('websiteLink'),
    articleLink:text('articleLink'),
    isListed:boolean('isListed').default(false),
    abstract:text('abstract').notNull(),
    keywords:text('keywords').array(),
    domainExpertise:text('domainExpertise').notNull()
});

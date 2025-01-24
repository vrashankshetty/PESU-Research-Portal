import { pgTable, text, date, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('users', {
    id: text('id').primaryKey(),
    empId: text('empId').notNull().unique(),
    password: text('password').notNull(),
    name: text('name').notNull(),
    phno: text('phno').notNull(),
    dept: text('dept').notNull(),
    campus: text('campus').notNull(),
    panNo: text('panNo').notNull(),
    qualification: text('qualification').notNull(),
    designation: text('designation').notNull(),
    expertise: text('expertise').notNull(),
    dateofJoining: date('dateofJoining').notNull(),
    totalExpBfrJoin: text('totalExpBfrJoin').notNull(),
    googleScholarId: text('googleScholarId').notNull(),
    sId: text('sId').notNull(),
    oId: text('oId').notNull(),
    role: text('role').notNull().default('user'),
    accessTo : text('accessTo').notNull().default('none'),
    profileImg: text('profileImg'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
});

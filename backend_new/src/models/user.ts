
import { PgEnum, pgEnum, pgTable, text,date,timestamp} from 'drizzle-orm/pg-core';
import { campusEnum,departmentEnum } from './journal';


export const user = pgTable('user', {
    id: text('id').primaryKey(),
    empId:text('empId').notNull(),
    password:text('password').notNull(),
    name:text('name').notNull(),
    phno:text('phno').notNull(),
    dept:departmentEnum('dept').notNull(),
    campus:campusEnum('campus').notNull(),
    panNo:text('panNo').notNull(),
    qualification:text('qualification').notNull(),
    designation:text('designation').notNull(),
    expertise:text('expertise').notNull(),
    dateofJoining:date('dateofJoining').notNull(),
    totalExpBfrJoin:text('totalExpBfrJoin').notNull(),
    googleScholarId:text('googleScholarId').notNull(),
    sId:text('sId').notNull(),
    oId:text('oId').notNull(),
    profileImg:text('profileImg'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
});

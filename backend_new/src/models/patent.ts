
import { PgEnum, pgEnum, pgTable, text} from 'drizzle-orm/pg-core';
import { campusEnum,departmentEnum } from './journal';

export const patent = pgTable('patent', {
    id: text('id').primaryKey(),
    teacherName:text('teacherName').notNull(),
    campus:campusEnum('campus').notNull(),
    dept:departmentEnum('dept').notNull(),
    patentNumber:text('patentNumber').notNull(),
    patentTitle:text('patentTitle').notNull(),
    year:text('year').notNull(),
    documentLink:text('documentLink').notNull()
});

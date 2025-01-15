
import { pgTable, text,timestamp,boolean} from 'drizzle-orm/pg-core';


export const studentEntranceExam = pgTable('studentEntranceExam', {
    id: text('id').primaryKey(),
    year: text('year').notNull(),
    registrationNumber: text('registrationNumber').notNull(),
    studentName: text('studentName').notNull(),
    isNET: boolean('isNET').default(false),
    isSLET: boolean('isSLET').default(false),
    isGATE: boolean('isGATE').default(false),
    isGMAT: boolean('isGMAT').default(false),
    isCAT: boolean('isCAT').default(false),
    isGRE: boolean('isGRE').default(false),
    isJAM: boolean('isJAM').default(false),
    isIELTS: boolean('isIELTS').default(false),
    isTOEFL: boolean('isTOEFL').default(false),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
});
 


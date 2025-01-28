import db from '../../db';
import { errs } from '../../utils/catch-error';

export async function getStats() {
    try {
        const users = await db.query.user.findMany();
        const journals = await db.query.journal.findMany();
        const conferences = await db.query.conference.findMany();
        const patents = await db.query.patent.findMany();
        const dept_attended = await db.query.departmentAttendedActivity.findMany();
        const dept_conducted = await db.query.departmentConductedActivity.findMany();

        const stats = {
            users: users.length,
            journals: journals.length,
            conferences: conferences.length,
            patents: patents.length,
            dept_attended: dept_attended.length,
            dept_conducted: dept_conducted.length,
        };
        return stats;
    } catch (error) {
        errs(error);
    }
}

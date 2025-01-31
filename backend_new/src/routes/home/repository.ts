import db from '../../db';
import { errs } from '../../utils/catch-error';
import { journalUser } from '../../models/journalUser';
import { conferenceUser } from '../../models/conferenceUser';
import { patentUser } from '../../models/patentUser';

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

export async function getUserStats(userId: string) {
    try {
        const journals = await db.query.journal.findMany({
            where: (journal, { or, eq, inArray }) =>
                or(
                    eq(journal.teacherAdminId, userId),
                    inArray(
                        journal.id,
                        db
                            .select({ journalId: journalUser.journalId })
                            .from(journalUser)
                            .where(eq(journalUser.userId, userId)),
                    ),
                ),
        });

        const conferences = await db.query.conference.findMany({
            where: (conference, { or, eq, inArray }) =>
                or(
                    eq(conference.teacherAdminId, userId),
                    inArray(
                        conference.id,
                        db
                            .select({ conferenceId: conferenceUser.conferenceId })
                            .from(conferenceUser)
                            .where(eq(conferenceUser.userId, userId)),
                    ),
                ),
        });

        const patents = await db.query.patent.findMany({
            where: (patent, { or, eq, inArray }) =>
                or(
                    eq(patent.teacherAdminId, userId),
                    inArray(
                        patent.id,
                        db
                            .select({ patentId: patentUser.patentId })
                            .from(patentUser)
                            .where(eq(patentUser.userId, userId)),
                    ),
                ),
        });
        console.log('patents', patents);

        const dept_attended = await db.query.departmentAttendedActivity.findMany({
            where: (activity, { eq }) => eq(activity.userId, userId),
        });
        console.log('dept_attended');

        const dept_conducted = await db.query.departmentConductedActivity.findMany({
            where: (activity, { eq }) => eq(activity.userId, userId),
        });
        console.log('dept_conducted');

        return {
            journals: journals.length,
            conferences: conferences.length,
            patents: patents.length,
            dept_attended: dept_attended.length,
            dept_conducted: dept_conducted.length,
            total: journals.length + conferences.length + patents.length + dept_attended.length + dept_conducted.length,
        };
    } catch (error) {
        errs(error);
    }
}

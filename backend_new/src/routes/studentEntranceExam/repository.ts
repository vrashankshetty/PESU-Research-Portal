import { and, desc, eq, inArray } from 'drizzle-orm';
import db from '../../db';
import { errs } from '../../utils/catch-error';
import { generateRandomId } from '../../utils/generate-id';
import { studentEntranceExam } from '../../models/studentEntranceExam';
import { StudentEntranceExam } from '../../types';

export async function getEachActivity(id: string) {
    try {
        const activity = await db.query.studentEntranceExam.findFirst({
            where: and(eq(studentEntranceExam.id, id)),
        });
        return activity;
    } catch (error) {
        errs(error);
    }
}

export async function getAllActivities(query: any) {
    try {
        const {
            startYear,
            endYear,
            registrationNumber,
            studentName,
            isNET,
            isSLET,
            isGATE,
            isGMAT,
            isCAT,
            isGRE,
            isJAM,
            isIELTS,
            isTOEFL,
            documentLink,
        } = query;

        const boolConvert = (val: any) => (val === 'true' ? true : val === 'false' ? false : undefined);

        const activities = await db.query.studentEntranceExam.findMany({
            orderBy: desc(studentEntranceExam.createdAt),
        });

        const filteredActivities = activities.filter(activity => {
            let isValid = true;

            if (startYear && activity.year < startYear) {
                isValid = false;
            }
            if (endYear && activity.year > endYear) {
                isValid = false;
            }
            if (registrationNumber && activity.registrationNumber !== registrationNumber) {
                isValid = false;
            }
            if (studentName && activity.studentName !== studentName) {
                isValid = false;
            }
            if (isNET !== undefined && activity.isNET !== boolConvert(isNET)) {
                isValid = false;
            }
            if (isSLET !== undefined && activity.isSLET !== boolConvert(isSLET)) {
                isValid = false;
            }
            if (isGATE !== undefined && activity.isGATE !== boolConvert(isGATE)) {
                isValid = false;
            }
            if (isGMAT !== undefined && activity.isGMAT !== boolConvert(isGMAT)) {
                isValid = false;
            }
            if (isCAT !== undefined && activity.isCAT !== boolConvert(isCAT)) {
                isValid = false;
            }
            if (isGRE !== undefined && activity.isGRE !== boolConvert(isGRE)) {
                isValid = false;
            }
            if (isJAM !== undefined && activity.isJAM !== boolConvert(isJAM)) {
                isValid = false;
            }
            if (isIELTS !== undefined && activity.isIELTS !== boolConvert(isIELTS)) {
                isValid = false;
            }
            if (isTOEFL !== undefined && activity.isTOEFL !== boolConvert(isTOEFL)) {
                isValid = false;
            }
            if (documentLink !== undefined && activity.documentLink !== documentLink) {
                isValid = false;
            }
            return isValid;
        });

        return filteredActivities;
    } catch (error) {
        console.log('err in repo', error);
        errs(error);
    }
}

export async function createActivity(activityData: StudentEntranceExam) {
    try {
        await db
            .insert(studentEntranceExam)
            .values({
                id: generateRandomId(),
                ...activityData,
            })
            .returning();

        return { message: 'Successful' };
    } catch (error) {
        console.log(error);
        errs(error);
    }
}

export async function updateActivity(activityData: StudentEntranceExam, id: string) {
    try {
        const uptData = await db.query.studentEntranceExam.findFirst({
            where: and(eq(studentEntranceExam.id, id)),
        });

        if (!uptData) {
            return { status: 404, message: 'Not Found' };
        }

        const [updatedActivity] = await db
            .update(studentEntranceExam)
            .set({
                ...activityData,
            })
            .where(eq(studentEntranceExam.id, id))
            .returning();

        if (!updatedActivity?.id) {
            throw new Error('Error updating Activity');
        }

        return { message: 'Update successful' };
    } catch (error) {
        console.log('error', error);
        errs(error);
    }
}

export async function deleteActivity(id: string) {
    try {
        const getData = await db.query.studentEntranceExam.findFirst({
            where: eq(studentEntranceExam.id, id),
        });
        if (!getData) {
            return { status: 404, message: 'Not Found' };
        }
        await db.delete(studentEntranceExam).where(eq(studentEntranceExam.id, id));
        return { message: 'Delete successful' };
    } catch (error) {
        console.log(error);
        errs(error);
    }
}

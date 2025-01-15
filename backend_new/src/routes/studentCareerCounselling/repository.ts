
import { and, desc, eq, inArray } from 'drizzle-orm';
import db from '../../db';
import { errs } from '../../utils/catch-error';
import { generateRandomId } from '../../utils/generate-id';
import { studentCareerCounselling } from '../../models/studentCareerCounselling';
import { StudentCareerCounselling } from '../../types';



export async function getEachActivity(id: string) {
    try {
        const activity = await db.query.studentCareerCounselling.findFirst({
            where: and(eq(studentCareerCounselling.id, id)),
        });
        return activity;
    } catch (error) {
        errs(error);
    }
}

export async function getAllActivities(query:any) {
    try {
        const {
            startYear,
            endYear,
            activityName,
            numberOfStudents,
            documentLink
        } = query;

        const activities = await db.query.studentCareerCounselling.findMany({
            orderBy: desc(studentCareerCounselling.createdAt)
        });

        const filteredActivities = activities.filter(activity => {
            let isValid = true;
            if (startYear && activity.year < startYear) {
                isValid = false;
            }
            if (endYear && activity.year > endYear) {
                isValid = false;
            }
            if (activityName && activity.activityName !== activityName) {
                isValid = false;
            }
            if (numberOfStudents !== undefined && activity.numberOfStudents !== numberOfStudents) {
                isValid = false;
            }
            if (documentLink !== undefined && activity.documentLink !== documentLink) {
                isValid = false;
            }
            return isValid;
        });

        return filteredActivities;
    } catch (error) {
        console.log("err in repo", error);
        errs(error);
    }
}


export async function createActivity(activityData: StudentCareerCounselling) {
    try {
         await db.insert(studentCareerCounselling).values({
            id: generateRandomId(),
            ...activityData,
        }).returning();

        return { message: 'Successful' };

    } catch (error) {
        console.log(error);
        errs(error);
    }
}

export async function updateActivity(activityData: StudentCareerCounselling, id: string,) {
    try {
        const uptData = await db.query.studentCareerCounselling.findFirst({
            where: and(eq(studentCareerCounselling.id, id))
        });

        if (!uptData) {
            return { status: 404, message: 'Not Found' };
        }

        const [updatedActivity] = await db.update(studentCareerCounselling).set({
            ...activityData,
        }).where(eq(studentCareerCounselling.id, id)).returning();

        if (!updatedActivity?.id) {
            throw new Error('Error updating Activity');
        }

        return { message: 'Update successful' };
    } catch (error) {
        console.log("error", error);
        errs(error);
    }
}

export async function deleteActivity(id: string) {
    try {
        const getData = await db.query.studentCareerCounselling.findFirst({
            where: eq(studentCareerCounselling.id, id)
        });
        if (!getData) {
            return { status: 404, message: 'Not Found' };
        }
        await db.delete(studentCareerCounselling).where(eq(studentCareerCounselling.id, id));
        return { message: 'Delete successful' };
    } catch (error) {
        console.log(error);
        errs(error);
    }
}
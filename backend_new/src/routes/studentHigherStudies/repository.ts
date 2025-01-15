
import { and, desc, eq, inArray } from 'drizzle-orm';
import db from '../../db';
import { errs } from '../../utils/catch-error';
import { generateRandomId } from '../../utils/generate-id';
import { studentHigherStudies } from '../../models/studentHigherStudies';
import { StudentHigherStudies } from '../../types';


export async function getEachActivity(id: string) {
    try {
        const activity = await db.query.studentHigherStudies.findFirst({
            where: and(eq(studentHigherStudies.id, id)),
        });
        return activity;
    } catch (error) {
        errs(error);
    }
}

export async function getAllActivities(query:any) {
    try {
        const { startYear, endYear, studentName, programGraduatedFrom, institutionAdmittedTo, programmeAdmittedTo } = query;
        const filters: any = {};

        if (startYear) {
            filters.year = { gte: startYear };
        }
        if (endYear) {
            filters.year = { ...filters.year, lte: endYear };
        }
        if (studentName) {
            filters.studentName = studentName;
        }
        if (programGraduatedFrom) {
            filters.programGraduatedFrom = programGraduatedFrom;
        }
        if (institutionAdmittedTo) {
            filters.institutionAdmittedTo = institutionAdmittedTo;
        }
        if (programmeAdmittedTo) {
            filters.programmeAdmittedTo = programmeAdmittedTo;
        }

        const activities = await db.query.studentHigherStudies.findMany({
            orderBy: desc(studentHigherStudies.createdAt)
        });

        const filteredActivities = activities.filter(activity => {
            let isValid = true;
            if (startYear && activity.year < startYear) {
                isValid = false;
            }
            if (endYear && activity.year > endYear) {
                isValid = false;
            }
            if (studentName && activity.studentName !== studentName) {
                isValid = false;
            }
            if (programGraduatedFrom && activity.programGraduatedFrom !== programGraduatedFrom) {
                isValid = false;
            }
            if (institutionAdmittedTo && activity.institutionAdmittedTo !== institutionAdmittedTo) {
                isValid = false;
            }
            if (programmeAdmittedTo && activity.programmeAdmittedTo !== programmeAdmittedTo) {
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


export async function createActivity(activityData: StudentHigherStudies) {
    try {
         await db.insert(studentHigherStudies).values({
            id: generateRandomId(),
            ...activityData,
        }).returning();

        return { message: 'Successful' };

    } catch (error) {
        console.log(error);
        errs(error);
    }
}

export async function updateActivity(activityData: StudentHigherStudies, id: string,) {
    try {
        const uptData = await db.query.studentHigherStudies.findFirst({
            where: and(eq(studentHigherStudies.id, id))
        });

        if (!uptData) {
            return { status: 404, message: 'Not Found' };
        }

        const [updatedActivity] = await db.update(studentHigherStudies).set({
            ...activityData,
        }).where(eq(studentHigherStudies.id, id)).returning();

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
        const getData = await db.query.studentHigherStudies.findFirst({
            where: eq(studentHigherStudies.id, id)
        });
        if (!getData) {
            return { status: 404, message: 'Not Found' };
        }
        await db.delete(studentHigherStudies).where(eq(studentHigherStudies.id, id));
        return { message: 'Delete successful' };
    } catch (error) {
        console.log(error);
        errs(error);
    }
}
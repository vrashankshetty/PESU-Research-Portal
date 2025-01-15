
import { and, desc, eq, inArray } from 'drizzle-orm';
import db from '../../db';
import { errs } from '../../utils/catch-error';
import { generateRandomId } from '../../utils/generate-id';
import { departmentAttendedActivity } from '../../models/departmentAttendedActivity';
import { DepartmentAttendedActivity } from '../../types';


export async function getEachActivity(id: string,userId:string) {
    try {
        const activity = await db.query.departmentAttendedActivity.findFirst({
            where: and(eq(departmentAttendedActivity.id, id),eq(departmentAttendedActivity.userId, userId)),
        });
        return activity;
    } catch (error) {
        errs(error);
    }
}

export async function getAllActivities(userId:string,query: any) {
    try {
        const {
            durationStartDate,
            durationEndDate,
            year,
            nameOfProgram,
            minnoOfParticipants,
            maxnoOfParticipants
        } = query;

        const activities = await db.query.departmentAttendedActivity.findMany({
            where:eq(departmentAttendedActivity.userId, userId),
            orderBy: desc(departmentAttendedActivity.createdAt)
        });

        const filteredActivities = activities.filter(activity => {
            let isValid = true;
            if (durationStartDate && new Date(activity.createdAt) < new Date(durationStartDate)) {
                isValid = false;
            }
            if (durationEndDate && new Date(activity.createdAt) > new Date(durationEndDate)) {
                isValid = false;
            }
            if (year && activity.year !== year) {
                isValid = false;
            }
            if (nameOfProgram && activity.nameOfProgram !== nameOfProgram) {
                isValid = false;
            }
            if (minnoOfParticipants && activity.noOfParticipants < minnoOfParticipants) {
                isValid = false;
            }
            if (maxnoOfParticipants && activity.noOfParticipants > maxnoOfParticipants) {
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

export async function createActivity(activityData: DepartmentAttendedActivity,userId:string) {
    try {
         await db.insert(departmentAttendedActivity).values({
            id: generateRandomId(),
            userId:userId,
            ...activityData,
            durationStartDate: new Date(activityData.durationStartDate),
            durationEndDate: new Date(activityData.durationEndDate),
        }).returning();

        return { message: 'Successful' };

    } catch (error) {
        console.log(error);
        errs(error);
    }
}

export async function updateActivity(activityData: DepartmentAttendedActivity, id: string,userId:string) {
    try {
        const uptData = await db.query.departmentAttendedActivity.findFirst({
            where: and(eq(departmentAttendedActivity.id, id),eq(departmentAttendedActivity.userId, userId))
        });

        if (!uptData) {
            return { status: 404, message: 'Not Found' };
        }

        const [updatedActivity] = await db.update(departmentAttendedActivity).set({
            ...activityData,
            durationStartDate: new Date(activityData.durationStartDate),
            durationEndDate: new Date(activityData.durationEndDate),
        }).where(eq(departmentAttendedActivity.id, id)).returning();

        if (!updatedActivity?.id) {
            throw new Error('Error updating Activity');
        }

        return { message: 'Update successful' };
    } catch (error) {
        console.log("error", error);
        errs(error);
    }
}

export async function deleteActivity(id: string,userId:string) {
    try {
        const getData = await db.query.departmentAttendedActivity.findFirst({
            where: and(eq(departmentAttendedActivity.id, id),eq(departmentAttendedActivity.userId, userId)),
        });
        if (!getData) {
            return { status: 404, message: 'Not Found' };
        }
        await db.delete(departmentAttendedActivity).where(eq(departmentAttendedActivity.id, id));
        return { message: 'Delete successful' };
    } catch (error) {
        console.log(error);
        errs(error);
    }
}
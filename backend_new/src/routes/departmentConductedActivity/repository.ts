import { and, desc, eq, inArray } from 'drizzle-orm';
import db from '../../db';
import { errs } from '../../utils/catch-error';
import { generateRandomId } from '../../utils/generate-id';
import { departmentConductedActivity } from '../../models/departmentConductedActivity';
import { DepartmentConductedActivity } from '../../types';

export async function getEachActivity(id: string, userId: string, role: string, accessTo: string) {
    try {
        if (role === 'admin' && (accessTo === 'all' || accessTo === 'department')) {
            const activity = await db.query.departmentConductedActivity.findFirst({
                where: and(eq(departmentConductedActivity.id, id)),
            });
            return activity;
        }
        const activity = await db.query.departmentConductedActivity.findFirst({
            where: and(eq(departmentConductedActivity.id, id), eq(departmentConductedActivity.userId, userId)),
        });
        return activity;
    } catch (error) {
        errs(error);
    }
}

export async function getAllActivities(userId: string, query: any, role: string, accessTo: string) {
    try {
        const { durationStartDate, durationEndDate, year, nameOfProgram, minnoOfParticipants, maxnoOfParticipants } =
            query;

        if (role === 'admin' && (accessTo === 'all' || accessTo === 'department')) {
            const activities = await db.query.departmentConductedActivity.findMany({
                orderBy: desc(departmentConductedActivity.createdAt),
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
        }

        const activities = await db.query.departmentConductedActivity.findMany({
            where: eq(departmentConductedActivity.userId, userId),
            orderBy: desc(departmentConductedActivity.createdAt),
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
        console.log('err in repo', error);
        errs(error);
    }
}

export async function createActivity(activityData: DepartmentConductedActivity, userId: string) {
    try {
        await db
            .insert(departmentConductedActivity)
            .values({
                id: generateRandomId(),
                userId: userId,
                ...activityData,
                durationStartDate: new Date(activityData.durationStartDate),
                durationEndDate: new Date(activityData.durationEndDate),
            })
            .returning();

        return { message: 'Successful' };
    } catch (error) {
        console.log(error);
        errs(error);
    }
}

export async function updateActivity(activityData: DepartmentConductedActivity, id: string, userId: string) {
    try {
        const uptData = await db.query.departmentConductedActivity.findFirst({
            where: and(eq(departmentConductedActivity.id, id), eq(departmentConductedActivity.userId, userId)),
        });

        if (!uptData) {
            return { status: 404, message: 'Not Found' };
        }

        const [updatedActivity] = await db
            .update(departmentConductedActivity)
            .set({
                ...activityData,
                durationStartDate: new Date(activityData.durationStartDate),
                durationEndDate: new Date(activityData.durationEndDate),
            })
            .where(eq(departmentConductedActivity.id, id))
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

export async function deleteActivity(id: string, userId: string) {
    try {
        const getData = await db.query.departmentConductedActivity.findFirst({
            where: and(eq(departmentConductedActivity.id, id), eq(departmentConductedActivity.userId, userId)),
        });
        if (!getData) {
            return { status: 404, message: 'Not Found' };
        }
        await db.delete(departmentConductedActivity).where(eq(departmentConductedActivity.id, id));
        return { message: 'Delete successful' };
    } catch (error) {
        console.log(error);
        errs(error);
    }
}

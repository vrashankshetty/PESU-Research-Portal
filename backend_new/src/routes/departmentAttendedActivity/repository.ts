import { and, desc, eq, ilike } from 'drizzle-orm';
import db from '../../db';
import { errs } from '../../utils/catch-error';
import { generateRandomId } from '../../utils/generate-id';
import { DepartmentAttendedActivity } from '../../types';
import { departmentAttendedActivity } from '../../models/departmentAttendedActivity';
import { user } from '../../models/user';

export async function getEachActivity(id: string, userId: string, role: string, accessTo: string) {
    try {
        if (role === 'admin' && (accessTo === 'all' || accessTo === 'department')) {
            const activity = await db.query.departmentAttendedActivity.findFirst({
                where: and(eq(departmentAttendedActivity.id, id)),
            });
            return activity;
        }
        const activity = await db.query.departmentAttendedActivity.findFirst({
            where: and(eq(departmentAttendedActivity.id, id), eq(departmentAttendedActivity.userId, userId)),
        });
        return activity;
    } catch (error) {
        errs(error);
    }
}

export async function getAllActivities(userId: string, query: any, role: string, accessTo: string) {
    try {
        const { durationStartDate, durationEndDate, year, programTitle } = query;

        if (role === 'admin' && (accessTo === 'all' || accessTo === 'department')) {
            const activities = await db.query.departmentAttendedActivity.findMany({
                orderBy: desc(departmentAttendedActivity.createdAt),
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
                if (programTitle && activity.programTitle !== programTitle) {
                    isValid = false;
                }
                return isValid;
            });

            return filteredActivities;
        }
        const activities = await db.query.departmentAttendedActivity.findMany({
            where: eq(departmentAttendedActivity.userId, userId),
            orderBy: desc(departmentAttendedActivity.createdAt),
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
            if (programTitle && activity.programTitle !== programTitle) {
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

export async function createActivity(activityData: DepartmentAttendedActivity, userId: string) {
    try {
        await db
            .insert(departmentAttendedActivity)
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

export async function updateActivity(activityData: DepartmentAttendedActivity, id: string, userId: string,role: string, accessTo: string) {
    try {
        let uptData;
        if (role === 'admin' && (accessTo === 'all' || accessTo === 'department')) {
            uptData = await db.query.departmentAttendedActivity.findFirst({
                where: and(eq(departmentAttendedActivity.id, id)),
            });   
        }else{
            uptData = await db.query.departmentAttendedActivity.findFirst({
                where: and(eq(departmentAttendedActivity.id, id), eq(departmentAttendedActivity.userId, userId)),
            });
        }
        if (!uptData) {
            return { status: 404, message: 'Not Found' };
        }

        const [updatedActivity] = await db
            .update(departmentAttendedActivity)
            .set({
                ...activityData,
                durationStartDate: new Date(activityData.durationStartDate),
                durationEndDate: new Date(activityData.durationEndDate),
            })
            .where(eq(departmentAttendedActivity.id, id))
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
        const getData = await db.query.departmentAttendedActivity.findFirst({
            where: and(eq(departmentAttendedActivity.id, id), eq(departmentAttendedActivity.userId, userId)),
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



export async function seedActivity(patentData: DepartmentAttendedActivity, name: string) {
    let patentId = '';
    try {
        const user1 = await db.query.user.findFirst({
            where: ilike(user.name, `%${name}%`),
        });
        if (!user1) {
            throw new Error('User not found');
        }

        const [insertedPatent] = await db
            .insert(departmentAttendedActivity)
            .values({
                id: generateRandomId(),
                userId: user1.id,
                ...patentData,
                durationStartDate: new Date(patentData.durationStartDate),
                durationEndDate: new Date(patentData.durationEndDate),
            })
            .returning();

        if (!insertedPatent?.id) {
            throw new Error('Error creating Patent');
        }
        patentId = insertedPatent.id;

        return { message: 'Successful' };
    } catch (error) {
        if (patentId) {
            await Promise.all([
                db.delete(departmentAttendedActivity).where(eq(departmentAttendedActivity.id, patentId)),
            ]);
        }
        console.log(error);
        errs(error);
    }
}

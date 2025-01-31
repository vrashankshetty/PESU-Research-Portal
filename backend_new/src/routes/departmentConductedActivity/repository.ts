import { and, desc, eq, ilike, inArray } from 'drizzle-orm';
import db from '../../db';
import { errs } from '../../utils/catch-error';
import { generateRandomId } from '../../utils/generate-id';
import { departmentConductedActivity } from '../../models/departmentConductedActivity';
import { DepartmentConductedActivity } from '../../types';
import { user } from '../../models/user';

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

export async function updateActivity(activityData: DepartmentConductedActivity, id: string, userId: string,role: string, accessTo: string) {
    try {

        let uptData;
        if (role === 'admin' && (accessTo === 'all' || accessTo === 'department')) {
            uptData = await db.query.departmentConductedActivity.findFirst({
                where: and(eq(departmentConductedActivity.id, id)),
            });
        }else{
            uptData = await db.query.departmentConductedActivity.findFirst({
                where: and(eq(departmentConductedActivity.id, id), eq(departmentConductedActivity.userId, userId)),
            });
        }
        
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



export async function seedActivity(patentData: DepartmentConductedActivity, name: string) {
    let patentId = '';
    try {
        const user1 = await db.query.user.findFirst({
            where: ilike(user.name, `%${name}%`),
        });
        if (!user1) {
            throw new Error('User not found');
        }

        const [insertedPatent] = await db
            .insert(departmentConductedActivity)
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
                db.delete(departmentConductedActivity).where(eq(departmentConductedActivity.id, patentId)),
            ]);
        }
        console.log(error);
        errs(error);
    }
}

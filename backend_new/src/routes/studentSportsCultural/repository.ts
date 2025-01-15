
import { and, desc, eq, inArray } from 'drizzle-orm';
import db from '../../db';
import { errs } from '../../utils/catch-error';
import { generateRandomId } from '../../utils/generate-id';
import { studentSportsCultural } from '../../models/studentSportsCultural';
import { StudentSportsCultural } from '../../types';




export async function getEachActivity(id: string) {
    try {
        const activity = await db.query.studentSportsCultural.findFirst({
            where: and(eq(studentSportsCultural.id, id)),
        });
        return activity;
    } catch (error) {
        errs(error);
    }
}

export async function getAllActivities(query: any) {
    try {
        const { startYear, endYear, eventName, startDate, endDate } = query;
        const filters: any = {};
        if (startYear) {
            filters.year = { gte: startYear };
        }
        if (endYear) {
            filters.year = { lte: endYear };
        }
        if (eventName) {
            filters.eventName = eventName;
        }
        if (startDate) {
            filters.eventDate = { gte: new Date(startDate) };
        }
        if (endDate) {
            filters.eventDate = { lte: new Date(endDate) };
        }
        const activities = await db.query.studentSportsCultural.findMany({
            orderBy: desc(studentSportsCultural.createdAt)
        });
        const filteredActivities = activities.filter(activity => {
            let isValid = true;
            if (startYear && activity.year < startYear) {
                isValid = false;
            }
            if (endYear && activity.year > endYear) {
                isValid = false;
            }
            if (eventName && activity.eventName !== eventName) {
                isValid = false;
            }
            if (startDate && new Date(activity.eventDate) < new Date(startDate)) {
                isValid = false;
            }
            if (endDate && new Date(activity.eventDate) > new Date(endDate)) {
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


export async function createActivity(activityData: StudentSportsCultural) {
    try {
         await db.insert(studentSportsCultural).values({
            id: generateRandomId(),
            ...activityData,
            eventDate:new Date(activityData.eventDate)
        }).returning();

        return { message: 'Successful' };

    } catch (error) {
        console.log(error);
        errs(error);
    }
}

export async function updateActivity(activityData: StudentSportsCultural, id: string,) {
    try {
        const uptData = await db.query.studentSportsCultural.findFirst({
            where: and(eq(studentSportsCultural.id, id))
        });

        if (!uptData) {
            return { status: 404, message: 'Not Found' };
        }

        const [updatedActivity] = await db.update(studentSportsCultural).set({
            ...activityData,
            eventDate:new Date(activityData.eventDate),
        }).where(eq(studentSportsCultural.id, id)).returning();

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
        const getData = await db.query.studentSportsCultural.findFirst({
            where: eq(studentSportsCultural.id, id)
        });
        if (!getData) {
            return { status: 404, message: 'Not Found' };
        }
        await db.delete(studentSportsCultural).where(eq(studentSportsCultural.id, id));
        return { message: 'Delete successful' };
    } catch (error) {
        console.log(error);
        errs(error);
    }
}
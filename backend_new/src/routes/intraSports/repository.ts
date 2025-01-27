
import { and, desc, eq, inArray } from 'drizzle-orm';
import db from '../../db';
import { errs } from '../../utils/catch-error';
import { generateRandomId } from '../../utils/generate-id';
import { IntraSports } from '../../types';
import { intraSports } from '../../models/intraSports';


export async function getEachActivity(id: string) {
    try {
        const activity = await db.query.intraSports.findFirst({
            where: and(eq(intraSports.id, id)),
        });
        return activity;
    } catch (error) {
        errs(error);
    }
}

export async function getAllActivities(query: any) {
    try {
        const {
            event,
            startDate,
            endDate,
            link,
            startYearOfEvent,
            endYearOfEvent,
        } = query;

        const activities = await db.query.intraSports.findMany({
            orderBy: desc(intraSports.createdAt)
        });

        const filteredActivities = activities.filter(activity => {
            let isValid = true;
            if (startYearOfEvent && activity.yearOfEvent < startYearOfEvent) {
                isValid = false;
            }
            if (startDate && activity.startDate < startDate) {
                isValid = false;
            }
            if (endDate && activity.endDate > endDate) {
                isValid = false;
            }
            if (endYearOfEvent && activity.yearOfEvent > endYearOfEvent) {
                isValid = false;
            }
            if (event && activity.event !== event) {
                isValid = false;
            }
            if (link && activity.link !== link) {
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


export async function createActivity(activityData: IntraSports) {
    try {
         await db.insert(intraSports).values({
            id: generateRandomId(),
            ...activityData,
            startDate: new Date(activityData.startDate),
            endDate: new Date(activityData.endDate),
        }).returning();

        return { message: 'Successful' };

    } catch (error) {
        console.log(error);
        errs(error);
    }
}

export async function updateActivity(activityData: IntraSports, id: string,) {
    try {
        const uptData = await db.query.intraSports.findFirst({
            where: and(eq(intraSports.id, id))
        });

        if (!uptData) {
            return { status: 404, message: 'Not Found' };
        }

        const [updatedActivity] = await db.update(intraSports).set({
            ...activityData,
        }).where(eq(intraSports.id, id)).returning();

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
        const getData = await db.query.intraSports.findFirst({
            where: eq(intraSports.id, id)
        });
        if (!getData) {
            return { status: 404, message: 'Not Found' };
        }
        await db.delete(intraSports).where(eq(intraSports.id, id));
        return { message: 'Delete successful' };
    } catch (error) {
        console.log(error);
        errs(error);
    }
}

import { and, desc, eq, inArray } from 'drizzle-orm';
import db from '../../db';
import { errs } from '../../utils/catch-error';
import { generateRandomId } from '../../utils/generate-id';
import { InterSports } from '../../types';
import { interSports } from '../../models/interSports';


export async function getEachActivity(id: string) {
    try {
        const activity = await db.query.interSports.findFirst({
            where: and(eq(interSports.id, id)),
        });
        return activity;
    } catch (error) {
        errs(error);
    }
}

export async function getAllActivities(query: any) {
    try {
        const {
            nameOfStudent,
            nameOfEvent,
            link,
            nameOfUniv,
            startYearOfEvent,
            endYearOfEvent,
            teamOrIndi,
            level,
            nameOfAward,
        } = query;

        const activities = await db.query.interSports.findMany({
            orderBy: desc(interSports.createdAt)
        });

        const filteredActivities = activities.filter(activity => {
            let isValid = true;
            if (startYearOfEvent && activity.yearOfEvent < startYearOfEvent) {
                isValid = false;
            }
            if (endYearOfEvent && activity.yearOfEvent > endYearOfEvent) {
                isValid = false;
            }
            if (nameOfStudent && activity.nameOfStudent !== nameOfStudent) {
                isValid = false;
            }
            if (nameOfEvent && activity.nameOfEvent !== nameOfEvent) {
                isValid = false;
            }
            if (link && activity.link !== link) {
                isValid = false;
            }
            if (nameOfUniv && activity.nameOfUniv !== nameOfUniv) {
                isValid = false;
            }
            if (teamOrIndi && activity.teamOrIndi !== teamOrIndi) {
                isValid = false;
            }
            if (level && activity.level !== level) {
                isValid = false;
            }
            if (nameOfAward && activity.nameOfAward !== nameOfAward) {
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


export async function createActivity(activityData: InterSports) {
    try {
         await db.insert(interSports).values({
            id: generateRandomId(),
            ...activityData,
        }).returning();

        return { message: 'Successful' };

    } catch (error) {
        console.log(error);
        errs(error);
    }
}

export async function updateActivity(activityData: InterSports, id: string,) {
    try {
        const uptData = await db.query.interSports.findFirst({
            where: and(eq(interSports.id, id))
        });

        if (!uptData) {
            return { status: 404, message: 'Not Found' };
        }

        const [updatedActivity] = await db.update(interSports).set({
            ...activityData,
        }).where(eq(interSports.id, id)).returning();

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
        const getData = await db.query.interSports.findFirst({
            where: eq(interSports.id, id)
        });
        if (!getData) {
            return { status: 404, message: 'Not Found' };
        }
        await db.delete(interSports).where(eq(interSports.id, id));
        return { message: 'Delete successful' };
    } catch (error) {
        console.log(error);
        errs(error);
    }
}
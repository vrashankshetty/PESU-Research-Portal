
import { eq } from 'drizzle-orm';
import db from '../../db';
import { errs } from '../../utils/catch-error';
import { Conference } from '../../types';
import { generateRandomId } from '../../utils/generate-id';
import { conference } from '../../models/conference';



export async function getEachConferece(id: string) {
    try {
        return await db.query.conference.findFirst({
            where:eq(conference.id,id)
        })
    } catch (error) {
        errs(error);
    }
}


export async function getAllConference() {
    try {
        return await db.query.conference.findMany()
    } catch (error) {
        errs(error);
    }
}


export async function createConference(conferenceData:Conference) {
    try {
        const data = await db.insert(conference).values({
            id:generateRandomId(),
            ...conferenceData
        }).returning();
        return data;
    } catch (error) {
        errs(error);
    }
}


export async function updateConference(conferenceData:Conference,id:string) {
    try {
        const data = await db.update(conference).set({
            ...conferenceData
        }).where(eq(conference.id,id)).returning();
        return data;
    } catch (error) {
        errs(error);
    }
}



export async function deleteConference(id:string) {
    try {
        const getData = await db.query.conference.findFirst({
            where:eq(conference.id,id)
        })
        await db.delete(conference).where(eq(conference.id,id));
        return getData;
    } catch (error) {
        errs(error);
    }
}
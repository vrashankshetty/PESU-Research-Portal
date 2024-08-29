
import { eq } from 'drizzle-orm';
import db from '../../db';
import { errs } from '../../utils/catch-error';
import { Conference, Patent } from '../../types';
import { generateRandomId } from '../../utils/generate-id';
import { patent } from '../../models/patent';



export async function getEachPatent(id: string) {
    try {
        return await db.query.patent.findFirst({
            where:eq(patent.id,id)
        })
    } catch (error) {
        errs(error);
    }
}


export async function getAllPatent() {
    try {
        return await db.query.patent.findMany()
    } catch (error) {
        errs(error);
    }
}


export async function createPatent(patentData:Patent) {
    try {
        const data = await db.insert(patent).values({
            id:generateRandomId(),
            ...patentData
        }).returning();
        return data;
    } catch (error) {
        errs(error);
    }
}


export async function updatePatent(patentData:Patent,id:string) {
    try {
        const data = await db.update(patent).set({
            ...patentData
        }).where(eq(patent.id,id)).returning();
        return data;
    } catch (error) {
        errs(error);
    }
}



export async function deletePatent(id:string) {
    try {
        const getData = await db.query.patent.findFirst({
            where:eq(patent.id,id)
        })
        await db.delete(patent).where(eq(patent.id,id));
        return getData;
    } catch (error) {
        errs(error);
    }
}
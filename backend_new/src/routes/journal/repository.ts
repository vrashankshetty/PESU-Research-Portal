
import { eq } from 'drizzle-orm';
import db from '../../db';
import { journal } from '../../models/journal';
import { errs } from '../../utils/catch-error';
import { Journal } from '../../types';
import { generateRandomId } from '../../utils/generate-id';



export async function getEachJournal(id: string) {
    try {
        return await db.query.journal.findFirst({
            where:eq(journal.id,id)
        })
    } catch (error) {
        errs(error);
    }
}


export async function getAllJournal() {
    try {
        return await db.query.journal.findMany()
    } catch (error) {
        errs(error);
    }
}


export async function createJournal(journalData:Journal) {
    try {
        const data = await db.insert(journal).values({
            id:generateRandomId(),
            ...journalData
        }).returning();
        return data;
    } catch (error) {
        errs(error);
    }
}


export async function updateJournal(journalData:Journal,id:string) {
    try {
        const data = await db.update(journal).set({
            ...journalData
        }).where(eq(journal.id,id)).returning();
        return data;
    } catch (error) {
        errs(error);
    }
}



export async function deleteJournal(id:string) {
    try {
        const getData = await db.query.journal.findFirst({
            where:eq(journal.id,id)
        })
        await db.delete(journal).where(eq(journal.id,id));
        return getData;
    } catch (error) {
        errs(error);
    }
}
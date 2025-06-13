import { and, desc, eq } from 'drizzle-orm';
import db from '../../db';
import { errs } from '../../utils/catch-error';
import { generateRandomId } from '../../utils/generate-id';
import { award } from '../../models/award';
import { Award } from '../../types';

export async function getEachAward(id: string) {
    try {
        const awardData = await db.query.award.findFirst({
            where: and(eq(award.id, id)),
        });
        return awardData;
    } catch (error) {
        errs(error);
    }
}

export async function getAllAwards(query: any) {
    try {
        const { startYear, endYear, awardeeName, awardingAgency, category, titleOfInnovation } = query;
        
        const awards = await db.query.award.findMany({
            orderBy: desc(award.createdAt),
        });

        const filteredAwards = awards.filter(awardItem => {
            let isValid = true;
            if (startYear && awardItem.yearOfAward < startYear) {
                isValid = false;
            }
            if (endYear && awardItem.yearOfAward > endYear) {
                isValid = false;
            }
            if (awardeeName && awardItem.awardeeName !== awardeeName) {
                isValid = false;
            }
            if (awardingAgency && awardItem.awardingAgency !== awardingAgency) {
                isValid = false;
            }
            if (category && awardItem.category !== category) {
                isValid = false;
            }
            if (titleOfInnovation && awardItem.titleOfInnovation !== titleOfInnovation) {
                isValid = false;
            }
            return isValid;
        });

        return filteredAwards;
    } catch (error) {
        console.log('err in repo', error);
        errs(error);
    }
}

export async function createAward(awardData: Award,userId:string) {
    try {
        await db
            .insert(award)
            .values({
                id: generateRandomId(),
                teacherAdminId:userId,
                ...awardData,
            })
            .returning();

        return { message: 'Successful' };
    } catch (error) {
        console.log(error);
        errs(error);
    }
}

export async function updateAward(awardData: Award, id: string) {
    try {
        const existingData = await db.query.award.findFirst({
            where: and(eq(award.id, id)),
        });

        if (!existingData) {
            return { status: 404, message: 'Award not found' };
        }

        const [updatedAward] = await db
            .update(award)
            .set({
                ...awardData,
                updatedAt: new Date()
            })
            .where(eq(award.id, id))
            .returning();

        if (!updatedAward?.id) {
            throw new Error('Error updating award');
        }

        return { message: 'Update successful' };
    } catch (error) {
        console.log('error', error);
        errs(error);
    }
}

export async function deleteAward(id: string, role: string, accessTo: string) {
    try {
        const existingData = await db.query.award.findFirst({
            where: eq(award.id, id),
        });

        if (!existingData) {
            return { status: 404, message: 'Award not found' };
        }

        if (role === 'admin' && (accessTo === 'all' || accessTo === 'research')) {
            await db.delete(award).where(eq(award.id, id));
            return { message: 'Delete successful' };
        }
        
        return { status: 403, message: 'Forbidden' };
    } catch (error) {
        console.log(error);
        errs(error);
    }
}
import { and, desc, eq } from 'drizzle-orm';
import db from '../../db';
import { errs } from '../../utils/catch-error';
import { generateRandomId } from '../../utils/generate-id';
import { mou } from '../../models/mou';
import { MOU } from '../../types';

export async function getEachMOU(id: string) {
    try {
        const mouData = await db.query.mou.findFirst({
            where: and(eq(mou.id, id)),
        });
        return mouData;
    } catch (error) {
        errs(error);
    }
}

export async function getAllMOUs(query: any) {
    try {
        const { startYear, endYear, organizationName, duration } = query;
        
        const mous = await db.query.mou.findMany({
            orderBy: desc(mou.createdAt),
        });

        const filteredMOUs = mous.filter(mouItem => {
            let isValid = true;
            if (startYear && mouItem.yearOfSigning < startYear) {
                isValid = false;
            }
            if (endYear && mouItem.yearOfSigning > endYear) {
                isValid = false;
            }
            if (organizationName && mouItem.organizationName !== organizationName) {
                isValid = false;
            }
            if (duration && mouItem.duration !== duration) {
                isValid = false;
            }
            return isValid;
        });

        return filteredMOUs;
    } catch (error) {
        console.log('err in repo', error);
        errs(error);
    }
}

export async function createMOU(mouData: MOU,userId:string) {
    try {
        await db
            .insert(mou)
            .values({
                id: generateRandomId(),
                teacherAdminId:userId,
                ...mouData,
            })
            .returning();

        return { message: 'Successful' };
    } catch (error) {
        console.log(error);
        errs(error);
    }
}

export async function updateMOU(mouData: MOU, id: string) {
    try {
        const existingData = await db.query.mou.findFirst({
            where: and(eq(mou.id, id)),
        });

        if (!existingData) {
            return { status: 404, message: 'MOU not found' };
        }

        const [updatedMOU] = await db
            .update(mou)
            .set({
                ...mouData,
                updatedAt: new Date()
            })
            .where(eq(mou.id, id))
            .returning();

        if (!updatedMOU?.id) {
            throw new Error('Error updating MOU');
        }

        return { message: 'Update successful' };
    } catch (error) {
        console.log('error', error);
        errs(error);
    }
}

export async function deleteMOU(id: string, role: string, accessTo: string) {
    try {
        const existingData = await db.query.mou.findFirst({
            where: eq(mou.id, id),
        });

        if (!existingData) {
            return { status: 404, message: 'MOU not found' };
        }

        if (role === 'admin' && (accessTo === 'all' || accessTo === 'research')) {
            await db.delete(mou).where(eq(mou.id, id));
            return { message: 'Delete successful' };
        }
        
        return { status: 403, message: 'Forbidden' };
    } catch (error) {
        console.log(error);
        errs(error);
    }
}
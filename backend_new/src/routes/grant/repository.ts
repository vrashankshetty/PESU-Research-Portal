import { and, desc, eq } from 'drizzle-orm';
import db from '../../db';
import { errs } from '../../utils/catch-error';
import { generateRandomId } from '../../utils/generate-id';
import { grant } from '../../models/grant';
import { Grant } from '../../types';

export async function getEachGrant(id: string) {
    try {
        const grantData = await db.query.grant.findFirst({
            where: and(eq(grant.id, id)),
        });
        return grantData;
    } catch (error) {
        errs(error);
    }
}

export async function getAllGrants(query: any) {
    try {
        const { 
            startYear, 
            endYear, 
            investigatorName, 
            fundingAgency, 
            type, 
            department, 
            schemeName 
        } = query;
        
        const grants = await db.query.grant.findMany({
            orderBy: desc(grant.createdAt),
        });

        const filteredGrants = grants.filter(grantItem => {
            let isValid = true;
            if (startYear && grantItem.yearOfAward < startYear) {
                isValid = false;
            }
            if (endYear && grantItem.yearOfAward > endYear) {
                isValid = false;
            }
            if (investigatorName && grantItem.investigatorName !== investigatorName) {
                isValid = false;
            }
            if (fundingAgency && grantItem.fundingAgency !== fundingAgency) {
                isValid = false;
            }
            if (type && grantItem.type !== type) {
                isValid = false;
            }
            if (department && grantItem.department !== department) {
                isValid = false;
            }
            if (schemeName && grantItem.schemeName !== schemeName) {
                isValid = false;
            }
            return isValid;
        });

        return filteredGrants;
    } catch (error) {
        console.log('err in repo', error);
        errs(error);
    }
}

export async function createGrant(grantData: Grant,userId:string) {
    try {
        await db
            .insert(grant)
            .values({
                id: generateRandomId(),
                teacherAdminId:userId,
                ...grantData,
            })
            .returning();

        return { message: 'Successful' };
    } catch (error) {
        console.log(error);
        errs(error);
    }
}

export async function updateGrant(grantData: Grant, id: string) {
    try {
        const existingData = await db.query.grant.findFirst({
            where: and(eq(grant.id, id)),
        });

        if (!existingData) {
            return { status: 404, message: 'Grant not found' };
        }

        const [updatedGrant] = await db
            .update(grant)
            .set({
                ...grantData,
                updatedAt: new Date()
            })
            .where(eq(grant.id, id))
            .returning();

        if (!updatedGrant?.id) {
            throw new Error('Error updating grant');
        }

        return { message: 'Update successful' };
    } catch (error) {
        console.log('error', error);
        errs(error);
    }
}

export async function deleteGrant(id: string, role: string, accessTo: string) {
    try {
        const existingData = await db.query.grant.findFirst({
            where: eq(grant.id, id),
        });

        if (!existingData) {
            return { status: 404, message: 'Grant not found' };
        }

        if (role === 'admin' && (accessTo === 'all' || accessTo === 'research')) {
            await db.delete(grant).where(eq(grant.id, id));
            return { message: 'Delete successful' };
        }
        
        return { status: 403, message: 'Forbidden' };
    } catch (error) {
        console.log(error);
        errs(error);
    }
}
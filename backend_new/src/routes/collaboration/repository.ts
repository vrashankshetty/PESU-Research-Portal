import { and, desc, eq } from 'drizzle-orm';
import db from '../../db';
import { errs } from '../../utils/catch-error';
import { generateRandomId } from '../../utils/generate-id';
import { collaboration } from '../../models/collaboration';
import { Collaboration } from '../../types';

export async function getEachCollaboration(id: string) {
    try {
        const collaborationData = await db.query.collaboration.findFirst({
            where: and(eq(collaboration.id, id)),
        });
        return collaborationData;
    } catch (error) {
        errs(error);
    }
}

export async function getAllCollaborations(query: any) {
    try {
        const { 
            startYear, 
            endYear, 
            title, 
            collaboratingAgency, 
            participantName, 
            natureOfActivity 
        } = query;
        
        const collaborations = await db.query.collaboration.findMany({
            orderBy: desc(collaboration.createdAt),
        });

        const filteredCollaborations = collaborations.filter(collaborationItem => {
            let isValid = true;
            if (startYear && collaborationItem.yearOfCollaboration < startYear) {
                isValid = false;
            }
            if (endYear && collaborationItem.yearOfCollaboration > endYear) {
                isValid = false;
            }
            if (title && collaborationItem.title !== title) {
                isValid = false;
            }
            if (collaboratingAgency && collaborationItem.collaboratingAgency !== collaboratingAgency) {
                isValid = false;
            }
            if (participantName && collaborationItem.participantName !== participantName) {
                isValid = false;
            }
            if (natureOfActivity && collaborationItem.natureOfActivity !== natureOfActivity) {
                isValid = false;
            }
            return isValid;
        });

        return filteredCollaborations;
    } catch (error) {
        console.log('err in repo', error);
        errs(error);
    }
}

export async function createCollaboration(collaborationData: Collaboration) {
    try {
        await db
            .insert(collaboration)
            .values({
                id: generateRandomId(),
                ...collaborationData,
            })
            .returning();

        return { message: 'Successful' };
    } catch (error) {
        console.log(error);
        errs(error);
    }
}

export async function updateCollaboration(collaborationData: Collaboration, id: string) {
    try {
        const existingData = await db.query.collaboration.findFirst({
            where: and(eq(collaboration.id, id)),
        });

        if (!existingData) {
            return { status: 404, message: 'Collaboration not found' };
        }

        const [updatedCollaboration] = await db
            .update(collaboration)
            .set({
                ...collaborationData,
                updatedAt: new Date()
            })
            .where(eq(collaboration.id, id))
            .returning();

        if (!updatedCollaboration?.id) {
            throw new Error('Error updating collaboration');
        }

        return { message: 'Update successful' };
    } catch (error) {
        console.log('error', error);
        errs(error);
    }
}

export async function deleteCollaboration(id: string, role: string, accessTo: string) {
    try {
        const existingData = await db.query.collaboration.findFirst({
            where: eq(collaboration.id, id),
        });

        if (!existingData) {
            return { status: 404, message: 'Collaboration not found' };
        }

        if (role === 'admin' && (accessTo === 'all' || accessTo === 'research')) {
            await db.delete(collaboration).where(eq(collaboration.id, id));
            return { message: 'Delete successful' };
        }
        
        return { status: 403, message: 'Forbidden' };
    } catch (error) {
        console.log(error);
        errs(error);
    }
}

import { and, desc, eq, inArray } from 'drizzle-orm';
import db from '../../db';
import { journal } from '../../models/journal';
import { errs } from '../../utils/catch-error';
import { Journal } from '../../types';
import { generateRandomId } from '../../utils/generate-id';
import { journalUser } from '../../models/journalUser';
import { user } from '../../models/user';



export async function getEachJournal(id: string,userId:string,role:string,accessTo:string) {
    try {
        if(role === 'admin' && (accessTo === 'all' || accessTo === 'research')){
            const journal = await db.query.journalUser.findFirst({
                where:and(eq(journalUser.journalId,id)),
                with:{
                    journal:{
                        with:{
                            teacherAdmin:{
                                columns:{
                                    password:false,
                                }
                            },
                            teachers:{
                               with:{
                                    user:{
                                        columns:{
                                            password:false
                                        }
                                    },
                               },
                               orderBy:desc(journalUser.createdAt)
                            }
                        }
                    }
                }
            })
            if(journal?.journal){
                return journal;
            }
            return null;
        }
        const journal = await db.query.journalUser.findFirst({
            where:and(eq(journalUser.journalId,id),eq(journalUser.userId,userId)),
            with:{
                journal:{
                    with:{
                        teacherAdmin:{
                            columns:{
                                password:false,
                            }
                        },
                        teachers:{
                           with:{
                                user:{
                                    columns:{
                                        password:false
                                    }
                                },
                           },
                           orderBy:desc(journalUser.createdAt)
                        }
                    }
                }
            }
        })
        if(journal?.journal){
            return journal;
        }
        return null;
    } catch (error) {
        errs(error);
    }
}


export async function getAllJournal(userId:string,role:string,accessTo:string) {
    try {
        if(role === 'admin' && (accessTo === 'all' || accessTo === 'research')){
            const journals =  await db.query.journal.findMany({
                orderBy:desc(journalUser.createdAt)
             })
            const formattedconf= journals.map((s)=>({addedAt:s.createdAt,...s}))
            return formattedconf;
        }
        
        const journals =  await db.query.journalUser.findMany({
            where:eq(journalUser.userId,userId),
            columns:{
                userId:false,
                journalId:false,
                id:false,
            },
            with:{
                journal:true
            },
            orderBy:desc(journalUser.createdAt)
         })
        const formattedjournals= journals.map((s)=>({addedAt:s.createdAt,...s.journal}))
        return formattedjournals;
    } catch (error) {
        console.log("err in repo",error)
        errs(error);
    }
}


export async function createJournal(journalData: Journal,userId:string) {
    let journalId = '';
    const { teacherIds, ...expData } = journalData;

    try {

        const [insertedJournal] = await db.insert(journal).values({
            id: generateRandomId(),
            teacherAdminId:userId,
            ...expData,
        }).returning();


        if (!insertedJournal?.id) {
            throw new Error('Error creating Journal');
        }

        journalId = insertedJournal.id;
        teacherIds.push(userId);
        const newteacherIds = [...new Set(teacherIds)];
        if (newteacherIds.length > 0) {
            const existingTeachers = await db.query.journalUser.findMany({
                where: and(eq(journalUser.journalId, journalId), inArray(journalUser.userId, newteacherIds)),
            });

            if (existingTeachers.length > 0) {
                throw new Error('Some teachers already exist in this journal');
            }

            await Promise.all(
                newteacherIds.map((tId) => 
                    db.insert(journalUser).values({
                        id: generateRandomId(),
                        userId: tId,
                        journalId,
                    }).returning()
                )
            );
        }

        return { message: 'Successful' };

    } catch (error) {
        if (journalId) {
            await Promise.all([
                db.delete(journal).where(eq(journal.id, journalId)),
                db.delete(journalUser).where(eq(journalUser.journalId, journalId))
            ]);
        }
        console.log(error);
        errs(error); 
    }
}


export async function updateJournal(journalData: Journal, id: string,userId:string) {
    const { teacherIds, ...expData } = journalData;

    try {
        const uptData = await db.query.journal.findFirst({
            where:and(eq(journal.id,id),eq(journal.teacherAdminId,userId))
        })
        if(!uptData){
            return {status:403,message:'Forbidden' }
        }
        const [updatedJournal] = await db.update(journal).set({
            ...expData,
        }).where(eq(journal.id, id)).returning();

        if (!updatedJournal?.id) {
            throw new Error('Error updating Journal');
        }
            const existingTeachers = await db.query.journalUser.findMany({
                where: eq(journalUser.journalId, id),
            });
            teacherIds.push(userId);
            const newteacherIds = [...new Set(teacherIds)];
            const existingTeacherIds = existingTeachers.map((t) => t.userId);
            const teachersToAdd = newteacherIds.filter((tId) => !existingTeacherIds.includes(tId));
            const teachersToRemove = existingTeacherIds.filter((tId) => !newteacherIds.includes(tId));
            if (teachersToAdd.length > 0) {
                await Promise.all(
                    teachersToAdd.map((tId) =>
                        db.insert(journalUser).values({
                            id: generateRandomId(),
                            userId: tId,
                            journalId: id,
                        }).returning()
                    )
                );
            }
            if (teachersToRemove.length > 0) {
                await db.delete(journalUser)
                    .where(and(eq(journalUser.journalId, id), inArray(journalUser.userId, teachersToRemove)));
            }
        return { status:200,message: 'Update successful' };
    } catch (error) {
        console.log("error",error);
        errs(error);
    }
}


export async function deleteJournal(id:string,userId:string) {
    try {
        const getData = await db.query.journal.findFirst({
            where:eq(journal.id,id)
        })
        if(!getData?.teacherAdminId){
            return {status:200,data:{}};
        }
        if(getData?.teacherAdminId === userId){
            await db.delete(journalUser).where(eq(journalUser.journalId,id));
            await db.delete(journal).where(eq(journal.id,id));
            return {status:200,data:'Successfully deleted'};
        }
         return {status:403,data:'Forbidden'};
    } catch (error) {
        console.log(error)
        errs(error);
    }
}
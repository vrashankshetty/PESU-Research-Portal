
import { and, desc, eq, inArray } from 'drizzle-orm';
import db from '../../db';
import { patent } from '../../models/patent';
import { errs } from '../../utils/catch-error';
import { Patent } from '../../types';
import { generateRandomId } from '../../utils/generate-id';
import { patentUser } from '../../models/patentUser';
import { user } from '../../models/user';



export async function getEachPatent(id: string,userId:string,role:string,accessTo:string) {
    try {
        if(role === 'admin' && (accessTo === 'all' || accessTo === 'research')){
            const patent = await db.query.patentUser.findFirst({
                where:and(eq(patentUser.patentId,id)),
                with:{
                    patent:{
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
                               orderBy:desc(patentUser.createdAt)
                            }
                        }
                    }
                }
            })
            if(patent?.patent){
                return patent;
            }
            return null;
        }
        const patent = await db.query.patentUser.findFirst({
            where:and(eq(patentUser.patentId,id),eq(patentUser.userId,userId)),
            with:{
                patent:{
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
                           orderBy:desc(patentUser.createdAt)
                        }
                    }
                }
            }
        })
        if(patent?.patent){
            return patent;
        }
        return null;
    } catch (error) {
        errs(error);
    }
}


export async function getAllPatent(userId:string,role:string,accessTo:string) {
    try {
        if(role === 'admin' && (accessTo === 'all' || accessTo === 'research')){
            const journals =  await db.query.patent.findMany({
                orderBy:desc(patentUser.createdAt)
             })
            const formattedconf= journals.map((s)=>({addedAt:s.createdAt,...s}))
            return formattedconf;
        }
        
        const patents =  await db.query.patentUser.findMany({
            where:eq(patentUser.userId,userId),
            columns:{
                userId:false,
                patentId:false,
                id:false,
            },
            with:{
                patent:true
            },
            orderBy:desc(patentUser.createdAt)
         })
        const formattedpatents= patents.map((s)=>({addedAt:s.createdAt,...s.patent}))
        return formattedpatents;
    } catch (error) {
        console.log("err in repo",error)
        errs(error);
    }
}


export async function createPatent(patentData: Patent,userId:string) {
    let patentId = '';
    const { teacherIds, ...expData } = patentData;

    try {

        const [insertedPatent] = await db.insert(patent).values({
            id: generateRandomId(),
            teacherAdminId:userId,
            ...expData,
        }).returning();


        if (!insertedPatent?.id) {
            throw new Error('Error creating Patent');
        }

        patentId = insertedPatent.id;
        teacherIds.push(userId);
        const newteacherIds = [...new Set(teacherIds)];
        if (newteacherIds.length > 0) {
            const existingTeachers = await db.query.patentUser.findMany({
                where: and(eq(patentUser.patentId, patentId), inArray(patentUser.userId, newteacherIds)),
            });

            if (existingTeachers.length > 0) {
                throw new Error('Some teachers already exist in this patent');
            }

            await Promise.all(
                newteacherIds.map((tId) => 
                    db.insert(patentUser).values({
                        id: generateRandomId(),
                        userId: tId,
                        patentId,
                    }).returning()
                )
            );
        }

        return { message: 'Successful' };

    } catch (error) {
        if (patentId) {
            await Promise.all([
                db.delete(patent).where(eq(patent.id, patentId)),
                db.delete(patentUser).where(eq(patentUser.patentId, patentId))
            ]);
        }
        console.log(error);
        errs(error); 
    }
}


export async function updatePatent(patentData: Patent, id: string,userId:string) {
    const { teacherIds, ...expData } = patentData;

    try {
        const uptData = await db.query.patent.findFirst({
            where:and(eq(patent.id,id),eq(patent.teacherAdminId,userId))
        })
        if(!uptData){
            return {status:403,message:'Forbidden' }
        }
        const [updatedPatent] = await db.update(patent).set({
            ...expData,
        }).where(eq(patent.id, id)).returning();

        if (!updatedPatent?.id) {
            throw new Error('Error updating Patent');
        }
            const existingTeachers = await db.query.patentUser.findMany({
                where: eq(patentUser.patentId, id),
            });
            teacherIds.push(userId);
            const newteacherIds = [...new Set(teacherIds)];
            const existingTeacherIds = existingTeachers.map((t) => t.userId);
            const teachersToAdd = newteacherIds.filter((tId) => !existingTeacherIds.includes(tId));
            const teachersToRemove = existingTeacherIds.filter((tId) => !newteacherIds.includes(tId));
            if (teachersToAdd.length > 0) {
                await Promise.all(
                    teachersToAdd.map((tId) =>
                        db.insert(patentUser).values({
                            id: generateRandomId(),
                            userId: tId,
                            patentId: id,
                        }).returning()
                    )
                );
            }
            if (teachersToRemove.length > 0) {
                await db.delete(patentUser)
                    .where(and(eq(patentUser.patentId, id), inArray(patentUser.userId, teachersToRemove)));
            }
        return { status:200, message: 'Update successful' };
    } catch (error) {
        console.log("error",error);
        errs(error);
    }
}


export async function deletePatent(id:string,userId:string) {
    try {
        const getData = await db.query.patent.findFirst({
            where:eq(patent.id,id)
        })
        if(!getData?.teacherAdminId){
            return {status:200,data:{}};
        }
        if(getData?.teacherAdminId === userId){
            await db.delete(patentUser).where(eq(patentUser.patentId,id));
            await db.delete(patent).where(eq(patent.id,id));
            return {status:200,data:'Successfully deleted'};
        }
         return {status:403,data:'Forbidden'};
    } catch (error) {
        console.log(error)
        errs(error);
    }
}
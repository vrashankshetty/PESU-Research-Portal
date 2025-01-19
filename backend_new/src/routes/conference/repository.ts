
import { and, desc, eq, inArray } from 'drizzle-orm';
import db from '../../db';
import { errs } from '../../utils/catch-error';
import { Conference } from '../../types';
import { generateRandomId } from '../../utils/generate-id';
import { conference } from '../../models/conference';
import { conferenceUser } from '../../models/conferenceUser';



export async function getEachConference(id: string,userId:string,role:string,accessTo:string) {
    try {
        if(role === 'admin' && (accessTo === 'all' || accessTo === 'research')){
            const conf = await db.query.conferenceUser.findFirst({
                where:and(eq(conferenceUser.conferenceId,id)),
                with:{
                    conference:{
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
                               orderBy:desc(conferenceUser.createdAt)
                            }
                        }
                    }
                }
            })
            if(conf?.conference){
                return conf;
            }
            return null;
        }
        const conf = await db.query.conferenceUser.findFirst({
            where:and(eq(conferenceUser.conferenceId,id),eq(conferenceUser.userId,userId)),
            with:{
                conference:{
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
                           orderBy:desc(conferenceUser.createdAt)
                        }
                    }
                }
            }
        })
        if(conf?.conference){
            return conf;
        }
        return null;
    } catch (error) {
        errs(error);
    }
}


export async function getAllConference(userId:string,role:string,accessTo:string) {
    try {
        if(role === 'admin' && (accessTo === 'all' || accessTo === 'research')){
            const journals =  await db.query.conference.findMany({
                orderBy:desc(conferenceUser.createdAt)
             })
            const formattedconf= journals.map((s)=>({addedAt:s.createdAt,...s}))
            return formattedconf;
        }
        const journals =  await db.query.conferenceUser.findMany({
            where:eq(conferenceUser.userId,userId),
            columns:{
                userId:false,
                conferenceId:false,
                id:false,
            },
            with:{
                conference:true
            },
            orderBy:desc(conferenceUser.createdAt)
         })
        const formattedconf= journals.map((s)=>({addedAt:s.createdAt,...s.conference}))
        return formattedconf;
    } catch (error) {
        console.log("err in repo",error)
        errs(error);
    }
}


export async function createConference(confData: Conference,userId:string) {
    let conferenceId = '';
    const { teacherIds, ...expData } = confData;

    try {

        const [insertedConf] = await db.insert(conference).values({
            id: generateRandomId(),
            teacherAdminId:userId,
            ...expData,
        }).returning();


        if (!insertedConf?.id) {
            throw new Error('Error creating Journal');
        }

        conferenceId = insertedConf.id;
        teacherIds.push(userId)

        const newteacherIds = [...new Set(teacherIds)];
        if (newteacherIds.length > 0) {
            const existingTeachers = await db.query.conferenceUser.findMany({
                where: and(eq(conferenceUser.conferenceId, conferenceId), inArray(conferenceUser.userId, newteacherIds)),
            });

            if (existingTeachers.length > 0) {
                throw new Error('Some teachers already exist in this journal');
            }

            await Promise.all(
                newteacherIds.map((tId) => 
                    db.insert(conferenceUser).values({
                        id: generateRandomId(),
                        userId: tId,
                        conferenceId
                    }).returning()
                )
            );
        }

        return { message: 'Successful' };

    } catch (error) {
        if (conferenceId) {
            await Promise.all([
                db.delete(conference).where(eq(conference.id, conferenceId)),
                db.delete(conferenceUser).where(eq(conferenceUser.conferenceId, conferenceId))
            ]);
        }
        console.log(error);
        errs(error); 
    }
}


export async function updateConference(journalData: Conference, id: string,userId:string) {
    const { teacherIds, ...expData } = journalData;

    try {
        const uptData = await db.query.conference.findFirst({
            where:and(eq(conference.id,id),eq(conference.teacherAdminId,userId))
        })

        if(!uptData){
            return {status:403,message:'Forbidden' }
        }

        const [updatedJournal] = await db.update(conference).set({
            ...expData,
        }).where(eq(conference.id, id)).returning();

        if (!updatedJournal?.id) {
            throw new Error('Error updating Journal');
        }
            const existingTeachers = await db.query.conferenceUser.findMany({
                where: eq(conferenceUser.conferenceId, id),
            });
            teacherIds.push(userId);
            const newteacherIds = [...new Set(teacherIds)];

            const existingTeacherIds = existingTeachers.map((t) => t.userId);
            const teachersToAdd = newteacherIds.filter((tId) => !existingTeacherIds.includes(tId));
            const teachersToRemove = existingTeacherIds.filter((tId) => !newteacherIds.includes(tId));
            if (teachersToAdd.length > 0) {
                await Promise.all(
                    teachersToAdd.map((tId) =>
                        db.insert(conferenceUser).values({
                            id: generateRandomId(),
                            userId: tId,
                            conferenceId: id,
                        }).returning()
                    )
                );
            }
            if (teachersToRemove.length > 0) {
                await db.delete(conferenceUser)
                    .where(and(eq(conferenceUser.conferenceId, id), inArray(conferenceUser.userId, teachersToRemove)));
            }
        return { message: 'Update successful' };
    } catch (error) {
        console.log("error",error);
        errs(error);
    }
}


export async function deleteConference(id:string,userId:string) {
    try {
        const getData = await db.query.conference.findFirst({
            where:eq(conference.id,id)
        })
        if(!getData?.teacherAdminId){
            return {status:200,data:{}};
        }
        if(getData?.teacherAdminId === userId){
            await db.delete(conferenceUser).where(eq(conferenceUser.conferenceId,id));
            await db.delete(conference).where(eq(conference.id,id));
            return {status:200,data:'Successfully deleted'};
        }
         return {status:403,data:'Forbidden'};
    } catch (error) {
        console.log(error)
        errs(error);
    }
}
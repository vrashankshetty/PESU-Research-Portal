import { and, desc, eq, ilike, inArray } from 'drizzle-orm';
import db from '../../db';
import { journal } from '../../models/journal';
import { errs } from '../../utils/catch-error';
import { Journal } from '../../types';
import { generateRandomId } from '../../utils/generate-id';
import { journalUser } from '../../models/journalUser';
import { user } from '../../models/user';

export async function getEachJournal(id: string, userId: string, role: string, accessTo: string) {
    try {
        if (role === 'admin' && (accessTo === 'all' || accessTo === 'research')) {
            const journal = await db.query.journalUser.findFirst({
                where: and(eq(journalUser.journalId, id)),
                with: {
                    journal: {
                        with: {
                            teacherAdmin: {
                                columns: {
                                    password: false,
                                },
                            },
                            teachers: {
                                with: {
                                    user: {
                                        columns: {
                                            password: false,
                                        },
                                    },
                                },
                                orderBy: desc(journalUser.createdAt),
                            },
                        },
                    },
                },
            });
            if (journal?.journal) {
                return journal;
            }
            return null;
        }
        const journal = await db.query.journalUser.findFirst({
            where: and(eq(journalUser.journalId, id), eq(journalUser.userId, userId)),
            with: {
                journal: {
                    with: {
                        teacherAdmin: {
                            columns: {
                                password: false,
                            },
                        },
                        teachers: {
                            with: {
                                user: {
                                    columns: {
                                        password: false,
                                    },
                                },
                            },
                            orderBy: desc(journalUser.createdAt),
                        },
                    },
                },
            },
        });
        if (journal?.journal) {
            return journal;
        }
        return null;
    } catch (error) {
        errs(error);
    }
}

export async function getAllJournal(userId: string, role: string, accessTo: string) {
    try {
        if (role === 'admin' && (accessTo === 'all' || accessTo === 'research')) {
            const journals = await db.query.journal.findMany({
                orderBy: desc(journalUser.createdAt),
                with:{
                    teachers:{
                        columns:{
                            userId:false,
                            journalId:false,
                            id:false
                        },
                        with:{
                            user:{
                                columns:{
                                   name:true
                                }
                            }
                            
                        }
                    }
                }
            });
            const formattedconf = journals.map(s => ({ addedAt: s.createdAt, ...s,teachers:s.teachers.map(t=>t.user.name) }));
            return formattedconf;
        }

        const journals = await db.query.journalUser.findMany({
            where: eq(journalUser.userId, userId),
            columns: {
                userId: false,
                journalId: false,
                id: false,
            },
            with: {
                journal: {
                    with:{
                        teachers:{
                            columns:{
                                userId:false,
                                journalId:false,
                                id:false,
                            },
                            with:{
                                user:{
                                    columns:{
                                        name: true,
                                    }
                                }
                            }
                        }
                    }
                },
            },
            orderBy: desc(journalUser.createdAt),
        });
        const formattedjournals = journals.map(s => ({ addedAt: s.createdAt, ...s.journal,teachers:s.journal.teachers.map(t=>t.user.name) }));
        return formattedjournals;
    } catch (error) {
        console.log('err in repo', error);
        errs(error);
    }
}

export async function createJournal(journalData: Journal, userId: string) {
    let journalId = '';
    const { teacherIds, ...expData } = journalData;

    try {
        const user1 = await db.query.user.findFirst({
            where: eq(user.id, userId),
        });
        if (!user1) {
            throw new Error('User not found');
        }

        const [insertedJournal] = await db
            .insert(journal)
            .values({
                id: generateRandomId(),
                teacherAdminId: userId,
                ...expData,
                campus: user1.campus,
                dept: user1.dept,
            })
            .returning();

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
                newteacherIds.map(tId =>
                    db
                        .insert(journalUser)
                        .values({
                            id: generateRandomId(),
                            userId: tId,
                            journalId,
                        })
                        .returning(),
                ),
            );
        }

        return { message: 'Successful' };
    } catch (error) {
        if (journalId) {
            await Promise.all([
                db.delete(journal).where(eq(journal.id, journalId)),
                db.delete(journalUser).where(eq(journalUser.journalId, journalId)),
            ]);
        }
        console.log(error);
        errs(error);
    }
}

export async function updateJournal(journalData: Journal, id: string, userId: string,role:string,accessTo:string) {
    const { teacherIds, ...expData } = journalData;

    try {
        let uptData;

        if (role === 'admin' && (accessTo === 'all' || accessTo === 'research')) {
            uptData = await db.query.journal.findFirst({
                where: and(eq(journal.id, id)),
            });
        }else{
            uptData = await db.query.journal.findFirst({
                where: and(eq(journal.id, id), eq(journal.teacherAdminId, userId)),
            });
        }
        if (!uptData) {
            return { status: 403, message: 'Forbidden' };
        }
        const [updatedJournal] = await db
            .update(journal)
            .set({
                ...expData,
            })
            .where(eq(journal.id, id))
            .returning();

        if (!updatedJournal?.id) {
            throw new Error('Error updating Journal');
        }
        const existingTeachers = await db.query.journalUser.findMany({
            where: eq(journalUser.journalId, id),
        });
        teacherIds.push(userId);
        const newteacherIds = [...new Set(teacherIds)];
        const existingTeacherIds = existingTeachers.map(t => t.userId);
        const teachersToAdd = newteacherIds.filter(tId => !existingTeacherIds.includes(tId));
        const teachersToRemove = existingTeacherIds.filter(tId => !newteacherIds.includes(tId));
        if (teachersToAdd.length > 0) {
            await Promise.all(
                teachersToAdd.map(tId =>
                    db
                        .insert(journalUser)
                        .values({
                            id: generateRandomId(),
                            userId: tId,
                            journalId: id,
                        })
                        .returning(),
                ),
            );
        }
        if (teachersToRemove.length > 0) {
            await db
                .delete(journalUser)
                .where(and(eq(journalUser.journalId, id), inArray(journalUser.userId, teachersToRemove)));
        }
        return { status: 200, message: 'Update successful' };
    } catch (error) {
        console.log('error', error);
        errs(error);
    }
}

export async function deleteJournal(id: string, userId: string,role:string,accessTo:string) {
    try {
        const getData = await db.query.journal.findFirst({
            where: eq(journal.id, id),
        });
        console.log('getData', getData);
        if (!getData?.teacherAdminId) {
            return { status: 200, data: {} };
        }
        if ((role === 'admin' && (accessTo === 'all' || accessTo === 'research'))) {
            console.log('role', role);
            await db.delete(journalUser).where(eq(journalUser.journalId, id));
            await db.delete(journal).where(eq(journal.id, id));
            return { status: 200, data: 'Successfully deleted' };
        }
        return { status: 403, data: 'Forbidden' };
    } catch (error) {
        console.log(error);
        errs(error);
    }
}

export async function seedJournal(patentData: Journal, name: string) {
    let patentId = '';
    const { teacherIds, ...expData } = patentData;
    try {
        const user1 = await db.query.user.findFirst({
            where: ilike(user.name, `%${name}%`),
        });
        if (!user1) {
            throw new Error('User not found');
        }

        const [insertedPatent] = await db
            .insert(journal)
            .values({
                id: generateRandomId(),
                teacherAdminId: user1.id,
                ...patentData,
                campus: user1.campus,
                dept: user1.dept,
            })
            .returning();

        if (!insertedPatent?.id) {
            throw new Error('Error creating Patent');
        }

        patentId = insertedPatent.id;

        teacherIds.push(name);

        const newteacherIds = [...new Set(teacherIds)];
        console.log('name', name);
        if (newteacherIds.length > 0) {
            await Promise.all(
                newteacherIds.map(async tId => {
                    const user1 = await db.query.user.findFirst({
                        where: ilike(user.name, `%${tId}%`),
                    });

                    if (!user1) {
                        throw new Error('User not found');
                    }

                    await db
                        .insert(journalUser)
                        .values({
                            id: generateRandomId(),
                            userId: user1.id,
                            journalId: patentId,
                        })
                        .returning();
                }),
            );
        }

        return { message: 'Successful' };
    } catch (error) {
        if (patentId) {
            await Promise.all([
                db.delete(journal).where(eq(journal.id, patentId)),
                db.delete(journalUser).where(eq(journalUser.journalId, patentId)),
            ]);
        }
        console.log(error);
        errs(error);
    }
}

import db from '../../db';
import { errs } from '../../utils/catch-error';
import { eq,desc, or, and } from 'drizzle-orm';
import { conferenceUser } from '../../models/conferenceUser';
import { journalUser } from '../../models/journalUser';
import { patentUser } from '../../models/patentUser';


export async function getAllTeachers() {
    try {
        const teachers = await db.query.user.findMany({
            where: (user, { eq }) => or(eq(user.role, 'user'),eq(user.role, 'chair_person')),
            columns: {
                password: false,
                role: false,
                accessTo: false,
            },
            orderBy: (user, { asc }) => asc(user.name),
        });
            
        return teachers
    } catch (error) {
        console.log('err in getAllTeachers repo', error);
        errs(error);
    }
}



export async function getIndvTeacher(teacherId: string) {
    try {
        const teacher = await db.query.user.findFirst({
            where: (user, { eq, and }) => and(
                eq(user.id, teacherId),
                or(eq(user.role, 'user'),eq(user.role, 'chair_person'))
            ),
            columns: {
                password: false,
            },
        });
        
        if (!teacher) {
            throw new Error('Teacher not found');
        }
        
        return teacher;
    } catch (error) {
        console.log('err in getIndvTeacher repo', error);
        errs(error);
    }
}


export async function getIndvTeacherConference(teacherId: string) {
    try {
        const conferences = await db.query.conferenceUser.findMany({
            where: eq(conferenceUser.userId, teacherId),
            columns: {
                userId: false,
                conferenceId: false,
                id: false,
            },
            with: {
                conference: {
                    with:{
                        teachers:{
                            columns:{
                                userId:false,
                                conferenceId:false,
                                id:false,
                            },
                            with:{
                                user:{
                                    columns:{
                                        name: true,
                                        role:true,
                                    }
                                }
                            }
                        }
                    }
                },
            },
            orderBy: desc(conferenceUser.createdAt),
        });
        const formattedconf = conferences.map(s => ({
            addedAt: s.createdAt,
            ...s.conference,
            teachers: s.conference.teachers
                .filter(t => t.user.role !== 'admin')
                .map(t => t.user.name),
        }));

        return formattedconf;
    } catch (error) {
        console.log('err in getIndvTeacherConference repo', error);
        errs(error);
    }
}

export async function getIndvTeacherEachConference(teacherId: string,conferenceId: string) {
    try {
        const conference = await db.query.conferenceUser.findFirst({
            where: and(eq(conferenceUser.userId, teacherId),eq(conferenceUser.conferenceId, conferenceId)),
            columns: {
                userId: false,
                conferenceId: false,
                id: false,
            },
            with: {
                conference: {
                    with:{
                        teachers:{
                            columns:{
                                userId:false,
                                conferenceId:false,
                                id:false,
                            },
                            with:{
                                user:{
                                    columns:{
                                        name: true,
                                        role:true,
                                    }
                                }
                            }
                        }
                    }
                },
            },
            orderBy: desc(conferenceUser.createdAt),
        });
        if (conference?.conference) {
            conference.conference.teachers = conference.conference.teachers
                    .filter(t => t.user.role !== 'admin')
            return conference;
        }
        return null;
    } catch (error) {
        console.log('err in getIndvTeacherConference repo', error);
        errs(error);
    }
}


export async function getIndvTeacherJournal(teacherId: string) {
    try {
        const journals = await db.query.journalUser.findMany({
            where: eq(journalUser.userId, teacherId),
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
                                        role: true
                                    }
                                }
                            }
                        }
                    }
                },
            },
            orderBy: desc(journalUser.createdAt),
        });
        const formattedjournals = journals.map(s => ({
            addedAt: s.createdAt,
            ...s.journal,
            teachers: s.journal.teachers
                .filter(t => t.user.role !== 'admin')
                .map(t => t.user.name),
        }));
        return formattedjournals;
    } catch (error) {
        console.log('err in getIndvTeacherJournal repo', error);
        errs(error);
    }
}

export async function getIndvTeacherEachJournal(teacherId: string,journalId: string) {
    try {
        const journal = await db.query.journalUser.findFirst({
            where: and(eq(journalUser.userId, teacherId), eq(journalUser.journalId, journalId)),
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
                                        role: true
                                    }
                                }
                            }
                        }
                    }
                },
            },
            orderBy: desc(journalUser.createdAt),
        });
         if (journal?.journal) {
            journal.journal.teachers = journal.journal.teachers
                    .filter(t => t.user.role !== 'admin')
            return journal;
        }
        return null;
    } catch (error) {
        console.log('err in getIndvTeacherJournal repo', error);
        errs(error);
    }
}



export async function getIndvTeacherPatent(teacherId: string) {
    try {
        const patents = await db.query.patentUser.findMany({
            where: eq(patentUser.userId, teacherId),
            columns: {
                userId: false,
                patentId: false,
                id: false,
            },
            with: {
                patent: {
                    with:{
                        teachers:{
                            columns:{
                                userId:false,
                                patentId:false,
                                id:false,
                            },
                            with:{
                                user:{
                                    columns:{
                                        name: true,
                                        role:true
                                    }
                                }
                            }
                        }
                    }
                },
            },
            orderBy: desc(patentUser.createdAt),
        });
        const formattedpatents = patents.map(s => ({
            addedAt: s.createdAt,
            ...s.patent,
            teachers: s.patent.teachers
                .filter(t => t.user.role !== 'admin')
                .map(t => t.user.name),
        }));
        return formattedpatents;

    } catch (error) {
        console.log('err in getIndvTeacherPatent repo', error);
        errs(error);
    }
}


export async function getIndvTeacherEachPatent(teacherId: string,patentId: string) {
    try {
        const patent = await db.query.patentUser.findFirst({
            where: and(eq(patentUser.userId, teacherId), eq(patentUser.patentId, patentId)),
            columns: {
                userId: false,
                patentId: false,
                id: false,
            },
            with: {
                patent: {
                    with:{
                        teachers:{
                            columns:{
                                userId:false,
                                patentId:false,
                                id:false,
                            },
                            with:{
                                user:{
                                    columns:{
                                        name: true,
                                        role:true
                                    }
                                }
                            }
                        }
                    }
                },
            },
            orderBy: desc(patentUser.createdAt),
        });
        if (patent?.patent) {
            patent.patent.teachers = patent.patent.teachers
                    .filter(t => t.user.role !== 'admin')
            return patent;
        }
        return null;
    } catch (error) {
        console.log('err in getIndvTeacherPatent repo', error);
        errs(error);
    }
}
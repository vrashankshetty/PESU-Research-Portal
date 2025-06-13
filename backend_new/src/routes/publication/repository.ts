import { errs } from '../../utils/catch-error';
import db from '../../db';

async function getAllPublications() {
    try {
        let journalData = [];
        let conferenceData = [];

        journalData = await db.query.journal.findMany({
                orderBy: (journal, { desc }) => desc(journal.createdAt),
                with:{
                    teacherAdmin:{
                        columns:{
                            name:true,
                            centre_name:true,
                        }
                    },
                    teachers:{
                        columns:{
                            userId:false,
                            journalId:false,
                            id:false
                        },
                        with:{
                            user:{
                                columns:{
                                   name:true,
                                   role:true
                                }
                            }
                            
                        }
                    }
                }
        });

        const formattedJournal = journalData.map(s => ({
                ...s,
                teachers: s.teachers
                    .filter(t => t.user.role !== 'admin')
                    .map(t => t.user.name),
        }));
    
        conferenceData = await db.query.conference.findMany({
                orderBy: (conference, { desc }) => desc(conference.createdAt),
                with:{
                    teacherAdmin:{
                        columns:{
                            name:true,
                            centre_name:true,
                        }
                    },
                    teachers:{
                        columns:{
                            userId:false,
                            conferenceId:false,
                            id:false
                        },
                        with:{
                            user:{
                                columns:{
                                   name:true,
                                   role:true
                                }
                            }
                            
                        }
                    }
                }
        });
      
        const formattedConf = conferenceData.map(s => ({
                ...s,
                teachers: s.teachers
                    .filter(t => t.user.role !== 'admin')
                    .map(t => t.user.name),
        }));

        const formattedJournals = formattedJournal.map((item, index) => {
            return {
                id: item.id,
                sno: index + 1,
                faculty_name: item.teacherAdmin.name || '',
                co_author: item.teachers || [],
                centre_name: item.teacherAdmin.centre_name || '',
                month: item.month,
                year: item.year,
                publication_type: 'Journal',
                title: item.title || '',
                journal_name: item.journalName || '',
                presented_published: item.status,
                total_authors: item.teachers.length ?item.teachers.length: 0,
                indexing: item.isScopus?'Scopus':item.isUGC?'UGC':item.isWOS?'WOS':'none',
                impact_factor: item.impactFactor || '',
                doi_link: item.articleLink || '',
                capstone_noncapstone: item.isCapstone ? 'Capstone' : 'Non-capstone',
                authors: item.teachers|| [],
                abstract: item.abstract || '',
                keywords: item.keywords || '',
                predicted_domain: item.domain || '',
                created_at: item.createdAt || new Date()
            };
        });

        const formattedConferences = formattedConf.map((item, index) => {
            return {
                id: item.id,
                sno: formattedJournals.length + index + 1,
                faculty_name: item.teacherAdmin.name || '',
                co_author: item.teachers || [],
                centre_name: item.teacherAdmin.centre_name || '',
                month:'none',
                year: item.year,
                publication_type: 'Conference',
                title: item.paperTitle || '',
                journal_name: item.bookTitle || '',
                presented_published: item.status,
                total_authors: item.totalAuthors,
                indexing: '',
                impact_factor:item.impactFactor,
                doi_link: item.link_of_paper || '',
                capstone_noncapstone: item.isCapstone ? 'Capstone' : 'Non-capstone',
                authors: item.teachers||[],
                abstract: item.abstract || '',
                keywords: item.keywords || '',
                predicted_domain: item.domain || '',
                created_at: item.createdAt || new Date()
            };
        });

        const allPublications = [...formattedJournals, ...formattedConferences];
        allPublications.sort((a, b) => {
            if (!a.created_at) return 1;
            if (!b.created_at) return -1;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        allPublications.forEach((pub, index) => {
            pub.sno = index + 1;
        });
        return allPublications;
    } catch (error) {
        console.error('Error fetching all publications:', error);
        return [];
    }
}


export async function getFilteredPublications(query: any) {
    try {
        const { 
            domain, year, type, month, faculty, 
            startYear, endYear, centre, indexing 
        } = query;
        
        const allPublications = await getAllPublications();
        console.log("query", query);
        const filteredPublications = allPublications.filter(publication => {
            let isValid = true;
            
            if (domain && publication.predicted_domain !== domain) {
                isValid = false;
            }
            
            if (year && publication.year !== year) {
                isValid = false;
            }
            
            if (type && publication.publication_type !== type) {
                isValid = false;
            }
            
            if (month && publication.month !== month) {
                isValid = false;
            }
            
            if (faculty && publication.faculty_name !== faculty) {
                isValid = false;
            }
            
            if (startYear && publication.year < startYear) {
                isValid = false;
            }
            
            if (endYear && publication.year > endYear) {
                isValid = false;
            }
            
            if (centre && publication.centre_name !== centre) {
                isValid = false;
            }
            
            if (indexing && publication.indexing !== indexing) {
                isValid = false;
            }
            
            return isValid;
        });
        
        return filteredPublications;
    } catch (error) {
        console.error('Error fetching filtered publications:', error);
        errs(error);
    }
}

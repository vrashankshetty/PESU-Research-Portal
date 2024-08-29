import { Campus, Dept } from "./shared"

export type Journal={
    serial_no:string,
    title:string,
    facultyNames:string[],
    campus:Campus,
    dept:Dept,
    journalName:string,
    month:string,
    year:string,
    volumeNo:string,
    issueNo:string,
    issn:string,
    websiteLink:string,
    articleLink:string,
    isListed:boolean,
    abstract:string,
    keywords:string[],
    domainExpertise:string
}


export type Conference={
    serial_no: string;
    teacherName: string;
    coAuthors: string[];
    totalAuthors: number;
    facultyNames: string[];
    campus: Campus;
    dept: Dept;
    bookTitle: string;
    paperTitle: string;
    proceedings_conference_title: string;
    volumeNo: string;
    issueNo: string;
    year: string;
    issn: string;
    is_affiliating_institution_same?: boolean;
    publisherName: string;
    impactFactor: string;
    link_of_paper: string;
    isCapstone: boolean;
    abstract: string;
    keywords: string[];
    domainExpertise: string;
}

export type Patent = {
    teacherName: string;
    campus: Campus; 
    dept:Dept;
    patentNumber: string;
    patentTitle: string;
    year: string;
    documentLink: string;
};
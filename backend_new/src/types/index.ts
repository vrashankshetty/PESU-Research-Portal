import { Dept } from "./shared";



export type Campus = 'EC' | 'RR' | 'HSN';
export type Department = 'EC' | 'CSE';
export type QNo = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'NA';
export type Core =  'coreA' | 'coreB' | 'coreC' | 'scopus' | 'NA';

export type Journal={
    title: string;
    teacherIds: string[]; 
    campus: Campus;
    dept: Department;
    journalName: string;
    month: string;
    year: string;
    volumeNo: string;
    issueNo: string;
    issn: string;
    websiteLink: string; 
    articleLink: string; 
    isUGC: boolean; 
    isScopus: boolean; 
    isWOS: boolean; 
    qNo: QNo;
    impactFactor: string; 
    isCapstone: boolean;
    isAffiliating: boolean; 
    pageNumber: number; 
    abstract: string;
    keywords: string[]; 
    domain: string;
}


export type Conference={
    teacherIds: string[]; 
    campus: Campus;
    dept: Department;
    bookTitle: string;
    paperTitle: string;
    proceedings_conference_title: string;
    volumeNo: string;
    issueNo: string;
    year: string;
    pageNumber: number;
    issn: string;
    is_affiliating_institution_same: boolean; 
    publisherName: string;
    impactFactor: string;
    core:Core; 
    link_of_paper: string;
    isCapstone: boolean; 
    abstract: string;
    keywords: string[]; 
    domain: string;
}



export type Patent = {
    teacherIds:string[];
    campus: Campus;
    dept: Department;
    patentNumber: string;
    patentTitle: string;
    isCapstone: boolean;
    year: string;
    documentLink: string;
};


export type User = {          
    empId: string;         
    name: string;     
    password:string;        
    phno: string;            
    dept: Department;       
    campus: Campus;           
    panNo: string;            
    qualification: string;    
    designation: string;       
    expertise: string;         
    dateofJoining: string;       
    totalExpBfrJoin: string;   
    googleScholarId: string;   
    sId: string;               
    oId: string;             
    profileImg?: string;      
  }
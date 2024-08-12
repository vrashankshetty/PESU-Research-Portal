
import express from 'express';
import xlsx from 'xlsx';
import { filePath } from '../../constants/path';
const router = express.Router();




const transformData = (data:any[]) => {
    const title = "3.4.5 Number of research papers per teacher in the Journals notified on UGC website during the last five years  (15)";
    const authorName = "__EMPTY";
    const teacherDepartment = "__EMPTY_1";
    const journalName = "__EMPTY_2";
    const publicationYear = "__EMPTY_3";
    const issnNumber = "__EMPTY_4";
    const linkWebsite = "__EMPTY_5";
    const linkDocs = "__EMPTY_6";
    const isListed = "__EMPTY_7";
    const linktoRe = "__EMPTY_8";
    const records = data.slice(3);
    return records.map(record => ({
        title: record[title]??'',
        authorName: record[authorName]??'',
        teacherDepartment: record[teacherDepartment]??'',
        journalName: record[journalName]??'',
        publicationYear: record[publicationYear]??'',
        issnNumber: record[issnNumber]??'',
        linkWebsite: record[linkWebsite]??'',
        linkDocs: record[linkDocs]??'',
        isListed: record[isListed]??'',
        linktoRe: record[linktoRe]??''
    }));
  };


  const transformSingleRecord = (record: any) => {
    const title = "3.4.5 Number of research papers per teacher in the Journals notified on UGC website during the last five years  (15)";
    const authorName = "__EMPTY";
    const teacherDepartment = "__EMPTY_1";
    const journalName = "__EMPTY_2";
    const publicationYear = "__EMPTY_3";
    const issnNumber = "__EMPTY_4";
    const linkWebsite = "__EMPTY_5";
    const linkDocs = "__EMPTY_6";
    const isListed = "__EMPTY_7";
    const linktoRe = "__EMPTY_8";

    return {
        [title]: record.title,
        [authorName]: record.authorName,
        [teacherDepartment]: record.teacherDepartment,
        [journalName]: record.journalName,
        [publicationYear]: record.publicationYear,
        [issnNumber]: record.issnNumber,
        [linkWebsite]: record.linkWebsite,
        [linkDocs]: record.linkDocs,
        [isListed]: record.isListed,
        [linktoRe]: record.linktoRe
    };
};


router.get('/',(req,res)=>{
  const name = '3.4.5';
  if (!name) {
    return res.status(400).send('Sheet name is required');
  }

  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[name as string];
    console.log("sheet",sheet)
    if (!sheet) {
      return res.status(404).send('Sheet not found');
    }

    const data = xlsx.utils.sheet_to_json(sheet);
    res.status(200).json(transformData(data));
  } catch (error) {
    console.log("error",error)
    res.status(500).send('Error reading XLSX file');
  }
})


router.post('/',(req,res)=>{
    const newRecord = req.body;
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = '3.4.5';
        let sheet = workbook.Sheets[sheetName];
        if (!sheet) {
            sheet = {};
            workbook.SheetNames.push(sheetName);
        }
        const existingData = xlsx.utils.sheet_to_json(sheet);
        const transformedNewRecord = transformSingleRecord(newRecord);
        const updatedData = [...existingData, transformedNewRecord];
        sheet = xlsx.utils.json_to_sheet(updatedData);
        workbook.Sheets[sheetName] = sheet;
        xlsx.writeFile(workbook, filePath);
        res.status(201).send('Data successfully added');
    } catch (error) {
        console.log("error", error);
        res.status(500).send('Error updating XLSX file');
    }
})


export default router;
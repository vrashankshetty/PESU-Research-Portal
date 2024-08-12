
import express from 'express';
import xlsx from 'xlsx';
import { filePath } from '../../constants/path';
const router = express.Router();



const transformData = (data:any[]) => {
  const slno = "3.4.6 Number of books and  chapters in edited volumes published per teacher during the last five years (15)\n";
  const facultyName = "__EMPTY";
  const titleBook = "__EMPTY_1";
  const titlePaper = "__EMPTY_2";
  const titleConference = "__EMPTY_3";
  const publicationYear = "__EMPTY_4";
  const issnNumber = "__EMPTY_5";
  const isSameInstitution= "__EMPTY_6";
  const publisherName = "__EMPTY_7";

  const records = data.slice(2);

  return records.map(record => ({
      slno: record[slno]??'',
      facultyName: record[facultyName]??'',
      titleBook: record[titleBook]??'',
      titlePaper: record[titlePaper]??'',
      titleConference: record[titleConference]??'',
      publicationYear: record[publicationYear]??'',
      issnNumber: record[issnNumber]??'',
      isSameInstitution: record[isSameInstitution]??'',
      publisherName: record[publisherName]??''
  }));
};



const transformSingleRecord = (record: any) => {
  const slno = "3.4.6 Number of books and  chapters in edited volumes published per teacher during the last five years (15)\n";
  const facultyName = "__EMPTY";
  const titleBook = "__EMPTY_1";
  const titlePaper = "__EMPTY_2";
  const titleConference = "__EMPTY_3";
  const publicationYear = "__EMPTY_4";
  const issnNumber = "__EMPTY_5";
  const isSameInstitution = "__EMPTY_6";
  const publisherName = "__EMPTY_7";

  return {
    [slno]: record.slno,
    [facultyName]: record.facultyName,
    [titleBook]: record.titleBook,
    [titlePaper]: record.titlePaper,
    [titleConference]: record.titleConference,
    [publicationYear]: record.publicationYear,
    [issnNumber]: record.issnNumber,
    [isSameInstitution]: record.isSameInstitution,
    [publisherName]: record.publisherName
  };
};


router.get('/',(req,res)=>{
  const name = '3.4.6';
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
      const sheetName = '3.4.6';
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
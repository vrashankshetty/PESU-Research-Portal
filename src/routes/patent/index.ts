
import express from 'express';
import xlsx from 'xlsx';
import { filePath } from '../../constants/path';
const router = express.Router();




const transformData = (data:any[]) => {
  const facultyName = "3.4.3 Number of Patents published/awarded during the last five years (10)";
  const patentNumber = "__EMPTY";
  const patentTitle= "__EMPTY_1";
  const patentPublish = "__EMPTY_2";
  const link = "__EMPTY_3";
  const records = data.slice(2);
  return records.map(record => ({
    facultyName: record[facultyName]??'',
    patentNumber: record[patentNumber]??'',
    patentTitle: record[patentTitle]??'',
    patentPublish: record[patentPublish]??'',
    link: record[link]??''
  }));
};

const transformSingleRecord = (record: any) => {
  const facultyName = "3.4.3 Number of Patents published/awarded during the last five years (10)";
  const patentNumber = "__EMPTY";
  const patentTitle = "__EMPTY_1";
  const patentPublish = "__EMPTY_2";
  const link = "__EMPTY_3";
  return {
      [facultyName]: record.facultyName,
      [patentNumber]: record.patentNumber,
      [patentTitle]: record.patentTitle,
      [patentPublish]: record.patentPublish,
      [link]: record.link,
  };
};


router.get('/',(req,res)=>{
  const name = '3.4.3';
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
      const sheetName = '3.4.3';

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
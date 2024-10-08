// import express from "express";
// import { spreadsheetId } from "../../helper/googleapis";
// import sheets from "../../helper/googleapis";
// const router = express.Router();

// const sheet = "3.4.5";
// const headers = {
//   title:
//     "3.4.5 Number of research papers per teacher in the Journals notified on UGC website during the last five years  (15)",
//   authorName: "__EMPTY",
//   teacherDepartment: "__EMPTY_1",
//   journalName: "__EMPTY_2",
//   publicationYear: "__EMPTY_3",
//   issnNumber: "__EMPTY_4",
//   linkWebsite: "__EMPTY_5",
//   linkDocs: "__EMPTY_6",
//   isListed: "__EMPTY_7",
//   linktoRe: "__EMPTY_8",
// };

// const transformData = (data: any[]) => {
//   const records = data.slice(4);
//   return records.map((row: any[]) => ({
//     title: row[0] ?? "",
//     authorName: row[1] ?? "",
//     teacherDepartment: row[2] ?? "",
//     journalName: row[3] ?? "",
//     publicationYear: row[4] ?? "",
//     issnNumber: row[5] ?? "",
//     linkWebsite: row[6] ?? "",
//     linkDocs: row[7] ?? "",
//     isListed: row[8] ?? "",
//     linktoRe: row[9] ?? "",
//   }));
// };

// const transformSingleRecord = (record: any) => ({
//   [headers.title]: record.title,
//   [headers.authorName]: record.authorName,
//   [headers.teacherDepartment]: record.teacherDepartment,
//   [headers.journalName]: record.journalName,
//   [headers.publicationYear]: record.publicationYear,
//   [headers.issnNumber]: record.issnNumber,
//   [headers.linkWebsite]: record.linkWebsite,
//   [headers.linkDocs]: record.linkDocs,
//   [headers.isListed]: record.isListed,
//   [headers.linktoRe]: record.linktoRe,
// });

// router.get("/", async (req, res) => {
//   const sheetName = sheet;
//   try {
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range: sheetName,
//     });

//     const data = response.data.values || [];
//     res.status(200).json(transformData(data));
//   } catch (error) {
//     console.error("Error reading Google Sheet:", error);
//     res.status(500).send("Error reading Google Sheet");
//   }
// });

// router.post("/", async (req, res) => {
//   const newRecord = req.body;
//   try {
//     const readResponse = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range: `${sheet}`,
//     });

//     const existingData = readResponse.data.values || [];
//     const headers = existingData.slice(0, 4);
//     const body = existingData.slice(4);
//     const transformedNewRecord = transformSingleRecord(newRecord);
//     const updatedData = [
//       ...headers,
//       Object.values(transformedNewRecord),
//       ...body,
//     ];

//     await sheets.spreadsheets.values.update({
//       spreadsheetId,
//       range: `${sheet}`,
//       valueInputOption: "RAW",
//       requestBody: {
//         values: updatedData,
//       },
//     });

//     res.status(201).json({
//       message: "Data successfully added at the top",
//       updatedData,
//     });
//   } catch (error) {
//     console.error("Error updating Google Sheet:", error);
//     res.status(500).send("Error updating Google Sheet");
//   }
// });

// export default router;

import express from "express";
import { spreadsheetId } from "../../helper/googleapis";
import sheets from "../../helper/googleapis";
const router = express.Router();

const sheet = "3.4.5";
const headers = {
  title:
    "3.4.5 Number of research papers per teacher in the Journals notified on UGC website during the last five years  (15)",
  authorName: "__EMPTY",
  teacherDepartment: "__EMPTY_1",
  journalName: "__EMPTY_2",
  publicationYear: "__EMPTY_3",
  issnNumber: "__EMPTY_4",
  linkWebsite: "__EMPTY_5",
  linkDocs: "__EMPTY_6",
  isListed: "__EMPTY_7",
  abstract: "__EMPTY_8",
  keywords: "__EMPTY_9",
  titleDomain: "__EMPTY_10",
};

const transformData = (data: any[]) => {
  const records = data.slice(4);
  return records.map((row: any[]) => ({
    title: row[0] ?? "",
    authorName: row[1] ?? "",
    teacherDepartment: row[2] ?? "",
    journalName: row[3] ?? "",
    publicationYear: row[4] ?? "",
    issnNumber: row[5] ?? "",
    linkWebsite: row[6] ?? "",
    linkDocs: row[7] ?? "",
    isListed: row[8] ?? "",
    abstract: row[9] ?? "",
    keywords: row[10] ?? "",
    titleDomain: row[11] ?? "",
  }));
};

const transformSingleRecord = (record: any) => ({
  [headers.title]: record.title,
  [headers.authorName]: record.authorName,
  [headers.teacherDepartment]: record.teacherDepartment,
  [headers.journalName]: record.journalName,
  [headers.publicationYear]: record.publicationYear,
  [headers.issnNumber]: record.issnNumber,
  [headers.linkWebsite]: record.linkWebsite,
  [headers.linkDocs]: record.linkDocs,
  [headers.isListed]: record.isListed ? "Yes" : "No",
  [headers.abstract]: record.abstract,
  [headers.keywords]: record.keywords,
  [headers.titleDomain]: record.titleDomain,
});

router.get("/", async (req, res) => {
  const sheetName = sheet;
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: sheetName,
    });

    const data = response.data.values || [];
    res.status(200).json(transformData(data));
  } catch (error) {
    console.error("Error reading Google Sheet:", error);
    res.status(500).send("Error reading Google Sheet");
  }
});

router.post("/", async (req, res) => {
  const newRecord = req.body;
  console.log(newRecord);

  try {
    const readResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheet}`,
    });

    const existingData = readResponse.data.values || [];
    const headers = existingData.slice(0, 4);
    const body = existingData.slice(4);

    const { isListed, ...recordWithoutIsListed } = newRecord;
    const transformedNewRecord = transformSingleRecord({
      ...recordWithoutIsListed,
      isListed: isListed,
    });

    const newRow = Object.values(transformedNewRecord);
    console.log("newRow", newRow);

    const updatedData = [...headers, newRow, ...body];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheet}`,
      valueInputOption: "RAW",
      requestBody: {
        values: updatedData,
      },
    });

    res.status(201).json({
      message: "Data successfully added at the top",
      updatedData,
    });
  } catch (error) {
    console.error("Error updating Google Sheet:", error);
    res.status(500).send("Error updating Google Sheet");
  }
});

export default router;

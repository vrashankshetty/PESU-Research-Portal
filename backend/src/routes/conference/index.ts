import express from "express";
import { spreadsheetId } from "../../helper/googleapis";
import sheets from "../../helper/googleapis";
const router = express.Router();

const headers = {
  slno: "3.4.6 Number of books and  chapters in edited volumes published per teacher during the last five years (15)\n",
  facultyName: "__EMPTY",
  titleBook: "__EMPTY_1",
  titlePaper: "__EMPTY_2",
  titleConference: "__EMPTY_3",
  publicationYear: "__EMPTY_4",
  issnNumber: "__EMPTY_5",
  isSameInstitution: "__EMPTY_6",
  publisherName: "__EMPTY_7",
  abstract: "__EMPTY_8",
  keywords: "__EMPTY_9",
  titleDomain: "__EMPTY_10",
};

const transformData = (data: any[]) => {
  const records = data.slice(3);
  return records.map((row: any[]) => ({
    slno: row[0] ?? "",
    facultyName: row[1] ?? "",
    titleBook: row[2] ?? "",
    titlePaper: row[3] ?? "",
    titleConference: row[4] ?? "",
    publicationYear: row[5] ?? "",
    issnNumber: row[6] ?? "",
    isSameInstitution: row[7] ?? "",
    publisherName: row[8] ?? "",
    abstract: row[9] ?? "",
    keywords: row[10] ?? "",
    titleDomain: row[11] ?? "",
  }));
};

const transformSingleRecord = (record: any) => ({
  [headers.slno]: record.slno,
  [headers.facultyName]: record.facultyName,
  [headers.titleBook]: record.titleBook,
  [headers.titlePaper]: record.titlePaper,
  [headers.titleConference]: record.titleConference,
  [headers.publicationYear]: record.publicationYear,
  [headers.issnNumber]: record.issnNumber,
  [headers.isSameInstitution]: record.isSameInstitution,
  [headers.publisherName]: record.publisherName,
  [headers.abstract]: record.abstract,
  [headers.keywords]: record.keywords,
  [headers.titleDomain]: record.titleDomain,
});

router.get("/", async (req, res) => {
  const sheetName = "3.4.6";
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
  try {
    const transformedNewRecord = transformSingleRecord(newRecord);

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "3.4.6!A1",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [Object.values(transformedNewRecord)],
      },
    });

    res.status(201).json({
      message: "Data successfully added",
      updates: response.data,
    });
  } catch (error) {
    console.error("Error updating Google Sheet:", error);
    res.status(500).send("Error updating Google Sheet");
  }
});

export default router;

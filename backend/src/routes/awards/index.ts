import express from "express";
import sheets from "../../helper/googleapis";
import { spreadsheetId } from "../../helper/googleapis";
const sheetName = "3.3.3";

const transformData = (data: any[]) => {
  const records = data.slice(3);
  return records.map((row: any[]) => ({
    year: row[0] ?? "",
    title: row[1] ?? "",
    awardeeName: row[2] ?? "",
    awardingAgencyName: row[3] ?? "",
    category: row[4] ?? "",
  }));
};

const transformSingleRecord = (record: any) => [
  record.year,
  record.title,
  record.awardeeName,
  record.awardingAgencyName,
  record.category,
];

const router = express.Router();

router.get("/", async (req, res) => {
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
  console.log("newRecord", newRecord);
  try {
    const readResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}`,
    });
    console.log(readResponse);

    const existingData = readResponse.data.values || [];
    console.log("existingData", existingData);
    const headers = existingData.slice(0, 3);
    const body = existingData.slice(3);
    const transformedNewRecord = transformSingleRecord(newRecord);
    console.log("transformedNewRecord", transformedNewRecord);
    const updatedData = [
      ...headers,
      Object.values(transformedNewRecord),
      ...body,
    ];
    console.log("updatedData", updatedData);

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}`,
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

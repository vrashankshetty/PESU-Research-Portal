import express from 'express';
import sheets from '../../helper/googleapis';
import { spreadsheetId } from '../../helper/googleapis';
const sheetName = '3.4.3';

const transformData = (data: any[]) => {
  const records = data.slice(3);
  return records.map((row: any[]) => ({
    facultyName: row[0] ?? '',
    patentNumber: row[1] ?? '',
    patentTitle: row[2] ?? '',
    patentPublish: row[3] ?? '',
    link: row[4] ?? '',
  }));
};

const transformSingleRecord = (record: any) => [
  record.facultyName,
  record.patentNumber,
  record.patentTitle,
  record.patentPublish,
  record.link,
];


const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: sheetName,
    });
    const data = response.data.values || [];
    res.status(200).json(transformData(data));
  } catch (error) {
    console.error('Error reading Google Sheet:', error);
    res.status(500).send('Error reading Google Sheet');
  }
});

router.post('/', async (req, res) => {
  const newRecord = req.body;
  try {
    const readResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}`,
    });

    const existingData = readResponse.data.values || [];
    const headers = existingData.slice(0,3);
    const body = existingData.slice(3);
    const transformedNewRecord = transformSingleRecord(newRecord);
    const updatedData = [...headers,Object.values(transformedNewRecord), ...body];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: updatedData,
      },
    });

    res.status(201).json({
      message: 'Data successfully added at the top',
      updatedData,
    });
  } catch (error) {
    console.error('Error updating Google Sheet:', error);
    res.status(500).send('Error updating Google Sheet');
  }
});

export default router;
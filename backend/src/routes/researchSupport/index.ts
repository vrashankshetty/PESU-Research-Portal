import express from 'express';
import sheets from '../../helper/googleapis';
import { spreadsheetId } from '../../helper/googleapis';
const sheetName = '6.3.2';

const transformData = (data: any[]) => {
  const records = data.slice(2);
  return records.map((row: any[]) => ({
    year: row[0] ?? '',
    facultyName: row[1] ?? '',
    conferenceName: row[2] ?? '',
    professionalbodyName: row[3] ?? '',
    amount: row[4] ?? '',
  }));
};

const transformSingleRecord = (record: any) => [
  record.year,
  record.facultyName,
  record.conferenceName,
  record.professionalbodyName,
  record.amount,
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
      const headers = existingData.slice(0,2);
      const body = existingData.slice(2);
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
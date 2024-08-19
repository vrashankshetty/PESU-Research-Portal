import express from 'express';
import sheets from '../../helper/googleapis';
import { spreadsheetId } from '../../helper/googleapis';
const sheetName = '3.1.6';

const transformData = (data: any[]) => {
  const records = data.slice(5);
  return records.map((row: any[]) => ({
    projectName: row[0] ?? '',
    principalInvestigator: row[1] ?? '',
    fundingAgency: row[2] ?? '',
    type: row[3] ?? '',
    department: row[4] ?? '',
    awardYear: row[5] ?? '',
    fundProvided: row[6] ?? '',
    projectDuration: row[7] ?? '',
  }));
};

const transformSingleRecord = (record: any) => [
  record.projectName,
  record.principalInvestigator,
  record.fundingAgency,
  record.type,
  record.department,
  record.awardYear,
  record.fundProvided,
  record.projectDuration,
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
      const headers = existingData.slice(0,5);
      const body = existingData.slice(5);
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
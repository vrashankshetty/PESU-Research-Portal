import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();


const credentials = require('../../files/serviceAccount.json');


const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });


export const spreadsheetId = process.env.SPREADSHEET_ID;

export default sheets;
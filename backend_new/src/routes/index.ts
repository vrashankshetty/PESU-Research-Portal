import express from 'express';


import journal from './journal/api';
import conference from './conference/api'
import patent from './patent/api'
const router = express.Router();

router.use('/journal', journal);
router.use('/conference',conference);
router.use('/patent',patent);
export default router;

import express from 'express';
import conference from './conference';
import journal from './journal';
import patent from './patent'

const router = express.Router();

router.use('/journal', journal);
router.use('/conference', conference);
router.use('/patent', patent);
export default router;
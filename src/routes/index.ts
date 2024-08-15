import express from 'express';
import conference from './conference';
import journal from './journal';
import patent from './patent'
import researchSupport from './researchSupport';
import researchGrant from './researchGrant';
import awards from './awards'
const router = express.Router();

router.use('/journal', journal);
router.use('/conference', conference);
router.use('/patent', patent);
router.use('/researchGrant',researchGrant);
router.use('/researchSupport',researchSupport);
router.use('/awards',awards);
export default router;
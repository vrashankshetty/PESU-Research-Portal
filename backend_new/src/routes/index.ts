import express from 'express';


import journal from './journal/api';
import conference from './conference/api'
import patent from './patent/api'
import auth from './auth/api'
const router = express.Router();

router.use('/journal', journal);
router.use('/conference',conference);
router.use('/patent',patent);
router.use('/auth',auth);
export default router;

import express from 'express';


import journal from './journal/api';
import conference from './conference/api'
import patent from './patent/api'
import auth from './auth/api'
import user from './user/api'
import authenticateUser from '../middleware/authenticate-user';

const router = express.Router();

router.use('/user',authenticateUser,user);
router.use('/journal',authenticateUser, journal);
router.use('/conference',authenticateUser,conference);
router.use('/patent',authenticateUser,patent);
router.use('/auth',auth);

export default router;

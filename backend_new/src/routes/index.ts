import express from 'express';


import journal from './journal/api';
import conference from './conference/api'
import patent from './patent/api'
import auth from './auth/api'
import user from './user/api'
import departmentConductedActivity from './departmentConductedActivity/api'
import departmentAttendedActivity from './departmentAttendedActivity/api'
import studentCareerCounselling from './studentCareerCounselling/api'
import studentEntranceExam from './studentEntranceExam/api'
import studentHigherStudies from './studentHigherStudies/api'
import studentSportsCultural from './studentSportsCultural/api'
import authenticateUser from '../middleware/authenticate-user';

const router = express.Router();

router.use('/user',authenticateUser,user);
router.use('/journal', journal);
router.use('/conference',conference);
router.use('/patent',patent);
router.use('/auth',auth);
router.use('/departmentConductedActivity',authenticateUser,departmentConductedActivity);
router.use('/departmentAttendedActivity',authenticateUser,departmentAttendedActivity);
router.use('/studentCareerCounselling',authenticateUser,studentCareerCounselling);
router.use('/studentEntranceExam',authenticateUser,studentEntranceExam);
router.use('/studentHigherStudies',authenticateUser,studentHigherStudies);
router.use('/studentSportsCultural',authenticateUser,studentSportsCultural);

export default router;

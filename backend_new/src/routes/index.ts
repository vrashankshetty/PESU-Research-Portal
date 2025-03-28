import express from 'express';

import journal from './journal/api';
import conference from './conference/api';
import patent from './patent/api';
import auth from './auth/api';
import user from './user/api';
import departmentConductedActivity from './departmentConductedActivity/api';
import departmentAttendedActivity from './departmentAttendedActivity/api';
import studentCareerCounselling from './studentCareerCounselling/api';
import studentEntranceExam from './studentEntranceExam/api';
import studentHigherStudies from './studentHigherStudies/api';
import interSports from './interSports/api';
import intraSports from './intraSports/api';
import authenticateUser from '../middleware/authenticate-user';
import home from './home/api';
const router = express.Router();

// router.use('/user', authenticateUser, user);
// router.use('/home', home);
// router.use('/journal', authenticateUser,journal);
// router.use('/conference',authenticateUser, conference);
// router.use('/patent',authenticateUser,patent);
// router.use('/auth', auth);
// router.use('/departmentConductedActivity', authenticateUser,departmentConductedActivity);
// router.use('/departmentAttendedActivity', authenticateUser,departmentAttendedActivity);
// router.use('/studentEntranceExam',authenticateUser, studentEntranceExam);
// router.use('/studentHigherStudies', authenticateUser,studentHigherStudies);
// router.use('/studentCareerCounselling', authenticateUser,studentCareerCounselling);
// router.use('/interSports',authenticateUser, interSports);
// router.use('/intraSports',authenticateUser, intraSports);



router.use('/user', user);
router.use('/home', home);
router.use('/journal',journal);
router.use('/conference', conference);
router.use('/patent',patent);
router.use('/auth', auth);
router.use('/departmentConductedActivity',departmentConductedActivity);
router.use('/departmentAttendedActivity',departmentAttendedActivity);
router.use('/studentEntranceExam', studentEntranceExam);
router.use('/studentHigherStudies',studentHigherStudies);
router.use('/studentCareerCounselling',studentCareerCounselling);
router.use('/interSports', interSports);
router.use('/intraSports', intraSports);
export default router;

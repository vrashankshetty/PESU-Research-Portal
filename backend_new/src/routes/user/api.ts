import express from 'express';
import { getAllUsers, getUserProfile, updateUserProfile } from './repository';
import { catchError } from '../../utils/catch-error';
import authenticateUser from '../../middleware/authenticate-user';
import { userUpdateSchema } from './schema';
import handleValidationError from '../../utils/handle-validation-error';

const Router = express.Router();

Router.get('/', async (req, res) => {
    try {
        console.log('users', (req as any).user);
        const course = await getAllUsers();
        res.status(200).send(course);
    } catch (error) {
        console.log('error', error);
        catchError(error, res);
    }
});

Router.get('/profile', authenticateUser, async (req, res) => {
    try {
        const userId = (req as any).user.id;
        const profile = await getUserProfile(userId);
        res.status(200).send(profile);
    } catch (error) {
        console.log('error', error);
        catchError(error, res);
    }
});

Router.put('/profile', authenticateUser, async (req, res) => {
    try {
        const data = req.body;
        const userId = (req as any).user.id;

        const { error } = userUpdateSchema.validate(data, { abortEarly: false });
        if (error) {
            return handleValidationError(error, res);
        }

        const userData = await updateUserProfile(userId, data);
        if (userData?.status === 404) {
            return res.status(404).send(userData?.message);
        }
        res.status(200).send(userData?.message);
    } catch (error) {
        catchError(error, res);
    }
});

export default Router;

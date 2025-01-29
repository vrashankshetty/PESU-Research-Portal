import express from 'express';
import { getAllUsers, getUserProfile } from './repository';
import { catchError } from '../../utils/catch-error';
import authenticateUser from '../../middleware/authenticate-user';

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

export default Router;

import express from 'express';
import authenticateUser from '../../middleware/authenticate-user';
import { getStats, getUserStats } from './repository';

const Router = express.Router();

Router.get('/', async (req, res) => {
    try {
        const data = await getStats();
        res.status(200).send(data);
    } catch (error) {
        console.log('err', error);
        res.status(500).send('Something went wrong logging you in');
    }
});

Router.get('/stats', authenticateUser, async (req, res) => {
    try {
        const userId = (req as any).user.id;
        if (!userId) {
            return res.status(400).send('Invalid user ID');
        }
        const data = await getUserStats(userId);
        res.status(200).send(data);
    } catch (error) {
        console.log('err', error);
        res.status(500).send('Error fetching user statistics');
    }
});

export default Router;

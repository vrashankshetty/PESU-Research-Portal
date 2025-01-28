import express from 'express';
import handleValidationError from '../../utils/handle-validation-error';
import { getStats } from './repository';

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

export default Router;

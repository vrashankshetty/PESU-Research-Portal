import express from 'express';
import { catchError } from '../../utils/catch-error';
import { getFilteredPublications } from './repository';


const Router = express.Router();

Router.get('/', async (req, res) => {
    try {
        const query = req.query;
        const course = await getFilteredPublications(query)
        res.status(200).send(course);
    } catch (error) {
        console.log('error', error);
        catchError(error, res);
    }
});



export default Router;
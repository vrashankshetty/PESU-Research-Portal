import express from 'express';
import { catchError } from '../../utils/catch-error';
import handleValidationError from '../../utils/handle-validation-error';
import { createActivity, deleteActivity, getAllActivities, getEachActivity, updateActivity } from './repository';
import { studentHigherStudiesSchema } from './schema';

const Router = express.Router();

Router.get('/', async (req, res) => {
    try {
        const query = req.query;
        const course = await getAllActivities(query);
        res.status(200).send(course);
    } catch (error) {
        console.log('error', error);
        catchError(error, res);
    }
});

Router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // const userId = (req as any).user.id;
        const course = await getEachActivity(id);
        if (!course) {
            return res.status(404).json({
                message: 'Not Found',
            });
        }
        res.status(200).send(course);
    } catch (error) {
        catchError(error, res);
    }
});

Router.post('/', async (req, res) => {
    try {
        const data = req.body;
        // const userId = (req as any).user.id;
        const { error } = studentHigherStudiesSchema.validate(data, { abortEarly: false });
        if (error) {
            console.log('error', error);
            return handleValidationError(error, res);
        }

        const confData = await createActivity(data);
        res.status(201).send(confData);
    } catch (error) {
        console.log('catch error', error);
        catchError(error, res);
    }
});

Router.put('/:id', async (req, res) => {
    try {
        const data = req.body;
        const id = req.params.id;
        // const userId = (req as any).user.id;
        const { error } = studentHigherStudiesSchema.validate(data, { abortEarly: false });
        if (error) {
            return handleValidationError(error, res);
        }

        const confData = await updateActivity(data, id);
        if (confData?.status === 404) {
            return res.status(404).send(confData?.message);
        }
        res.status(200).send(confData?.message);
    } catch (error) {
        catchError(error, res);
    }
});

Router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // const userId = (req as any).user.id;
        const role = (req as any).user.role;
        const accessTo = (req as any).user.accessTo;
        const confData = await deleteActivity(id, role, accessTo);
        if (confData?.status === 404 || confData?.status === 403) {
            return res.status(confData?.status).send(confData?.message);
        }
        return res.status(200).send(confData?.message);
    } catch (error) {
        catchError(error, res);
    }
});

export default Router;

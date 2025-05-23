import express from 'express';
import { catchError } from '../../utils/catch-error';
import handleValidationError from '../../utils/handle-validation-error';
import { createActivity, deleteActivity, getAllActivities, getEachActivity, seedActivity, updateActivity } from './repository';
import { departmentConductedActivitySchema } from './schema';

const Router = express.Router();

Router.get('/', async (req, res) => {
    try {
        const userId = (req as any).user.id;
        const role = (req as any).user.role;
        const accessTo = (req as any).user.accessTo;
        const query = req.query;
        const course = await getAllActivities(userId, query, role, accessTo);
        res.status(200).send(course);
    } catch (error) {
        console.log('error', error);
        catchError(error, res);
    }
});

Router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userId = (req as any).user.id;
        const role = (req as any).user.role;
        const accessTo = (req as any).user.accessTo;
        const course = await getEachActivity(id, userId, role, accessTo);
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
        const userId = (req as any).user.id;
        const { error } = departmentConductedActivitySchema.validate(data, { abortEarly: false });
        if (error) {
            console.log('error', error);
            return handleValidationError(error, res);
        }

        const activityData = await createActivity(data, userId);
        res.status(201).send(activityData);
    } catch (error) {
        console.log('catch error', error);
        catchError(error, res);
    }
});

Router.put('/:id', async (req, res) => {
    try {
        const data = req.body;
        const id = req.params.id;
        const userId = (req as any).user.id;
        const role = (req as any).user.role;
        const accessTo = (req as any).user.accessTo;
        const { error } = departmentConductedActivitySchema.validate(data, { abortEarly: false });
        if (error) {
            return handleValidationError(error, res);
        }

        const activityData = await updateActivity(data, id, userId,role, accessTo);
        if (activityData?.status === 404) {
            return res.status(404).send(activityData?.message);
        }
        res.status(200).send(activityData?.message);
    } catch (error) {
        catchError(error, res);
    }
});

Router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userId = (req as any).user.id;
        const role = (req as any).user.role;
        const accessTo = (req as any).user.accessTo;
        const activityData = await deleteActivity(id, userId, role, accessTo);
        if (activityData?.status === 404 || activityData?.status === 403) {
            return res.status(activityData?.status).send(activityData?.message);
        }
        return res.status(200).send(activityData?.message);
    } catch (error) {
        catchError(error, res);
    }
});

Router.post('/seed', async (req, res) => {
    try {
        const data = req.body;
        const { name, ...rest } = data;
        const { error } = departmentConductedActivitySchema.validate(rest, { abortEarly: false });
        if (error) {
            console.log('error', error);
            return handleValidationError(error, res);
        }

        const journalData = await seedActivity(rest, name);
        res.status(201).send(journalData);
    } catch (error) {
        console.log('catch error', error);
        catchError(error, res);
    }
});


export default Router;

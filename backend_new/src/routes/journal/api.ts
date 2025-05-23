import express from 'express';
import { createJournal, deleteJournal, getAllJournal, getEachJournal, seedJournal, updateJournal } from './repository';
import { catchError } from '../../utils/catch-error';
import { journalSchema } from './schema';
import handleValidationError from '../../utils/handle-validation-error';
// import authenticateUser from '../../middleware/authenticate-user';
// import { user } from '../../models/user';

const Router = express.Router();

Router.get('/', async (req, res) => {
    try {
        const userId = (req as any).user.id;
        const role = (req as any).user.role;
        const accessTo = (req as any).user.accessTo;
        const course = await getAllJournal(userId, role, accessTo);
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
        const course = await getEachJournal(id, userId, role, accessTo);
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
        const { error } = journalSchema.validate(data, { abortEarly: false });
        if (error) {
            console.log('error', error);
            return handleValidationError(error, res);
        }

        const journalData = await createJournal(data, userId);
        res.status(201).send(journalData);
    } catch (error) {
        console.log('catch error', error);
        catchError(error, res);
    }
});

Router.put('/:id', async (req, res) => {
    try {
        const data = req.body;
        const id = req.params.id;
        const role = (req as any).user.role;
        const accessTo = (req as any).user.accessTo;
        const userId = (req as any).user.id;
        const { error } = journalSchema.validate(data, { abortEarly: false });
        if (error) {
            return handleValidationError(error, res);
        }
        const journalData = await updateJournal(data, id, userId,role,accessTo);
        if (journalData?.status == 403) {
            return res.status(403).send(journalData?.message);
        }
        res.status(200).send(journalData?.message);
    } catch (error) {
        catchError(error, res);
    }
});

Router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const role = (req as any).user.role;
        const accessTo = (req as any).user.accessTo;
        const userId = (req as any).user.id;
        const journalData = await deleteJournal(id, userId,role,accessTo);
        if (journalData?.status === 200) {
            return res.status(200).send(journalData?.data);
        }
        return res.status(403).send(journalData?.data);
    } catch (error) {
        catchError(error, res);
    }
});

Router.post('/seed', async (req, res) => {
    try {
        const data = req.body;
        const { name, ...rest } = data;
        const { error } = journalSchema.validate(rest, { abortEarly: false });
        if (error) {
            console.log('error', error);
            return handleValidationError(error, res);
        }

        const journalData = await seedJournal(rest, name);
        res.status(201).send(journalData);
    } catch (error) {
        console.log('catch error', error);
        catchError(error, res);
    }
});

export default Router;

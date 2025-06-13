import express from 'express';
import { catchError } from '../../utils/catch-error';
import handleValidationError from '../../utils/handle-validation-error';
import { createMOU, deleteMOU, getAllMOUs, getEachMOU, updateMOU } from './repository';
import { mouSchema } from './schema';

const Router = express.Router();

Router.get('/', async (req, res) => {
    try {
        const query = req.query;
        const mous = await getAllMOUs(query);
        res.status(200).send(mous);
    } catch (error) {
        console.log('error', error);
        catchError(error, res);
    }
});

Router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const mouData = await getEachMOU(id);
        
        if (!mouData) {
            return res.status(404).json({
                message: 'MOU not found',
            });
        }
        
        res.status(200).send(mouData);
    } catch (error) {
        catchError(error, res);
    }
});

Router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const userId = (req as any).user.id;
        const { error } = mouSchema.validate(data, { abortEarly: false });
        
        if (error) {
            console.log('error', error);
            return handleValidationError(error, res);
        }

        const result = await createMOU(data,userId);
        res.status(201).send(result);
    } catch (error) {
        console.log('catch error', error);
        catchError(error, res);
    }
});

Router.put('/:id', async (req, res) => {
    try {
        const data = req.body;
        const id = req.params.id;
        
        const { error } = mouSchema.validate(data, { abortEarly: false });
        if (error) {
            return handleValidationError(error, res);
        }

        const result = await updateMOU(data, id);
        if (result?.status === 404) {
            return res.status(404).send(result?.message);
        }
        
        res.status(200).send(result?.message);
    } catch (error) {
        catchError(error, res);
    }
});

Router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const role = (req as any).user.role;
        const accessTo = (req as any).user.accessTo;
        
        const result = await deleteMOU(id, role, accessTo);
        if (result?.status === 404 || result?.status === 403) {
            return res.status(result?.status).send(result?.message);
        }
        
        return res.status(200).send(result?.message);
    } catch (error) {
        catchError(error, res);
    }
});

export default Router;
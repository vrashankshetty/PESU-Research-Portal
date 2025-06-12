import express from 'express';
import { catchError } from '../../utils/catch-error';
import handleValidationError from '../../utils/handle-validation-error';
import { createGrant, deleteGrant, getAllGrants, getEachGrant, updateGrant } from './repository';
import { grantSchema } from './schema';

const Router = express.Router();

Router.get('/', async (req, res) => {
    try {
        const query = req.query;
        const grants = await getAllGrants(query);
        res.status(200).send(grants);
    } catch (error) {
        console.log('error', error);
        catchError(error, res);
    }
});

Router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const grantData = await getEachGrant(id);
        
        if (!grantData) {
            return res.status(404).json({
                message: 'Grant not found',
            });
        }
        
        res.status(200).send(grantData);
    } catch (error) {
        catchError(error, res);
    }
});

Router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const { error } = grantSchema.validate(data, { abortEarly: false });
        
        if (error) {
            console.log('error', error);
            return handleValidationError(error, res);
        }

        const result = await createGrant(data);
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
        
        const { error } = grantSchema.validate(data, { abortEarly: false });
        if (error) {
            return handleValidationError(error, res);
        }

        const result = await updateGrant(data, id);
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
        
        const result = await deleteGrant(id, role, accessTo);
        if (result?.status === 404 || result?.status === 403) {
            return res.status(result?.status).send(result?.message);
        }
        
        return res.status(200).send(result?.message);
    } catch (error) {
        catchError(error, res);
    }
});

export default Router;
import express from 'express';
import { createJournal, deleteJournal, getAllJournal, getEachJournal, updateJournal } from './repository';
import { catchError } from '../../utils/catch-error';
import { journalSchema } from './schema';
import handleValidationError from '../../utils/handle-validation-error';


const Router = express.Router();








Router.get('/', async (req, res) => {
    try {
        const course = await getAllJournal();
        res.status(200).send(course);
    } catch (error) {
        catchError(error, res);
    }
});

Router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const course = await getEachJournal(id)
        if(!course){
            return res.status(404).json({
                message:"Not Found"
            })
        }
        res.status(200).send(course);
    } catch (error) {
        catchError(error, res);
    }
});

Router.post('/', async (req, res) => {
    try {
        const data = req.body;

        const { error } = journalSchema.validate(
            data,
            { abortEarly: false },
        );
        if (error) {
            console.log("error",error)
            return handleValidationError(error, res);
        }
        const journalData = await createJournal(data);
        res.status(201).send(journalData);
    } catch (error) {
        console.log("catch error",error)
        catchError(error, res);
    }
});


Router.put('/:id', async (req, res) => {
    try {
        const data = req.body;
        const id = req.params.id;
        const { error } = journalSchema.validate(
            data,
            { abortEarly: false },
        );
        if (error) {
            return handleValidationError(error, res);
        }
        const journalData = await updateJournal(data,id);
        res.status(200).send(journalData);
    } catch (error) {
        catchError(error, res);
    }
});


Router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const journalData = await deleteJournal(id);
        res.status(200).send(journalData);
    } catch (error) {
        catchError(error, res);
    }
});


export default Router;

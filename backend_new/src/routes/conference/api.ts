import express from 'express';
import { catchError } from '../../utils/catch-error';
import { conferenceSchema } from './schema';
import handleValidationError from '../../utils/handle-validation-error';
import { createConference, deleteConference, getAllConference, getEachConferece, updateConference } from './repository';


const Router = express.Router();








Router.get('/', async (req, res) => {
    try {
        const course = await getAllConference();
        res.status(200).send(course);
    } catch (error) {
        catchError(error, res);
    }
});

Router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const course = await getEachConferece(id)
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

        const { error } = conferenceSchema.validate(
            data,
            { abortEarly: false },
        );
        if (error) {
            console.log("error",error)
            return handleValidationError(error, res);
        }
        const journalData = await createConference(data);
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
        const { error } = conferenceSchema.validate(
            data,
            { abortEarly: false },
        );
        if (error) {
            return handleValidationError(error, res);
        }
        const journalData = await updateConference(data,id);
        res.status(200).send(journalData);
    } catch (error) {
        catchError(error, res);
    }
});


Router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const journalData = await deleteConference(id);
        res.status(200).send(journalData);
    } catch (error) {
        catchError(error, res);
    }
});


export default Router;

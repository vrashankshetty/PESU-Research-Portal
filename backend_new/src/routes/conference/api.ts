import express from 'express';
import { createConference,updateConference,deleteConference,getAllConference,getEachConference } from './repository';
import { catchError } from '../../utils/catch-error';
import { conferenceSchema } from './schema';
import handleValidationError from '../../utils/handle-validation-error';
import authenticateUser from '../../middleware/authenticate-user';


const Router = express.Router();





Router.get('/',authenticateUser,async (req, res) => {
    try {
        const userId = (req as any).user.id;
        const course = await getAllConference(userId)
        res.status(200).send(course);
    } catch (error) {
        console.log("error",error)
        catchError(error, res);
    }
});

Router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userId = (req as any).user.id;
        const course = await getEachConference(id,userId)
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

Router.post('/',async (req, res) => {
    try {
        const data = req.body;
        const userId = (req as any).user.id;
        const { error } = conferenceSchema.validate(
            data,
            { abortEarly: false },
        );
        if (error) {
            console.log("error",error)
            return handleValidationError(error, res);
        }
        
        const confData = await createConference(data,userId);
        res.status(201).send(confData);
    } catch (error) {
        console.log("catch error",error)
        catchError(error, res);
    }
});


Router.put('/:id', async (req, res) => {
    try {
        const data = req.body;
        const id = req.params.id;
        const userId = (req as any).user.id;
        const { error } = conferenceSchema.validate(
            data,
            { abortEarly: false },
        );
        if (error) {
            return handleValidationError(error, res);
        }

        const confData = await updateConference(data,id,userId);
        if(confData?.status==403){
            return res.status(403).send(confData?.message);
        }
        res.status(200).send(confData?.message);
        
    } catch (error) {
        catchError(error, res);
    }
});


Router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userId = (req as any).user.id;
        const confData = await deleteConference(id,userId);
        if(confData?.status === 200){
            return res.status(200).send(confData?.data);
        }
        return res.status(403).send(confData?.data)
    } catch (error) {
        catchError(error, res);
    }
});


export default Router;
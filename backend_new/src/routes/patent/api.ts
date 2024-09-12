import express from 'express';
import { createPatent, deletePatent, getAllPatent, getEachPatent, updatePatent } from './repository';
import { catchError } from '../../utils/catch-error';
import { patentSchema } from './schema';
import handleValidationError from '../../utils/handle-validation-error';
import authenticateUser from '../../middleware/authenticate-user';


const Router = express.Router();








Router.get('/',authenticateUser,async (req, res) => {
    try {
        const userId = (req as any).user.id;
        const course = await getAllPatent(userId);
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
        const course = await getEachPatent(id,userId)
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
        const { error } = patentSchema.validate(
            data,
            { abortEarly: false },
        );
        if (error) {
            console.log("error",error)
            return handleValidationError(error, res);
        }
        
        const patentData = await createPatent(data,userId);
        res.status(201).send(patentData);
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
        const { error } = patentSchema.validate(
            data,
            { abortEarly: false },
        );
        if (error) {
            return handleValidationError(error, res);
        }
        
        const patentData = await updatePatent(data,id,userId);
        if(patentData?.status==403){
            return res.status(403).send(patentData?.message);
        }
        return res.status(200).send(patentData?.message);
    } catch (error) {
        catchError(error, res);
    }
});


Router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userId = (req as any).user.id;
        const patentData = await deletePatent(id,userId);
        if(patentData?.status === 200){
            return res.status(200).send(patentData?.data);
        }
        return res.status(403).send(patentData?.data)
    } catch (error) {
        catchError(error, res);
    }
});


export default Router;

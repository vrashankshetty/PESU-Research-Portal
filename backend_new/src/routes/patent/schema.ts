import Joi from 'joi';


export const patentSchema = Joi.object({
    teacherName: Joi.string().required(),
    campus: Joi.string().required(), 
    dept: Joi.string().required(), 
    patentNumber: Joi.string().required(),
    patentTitle: Joi.string().required(),
    year: Joi.string().required(),
    documentLink: Joi.string(),
});
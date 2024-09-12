import Joi from 'joi';


export const patentSchema = Joi.object({
    campus: Joi.string().required(), 
    teacherIds: Joi.array().items(Joi.string()).default([]),
    dept: Joi.string().valid('EC','CSE').required(),
    patentNumber: Joi.string().required(),
    patentTitle: Joi.string().required(),
    isCapstone: Joi.boolean().default(false),
    year: Joi.string().required(),
    documentLink: Joi.string().uri().required()
});
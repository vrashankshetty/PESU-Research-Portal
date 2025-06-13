import Joi from 'joi';

export const patentSchema = Joi.object({
    teacherIds: Joi.array().items(Joi.string()).default([]),
    patentNumber: Joi.string().required(),
    patentTitle: Joi.string().required(),
    isCapstone: Joi.boolean().default(false),
    status:Joi.string().allow(''),
    year: Joi.string().required(),
    documentLink: Joi.string().uri().required(),
});

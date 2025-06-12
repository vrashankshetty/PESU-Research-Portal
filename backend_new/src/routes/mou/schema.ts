import Joi from 'joi';

export const mouSchema = Joi.object({
    organizationName: Joi.string().required(),
    yearOfSigning: Joi.string().required(),
    duration: Joi.string().required(),
    activities: Joi.string().required(),
    documentLink: Joi.string().allow(''),
});
import Joi from 'joi';

export const grantSchema = Joi.object({
    schemeName: Joi.string().required(),
    investigatorName: Joi.string().required(),
    fundingAgency: Joi.string().required(),
    type: Joi.string().required(),
    department: Joi.string().required(),
    yearOfAward: Joi.string().required(),
    fundsProvided: Joi.string().required(),
    duration: Joi.string().required(),
    documentLink: Joi.string().allow(''),
    status: Joi.string().allow(''),
});
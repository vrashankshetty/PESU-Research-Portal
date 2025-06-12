import Joi from 'joi';

export const awardSchema = Joi.object({
    yearOfAward: Joi.string().required(),
    titleOfInnovation: Joi.string().required(),
    awardeeName: Joi.string().required(),
    awardingAgency: Joi.string().required(),
    category: Joi.string().required(),
    documentLink: Joi.string().allow(''),
    status: Joi.string().allow(''),
});
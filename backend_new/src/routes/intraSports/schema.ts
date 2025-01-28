import Joi from 'joi';

export const intraSportsSchema = Joi.object({
    event: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    link: Joi.string().required(),
    yearOfEvent: Joi.string().required(),
});

import Joi from 'joi';

export const interSportsSchema = Joi.object({
    nameOfStudent: Joi.string().required(),
    nameOfEvent: Joi.string().required(),
    link: Joi.string().required(),
    nameOfUniv: Joi.string().required(),
    yearOfEvent: Joi.string().required(),
    teamOrIndi: Joi.string().required(),
    level: Joi.string().required(),
    nameOfAward: Joi.string().required(),
});

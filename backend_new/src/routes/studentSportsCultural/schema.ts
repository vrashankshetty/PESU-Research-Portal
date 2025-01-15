import Joi from 'joi';



export const studentSportsCulturalSchema = Joi.object({
  year: Joi.string().required(),
  eventDate: Joi.date().required(),
  eventName: Joi.string().required()
});
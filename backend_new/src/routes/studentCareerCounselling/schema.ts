import Joi from 'joi';


export const studentCareerCounsellingSchema = Joi.object({
  year: Joi.string().required(),
  activityName: Joi.string().required(),
  numberOfStudents: Joi.number().integer().required(),
  documentLink: Joi.string().allow('').default("")
});

  
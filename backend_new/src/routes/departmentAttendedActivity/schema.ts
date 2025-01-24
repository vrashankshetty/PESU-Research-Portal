import Joi from 'joi';


export const departmentAttendedActivitySchema = Joi.object({
  programTitle: Joi.string().required(),
  durationStartDate: Joi.date().required(),
  durationEndDate: Joi.date().required(),
  documentLink: Joi.string().allow('').default(""),
  year: Joi.string().required()
});
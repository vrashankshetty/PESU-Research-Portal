import Joi from 'joi';


export const departmentAttendedActivitySchema = Joi.object({
  nameOfProgram: Joi.string().required(),
  noOfParticipants: Joi.number().integer().required(),
  durationStartDate: Joi.date().required(),
  durationEndDate: Joi.date().required(),
  documentLink: Joi.string().allow('').default(""),
  year: Joi.string().required()
});
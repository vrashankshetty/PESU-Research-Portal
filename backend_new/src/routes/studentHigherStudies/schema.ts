import Joi from 'joi';

export const studentHigherStudiesSchema = Joi.object({
  studentName: Joi.string().required(),
  programGraduatedFrom: Joi.string().required(),
  institutionAdmittedTo: Joi.string().required(),
  programmeAdmittedTo: Joi.string().required(),
  documentLink: Joi.string().allow(''),
  year: Joi.string().required(),
  });
  
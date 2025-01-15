import Joi from 'joi';


export const studentEntranceExamSchema = Joi.object({
  year: Joi.string().required(),
  registrationNumber: Joi.string().required(),
  studentName: Joi.string().required(),
  isNET: Joi.boolean().default(false),
  isSLET: Joi.boolean().default(false),
  isGATE: Joi.boolean().default(false),
  isGMAT: Joi.boolean().default(false),
  isCAT: Joi.boolean().default(false),
  isGRE: Joi.boolean().default(false),
  isJAM: Joi.boolean().default(false),
  isIELTS: Joi.boolean().default(false),
  isTOEFL: Joi.boolean().default(false)
  });
  
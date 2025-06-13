import Joi from 'joi';
import { DEPARTMENTS, CAMPUS } from '../../types/shared';

export const userSchema = Joi.object({
    empId: Joi.string().required(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    phno: Joi.string().required(),
    dept: Joi.string()
        .valid(...DEPARTMENTS)
        .required(),
    campus: Joi.string()
        .valid(...CAMPUS)
        .required(),
    panNo: Joi.string().required(),
    qualification: Joi.string().required(),
    designation: Joi.string().required(),
    expertise: Joi.string().required(),
    dateofJoining: Joi.date().required(),
    totalExpBfrJoin: Joi.string().required(),
    googleScholarId: Joi.string().required(),
    role: Joi.string().default('user'),
    accessTo: Joi.string().default('none'),
    sId: Joi.string().required(),
    oId: Joi.string().required(),
    profileImg: Joi.string().optional(),
    centre_name: Joi.string().required(),
});

export const loginSchema = Joi.object({
    empId: Joi.string().required(),
    password: Joi.string().required(),
});

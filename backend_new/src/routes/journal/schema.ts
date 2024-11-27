import Joi from 'joi';

export const journalSchema =  Joi.object({
    title: Joi.string().required(),
    teacherIds: Joi.array().items(Joi.string()).default([]),
    campus: Joi.string().required(), 
    dept: Joi.string().required(),
    journalName: Joi.string().required(),
    month: Joi.string().required(),
    year: Joi.string().required(),
    volumeNo: Joi.string().required(),
    issueNo: Joi.string().required(),
    issn: Joi.string().required(),
    websiteLink: Joi.string().uri(),
    articleLink: Joi.string().uri(),
    isUGC: Joi.boolean().default(false),
    isScopus: Joi.boolean().default(false),
    isWOS: Joi.boolean().default(false),
    qNo: Joi.string().required().default('NA'),
    impactFactor: Joi.string(),
    isCapstone: Joi.boolean().default(false),
    isAffiliating: Joi.boolean().default(false),
    pageNumber: Joi.number().integer().default(0),
    abstract: Joi.string().required(),
    keywords: Joi.array().items(Joi.string()),
    domain: Joi.string().required(),
});

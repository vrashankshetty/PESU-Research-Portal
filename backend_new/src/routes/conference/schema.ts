import Joi from 'joi';

export const conferenceSchema = Joi.object({
    teacherIds: Joi.array().items(Joi.string()).default([]),
    totalAuthors: Joi.number().default(1),
    bookTitle: Joi.string().required(),
    paperTitle: Joi.string().required(),
    proceedings_conference_title: Joi.string().required(),
    volumeNo: Joi.string().required(),
    issueNo: Joi.string().required(),
    year: Joi.string().required(),
    pageNumber: Joi.number().integer().default(0),
    status:Joi.string().allow(''),
    issn: Joi.string().required(),
    is_affiliating_institution_same: Joi.boolean().default(false),
    publisherName: Joi.string().required(),
    impactFactor: Joi.string().required(),
    core: Joi.string().required().default('NA'),
    link_of_paper: Joi.string().default('').allow(''),
    isCapstone: Joi.boolean().default(false),
    abstract: Joi.string().required(),
    keywords: Joi.array().items(Joi.string()),
    domain: Joi.string().required(),
});
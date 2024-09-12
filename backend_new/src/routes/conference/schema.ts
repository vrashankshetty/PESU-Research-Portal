import Joi from 'joi';


export const conferenceSchema = Joi.object({
    serial_no: Joi.string().required(),
    teacherIds: Joi.array().items(Joi.string()).default([]),
    campus: Joi.string().required(), 
    dept: Joi.string().valid('EC','CSE').required(),
    bookTitle: Joi.string().required(),
    paperTitle: Joi.string().required(),
    proceedings_conference_title: Joi.string().required(),
    volumeNo: Joi.string().required(),
    issueNo: Joi.string().required(),
    year: Joi.string().required(),
    pageNumber: Joi.number().integer().default(0),
    issn: Joi.string().required(),
    is_affiliating_institution_same: Joi.boolean().default(false),
    publisherName: Joi.string().required(),
    impactFactor: Joi.string().required(),
    core: Joi.string().valid('coreA','coreB','coreC','scopus','NA').required().default('NA'),
    link_of_paper: Joi.string().uri().required(),
    isCapstone: Joi.boolean().default(false),
    abstract: Joi.string().required(),
    keywords: Joi.array().items(Joi.string()),
    domain: Joi.string().required(),
  });
  
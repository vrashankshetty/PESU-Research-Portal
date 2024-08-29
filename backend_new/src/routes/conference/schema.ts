import Joi from 'joi';


export const conferenceSchema = Joi.object({
    serial_no: Joi.string().required(),
    teacherName: Joi.string().required(),
    coAuthors: Joi.array().items(Joi.string()),
    totalAuthors: Joi.number().default(0),
    facultyNames: Joi.array().items(Joi.string()),
    campus: Joi.string().required(),
    dept: Joi.string().required(),
    bookTitle: Joi.string().required(),
    paperTitle: Joi.string().required(),
    proceedings_conference_title: Joi.string().required(),
    volumeNo: Joi.string().required(),
    issueNo: Joi.string().required(),
    year: Joi.string().required(),
    issn: Joi.string().required(),
    is_affiliating_institution_same: Joi.boolean().default(false),
    publisherName: Joi.string().required(),
    impactFactor: Joi.string().required(),
    link_of_paper: Joi.string(),
    isCapstone: Joi.boolean().default(false),
    abstract: Joi.string().required(),
    keywords: Joi.array().items(Joi.string()),
    domainExpertise: Joi.string().required()
});
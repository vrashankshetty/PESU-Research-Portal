import Joi from 'joi';

export const journalSchema = Joi.object({
    serial_no:Joi.string().required(),
    title:Joi.string().required(),
    facultyNames:Joi.array().items(Joi.string()),
    campus:Joi.string(),
    dept:Joi.string(),
    journalName:Joi.string(),
    month:Joi.string(),
    year:Joi.string(),
    volumeNo:Joi.string(),
    issueNo:Joi.string(),
    issn:Joi.string(),
    websiteLink:Joi.string(),
    articleLink:Joi.string(),
    isListed:Joi.boolean(),
    abstract:Joi.string(),
    keywords:Joi.array().items(Joi.string()),
    domainExpertise:Joi.string()
});

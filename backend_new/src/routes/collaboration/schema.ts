import Joi from 'joi';

export const collaborationSchema = Joi.object({
    title: Joi.string().required(),
    collaboratingAgency: Joi.string().required(),
    participantName: Joi.string().required(),
    yearOfCollaboration: Joi.string().required(),
    duration: Joi.string().required(),
    natureOfActivity: Joi.string().required(),
    documentLink: Joi.string().allow(''),
});
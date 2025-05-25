import Joi from 'joi';

export const idParamSchema = Joi.object({
    id: Joi.number().integer().positive().required().messages({
        'number.integer': 'ID must be an integer',
        'number.positive': 'ID must be positive',
        'any.required': 'ID is required'
    })
});
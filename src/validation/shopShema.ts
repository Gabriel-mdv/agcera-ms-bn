import Joi from 'joi';

export const shopSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Name is a required field'
    }),
    location: Joi.string().required().messages({
        'any.required': 'Location is a required field'
    }),
    phone: Joi.string().required().pattern(/^\+\d{12}$/).messages({
        'string.pattern.base': 'Please provide a valid phone number that starts with + and have 12 digits',
        'string.empty': 'Phone number cannot be empty',
        'any.required': 'Phone number is a required field',
    }),
    isActive: Joi.boolean().default(true),
}).unknown();


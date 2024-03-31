import joi from 'joi';

// the schema for the phone number
export const phoneSchema = joi.object({
    phone: joi.string().pattern(/^\+\d{12}$/).required().messages({
        'string.pattern.base': 'Please provide a valid phone number that starts with + and have 12 digits',
        'string.empty': 'Phone number cannot be empty',
        'any.required': 'Phone number is a required field',

    })
}).unknown();


// the schema for registering a user
export const userRegisterSchema = joi.object({
    name: joi.string().pattern(/^[a-zA-Z]+\s+[a-zA-Z]+/).required()
        .messages({
            'string.pattern.base': 'Provide at least two names',
            'string.empty': 'Name cannot be empty',
            'any.required': 'Name is a required field',
        }),
    password: joi.string().min(4).required(),
    email: joi.string().pattern(new RegExp('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$'))
        .messages({
            'string.pattern.base': 'Please provide a valid Email',
            'string.empty': 'Email cannot be empty',
        }),
    phone: joi.string().pattern(/^\+\d{12}$/).required()
    .messages({
        'string.pattern.base': 'Please provide a valid phone number that starts with + and have 12 digits',
        'string.empty': 'Phone number cannot be empty',
        'any.required': 'Phone number is a required field',
    })
}).unknown();

// the schema for login
export const userLoginSchema = joi.object({
    phone: joi.string().required().messages({
        'any.required': 'Please Enter a valid phone number',
    }),
    password: joi.string().required().messages({
        'any.required': 'Please Enter password',
    })
}).unknown();



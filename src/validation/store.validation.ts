import Joi from 'joi';

export const storeRegisterSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Name should be a string',
    'string.empty': 'Name should not be empty',
    'any.required': 'Name is required',
  }),
  location: Joi.string().required(),
  phone: Joi.string()
    .pattern(/^\+\d{12}$/)
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number that starts with + and have 12 digits',
      'string.empty': 'Phone number cannot be empty',
      'any.required': 'Phone number is a required field',
    }),
  keepers: Joi.array().items(Joi.string()).unique().min(1).required(),
  isActive: Joi.bool(),
});

export const storeUpdateSchema = Joi.object({
  name: Joi.string().messages({
    'string.base': 'Name should be a string',
    'string.empty': 'Name should not be empty',
    'any.required': 'Name is required',
  }),
  location: Joi.string(),
  phone: Joi.string()
    .pattern(/^\+\d{12}$/)
    .messages({
      'string.pattern.base': 'Please provide a valid phone number that starts with + and have 12 digits',
      'string.empty': 'Phone number cannot be empty',
      'any.required': 'Phone number is a required field',
    }),
  keepers: Joi.array().items(Joi.string()).unique().min(1),
  isActive: Joi.bool(),
});

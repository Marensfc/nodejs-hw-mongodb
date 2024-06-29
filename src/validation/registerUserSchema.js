import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least 3 characters',
    'string.max': 'Name should have at most 20 characters',
    'string.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email should be a string',
    'string.email': 'Email should be valid',
  }),
  password: Joi.string().min(6).max(20).required().messages({
    'string.base': 'Password should be a string',
    'string.min': 'Password should have at least 6 characters',
    'string.max': 'Password should have at most 20 characters',
    'string.required': 'Password is required',
  }),
});

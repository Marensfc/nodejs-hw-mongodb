import Joi from 'joi';

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).max(20).required().messages({
    'string.base': 'Password should be a string',
    'string.min': 'Password should have at least 6 characters',
    'string.max': 'Password should have at most 20 characters',
    'string.required': 'Password is required',
  }),
});

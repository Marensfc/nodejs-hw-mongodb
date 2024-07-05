import Joi from 'joi';

export const requestResetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email should be a string',
    'string.email': 'Email should be valid',
  }),
});

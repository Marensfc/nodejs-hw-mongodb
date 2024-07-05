import Joi from 'joi';

export const patchContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least 3 characters',
    'string.max': 'Name should have at most 20 characters',
  }),
  phoneNumber: Joi.number()
    .positive()
    .greater(+379999999999)
    .less(+381000000000)
    .messages({
      'number.positive': 'Number must be a positive',
    }),
  email: Joi.string().email().messages({
    'string.base': 'Email should be a string',
    'string.email': 'Email should be valid',
  }),
  isFavourite: Joi.boolean().messages({
    'isFavourite.base': 'isFavourite must be a boolean',
  }),
  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'string.base': 'contactType should be a string',
  }),
  photo: Joi.string(),
});

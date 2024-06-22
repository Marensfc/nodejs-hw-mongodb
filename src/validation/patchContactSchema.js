import Joi from 'joi';

export const patchContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.number()
    .positive()
    .greater(+379999999999)
    .less(+381000000000),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});

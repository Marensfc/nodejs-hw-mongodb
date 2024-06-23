import createHttpError from 'http-errors';
import { ObjectId } from 'mongodb';

export const validateMongoId = () => async (req, res, next) => {
  const { contactId } = req.params;

  if (ObjectId.isValid(contactId)) {
    next();
  } else {
    next(createHttpError(400, 'Id must be valid'));
  }
};

import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({
    email: payload.email,
  });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  return await UsersCollection.create(payload);
};

import mongoose from 'mongoose';
import { env } from '../utils/env.js';
import { MONGODB_CONSTANTS } from '../constants/mongoDB-constants.js';

export const initMongoConnection = async () => {
  const user = env(MONGODB_CONSTANTS.MONGODB_USER);
  const password = env(MONGODB_CONSTANTS.MONGODB_PASSWORD);
  const url = env(MONGODB_CONSTANTS.MONGODB_URL);
  const db = env(MONGODB_CONSTANTS.MONGODB_DB);

  try {
    await mongoose.connect(
      `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority`,
    );
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.log('Error while setting up mongo connection', error);
    throw error;
  }
};

import express from 'express';
import { env } from './utils/env.js';

const PORT = env('PORT');

export const setupServer = () => {
  const app = express();

  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

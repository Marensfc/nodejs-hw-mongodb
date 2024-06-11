import dotenv from 'dotenv';

dotenv.config();

export const env = (envVariable, defaultValue) => {
  const variable = process.env[envVariable];

  if (variable) return variable;
  if (defaultValue) return defaultValue;

  throw new Error(`Missing: process.env['${envVariable}']`);
};

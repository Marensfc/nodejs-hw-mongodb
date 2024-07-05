import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { SessionsCollection } from '../db/models/sessions.js';
import { UsersCollection } from '../db/models/users.js';
import { TIME } from '../constants/time.js';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendEmail.js';
import { SMTP } from '../constants/smtp.js';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
    accessTokenValidUntil: new Date(Date.now() + TIME.FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + TIME.THIRTY_DAYS),
  };
};

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({
    email: payload.email,
  });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({
    email: payload.email,
  });

  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  const isPasswordEqual = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({
    userId: user._id,
  });

  const newSession = createSession();

  return await SessionsCollection.create({
    ...newSession,
    userId: user._id,
  });
};

export const refreshUser = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(404, 'Session not found');
  }

  const isTokenExpired = Date.now() > session.refreshTokenValidUntil;

  if (isTokenExpired) {
    throw createHttpError(401, 'Token is expired');
  }

  await SessionsCollection.deleteOne({
    _id: sessionId,
    refreshToken,
  });

  const newSession = createSession();

  return await SessionsCollection.create({
    ...newSession,
    userId: session.userId,
  });
};

export const logoutUser = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(404, 'Session not found!');
  }

  await SessionsCollection.deleteOne({
    _id: sessionId,
    refreshToken,
  });
};

export const sendRequestResetPassword = async (email) => {
  const user = await UsersCollection.findOne({
    email,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const token = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  try {
    await sendEmail({
      from: env(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset password',
      html: `<p>Click <a href=${env(
        'APP_DOMAIN',
      )}/reset-password?token=${token}>here</a> to reset your password</p>`,
    });
  } catch (error) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (token, password) => {
  let entries;

  try {
    entries = jwt.verify(token, env('JWT_SECRET'));
  } catch (error) {
    if (error instanceof Error) {
      throw createHttpError(401, error.message);
    }
    throw error;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  await UsersCollection.findOneAndUpdate(
    { _id: entries.sub },
    { password: encryptedPassword },
  );

  await SessionsCollection.deleteOne({
    userId: user._id,
  });
};

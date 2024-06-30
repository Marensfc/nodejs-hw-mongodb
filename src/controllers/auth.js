import { TIME } from '../constants/time.js';
import { registerUser, loginUser, refreshUser } from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: new Date(Date.now() + TIME.THIRTY_DAYS),
  });
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: new Date(Date.now() + TIME.THIRTY_DAYS),
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: session.accessToken,
  });
};

export const refreshUserController = async (req, res) => {
  const session = await refreshUser(req.cookies);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: new Date(Date.now() + TIME.THIRTY_DAYS),
  });
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: new Date(Date.now() + TIME.THIRTY_DAYS),
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: session.accessToken,
  });
};

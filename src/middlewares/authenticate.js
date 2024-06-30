import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/sessions.js';
import { UsersCollection } from '../db/models/users.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    next(createHttpError(401, 'Please, provide Authorization header'));
    return;
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' && !token) {
    next(createHttpError(401, 'Token should be of bearer type'));
    return;
  }

  const session = await SessionsCollection.findOne({
    accessToken: token,
  });

  if (!session) {
    next(createHttpError(404, 'Session not found!'));
    return;
  }

  const isTokenExpired = Date.now() > session.accessTokenValidUntil;

  if (isTokenExpired) {
    next(createHttpError(401, 'Token is expired'));
    return;
  }

  const user = await UsersCollection.findById(session.userId);

  req.user = user;

  next();
};

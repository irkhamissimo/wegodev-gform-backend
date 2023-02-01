import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const env = dotenv.config().parsed;

const jwtAuth = () => {
  return async (req, res, next) => {
    try {
      if (!req.headers.authorization)
        throw { code: 401, message: 'UNAUTHORIZED' };

      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.decode(token, env.ACCESS_TOKEN_KEY);
      req.jwt = decoded;

      next();
    } catch (error) {
      const jwtError = [
        'invalid signature',
        'jwt malformed',
        'jwt must be provided',
        'invalid token',
      ];
      if (error.message === 'jwt expired') {
        error.code = 401;
        error.message = 'ACCESS_TOKEN_EXPIRED';
      } else if (jwtError.includes(error.message)) {
        error.message = 'INVALID_ACCESS_TOKEN';
      }

      return res
        .status(error.code || 500)
        .json({ status: false, message: error.message });
    }
  };
};

export default jwtAuth;

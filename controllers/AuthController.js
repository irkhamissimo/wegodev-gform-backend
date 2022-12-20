import User from '../models/User.js';
import emailExist from '../libraries/emailExist.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import jwtAuth from '../middlewares/jwtAuth.js';

const env = dotenv.config().parsed;

const generateAccessToken = async (payload) => {
  return jwt.sign({ payload }, env.ACCESS_TOKEN_KEY, {
    expiresIn: env.EXPIRES_TOKEN,
  });
};

const generateRefreshToken = async (payload) => {
  return jwt.sign({ payload }, env.REFRESH_TOKEN_KEY, {
    expiresIn: env.EXPIRES_REFRESH_TOKEN,
  });
};

class AuthController {
  async register(req, res) {
    try {
      if (!req.body.fullname)
        throw { code: 400, message: 'FULLNAME IS REQUIRED!' };
      if (!req.body.email) throw { code: 400, message: 'EMAIL IS REQUIRED!' };

      let isEmailExist = await emailExist(req.body.email);
      if (isEmailExist)
        throw { code: 409, message: 'Email is already registered' };
      if (req.body.password.length < 6)
        throw {
          code: 400,
          message: 'password length must minimum 6 characters',
        };
      if (!req.body.password)
        throw { code: 409, message: 'PASSWORD IS REQUIRED!' };
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);

      const user = await User.create({
        fullname: req.body.fullname,
        email: req.body.email,
        password: hash,
      });
      if (!user) throw { code: 500, message: 'USER_REGISTER_FAILED' };
      return res
        .status(200)
        .json({ status: true, message: 'user is created succesfully', user });
    } catch (error) {
      return res
        .status(error.code || 500)
        .json({ status: false, message: error.message });
    }
  }

  async login(req, res) {
    try {
      if (!req.body.email) throw { code: 400, message: 'Email is required' };
      if (!req.body.password) throw { code: 400, message: 'Email is required' };

      let user = await User.findOne({ email: req.body.email });
      if (!user) throw { code: 500, message: 'email not found' };

      const isValidPassword = await bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!isValidPassword) throw { code: 403, message: 'invalid password' };
      let payload = {id: user._id}
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      return res.status(200).json({
        status: true,
        message: 'success',
        user: user.fullname,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return res
        .status(error.code || 500)
        .json({ status: false, message: error.message });
    }
  }

  async refreshToken(req, res) {
    try {
      if (!req.body.refreshToken)
        throw { code: 400, message: 'Refresh token is required' };

      const verify = await jwt.verify(
        req.body.refreshToken,
        env.REFRESH_TOKEN_KEY
      );

      let payload = { id: verify.id };
      const accessToken = await generateAccessToken({ payload });
      const refreshToken = await generateRefreshToken({ payload });

      return res.status(200).json({
        status: true,
        message: 'success',
        accessToken,
        refreshToken,
      });
    } catch (error) {
      const jwtError = [
        'invalid signature',
        'jwt malformed',
        'jwt must be provided',
        'invalid token',
      ];
      if (error.message === 'jwt expired') {
        error.message = 'refresh token expired';
      } else if (jwtError.includes(error.message)) {
        error.message = 'invalid refresh token';
      }

      return res
        .status(error.code || 500)
        .json({ status: false, message: error.message });
    }
  }
}

export default new AuthController();

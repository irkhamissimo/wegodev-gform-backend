import User from '../models/User.js';
import emailExist from '../libraries/emailExist.js';
import bcrypt from 'bcrypt';

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

      const user = await User.create({ fullname: req.body.fullname, email: req.body.email, password: hash });
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
}

export default new AuthController();

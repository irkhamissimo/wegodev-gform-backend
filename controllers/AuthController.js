import User from '../models/User.js';

class AuthController {
  async register(req, res) {
    try {
      if (!req.body.fullname) throw {code: 400, message: 'FULLNAME IS REQUIRED!'}
      if (!req.body.email) throw {code: 400, message: 'EMAIL IS REQUIRED!'}
      if (!req.body.password) throw {code: 400, message: 'PASSWORD IS REQUIRED!'}
      
      const user = await User.create(req.body);
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

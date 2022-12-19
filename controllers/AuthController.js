import User from '../models/User.js';

class AuthController {
  async register(req, res) {
    try {
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

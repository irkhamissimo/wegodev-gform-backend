import mongoose from 'mongoose';
import Form from '../models/Form.js';
import User from '../models/User.js';

class InviteController {
  async store(req, res) {
    try {
      if (!req.params.id) throw { code: 400, message: 'FORM_ID_REQUIRED' };
      if (!req.body.email) throw { code: 400, message: 'EMAIL_REQUIRED' };
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        throw { code: 400, message: 'FORM_ID_INVALID' };

      if (/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(req.body.email) === false)
        throw { code: 400, message: 'INVALID_EMAIL' };
      
      let alreadyInvited = await Form.findOne({
        _id: req.params.id,
        userId: req.jwt.payload.id,
        invites: { '$in': req.body.email },
      });
      if (alreadyInvited) throw { code: 400, message: 'EMAIL_ALREADY_INVITED' };

      // owner can't invite himself
      const user = await User.findOne({
        _id: req.jwt.payload.id,
        email: req.body.email,
      });
      if (user) throw { code: 400, message: 'CANNOT_INVITE_SELF' };

      let invite = await Form.findOneAndUpdate(
        { _id: req.params.id, user: req.jwt.payload.id },
        { $push: { invites: req.body.email } },
        { new: true }
      );
      if (!invite) throw { code: 404, message: 'INVITE_EMAIL_FAILED' };
      return res.status(200).json({
        status: true,
        message: 'INVITE_SUCCESS',
        email: req.body.email,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async destroy(req, res) {
    try {
      if (!req.params.id) throw { code: 400, message: 'FORM_ID_REQUIRED' };
      if (!req.body.email) throw { code: 400, message: 'EMAIL_REQUIRED' };
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        throw { code: 400, message: 'FORM_ID_INVALID' };

      let isEmailExist = await Form.findOne({
        _id: req.params.id,
        userId: req.jwt.payload.id,
        invites: { '$in': req.body.email },
      });
      if (!isEmailExist) throw { code: 400, message: 'EMAIL_NOT_EXIST' };

      let invite = await Form.findOneAndUpdate(
        { _id: req.params.id, user: req.jwt.payload.id },
        { $pull: { invites: req.body.email } },
        { new: true }
      );

      if (!invite) throw { code: 404, message: 'REMOVE_EMAIL_FAILED' };
      return res.status(200).json({
        status: true,
        message: 'REMOVE_EMAIL_SUCCESS',
        email: req.body.email,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new InviteController();

import mongoose from 'mongoose';
import Form from '../models/Form.js';

class FormController {
  async store(req, res) {
    try {
      const form = await Form.create({
        userId: req.jwt.payload.id,
        title: 'Untitled Form',
        description: null,
        public: true,
      });

      if (!form) {
        throw { code: 500, message: 'FAILED_CREATE_FORM' };
      }
      return res
        .status(200)
        .json({ status: true, message: 'SUCCESS_CREATE_FORM', form });
    } catch (error) {
      console.log(error);
      return res
        .status(error.code || 500)
        .json({ status: false, message: error.message });
    }
  }

  async show(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: 'FORM_ID_REQUIRED' };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: 'Invalid ID' };
      }

      const form = await Form.findOne({
        _id: req.params.id,
        userId: req.jwt.payload.id,
      });

      if (!form) {
        throw { code: 404, message: 'Form not found' };
      }
      return res
        .status(200)
        .json({ status: true, message: 'SUCCESS_LOAD_FORM', form });
    } catch (error) {
      console.log(error);
      return res
        .status(error.code || 500)
        .json({ status: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: 'FORM_ID_REQUIRED' };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: 'Invalid ID' };
      }
      const form = await Form.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.jwt.payload.id,
        },
        req.body,
        { new: true }
      );

      if (!form) {
        throw { code: 500, message: 'FAILED_UPDATE_FORM' };
      }
      return res
        .status(200)
        .json({ status: true, message: 'SUCCESS_UPDATE_FORM', form });
    } catch (error) {
      return res
        .status(error.code || 500)
        .json({ status: false, message: error.message });
    }
  }
}

export default new FormController();

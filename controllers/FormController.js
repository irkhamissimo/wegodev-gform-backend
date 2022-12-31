import mongoose from 'mongoose';
import Form from '../models/Form.js';

class FormController { 
  async store(req, res) {
    try {
      console.log(req.jwt)
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
      console.log(error)
      return res
        .status(error.code || 500)
        .json({ status: false, message: error.message });
    }
  }
}

export default new FormController();
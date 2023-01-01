import mongoose from 'mongoose';
import Form from '../models/Form.js';

class QuestionController {
  async store(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: 'FORM_ID_REQUIRED' };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: 'Invalid ID' };
      }

      const newQuestion = {
        id: mongoose.Types.ObjectId(),
        question: null,
        type: 'Text',
        required: false,
        options: [],
      };

      const form = await Form.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { questions: newQuestion } },
        { new: true }
      );

      if (!form) {
        throw { code: 400, message: 'FORM_UPDATE_FAILED' };
      }

      return res.status(200).json({
        status: true,
        message: 'QUESTION_ADDED_SUCCESFULLY',
        question: newQuestion,
      });
    } catch (error) {
      return res
        .status(error.code || 500)
        .json({ status: false, message: error.message });
    }
  }
}

export default new QuestionController();

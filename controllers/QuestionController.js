import mongoose from 'mongoose';
import Form from '../models/Form.js';

const allowedType = ['Radio', 'Text', 'Checkbox', 'Dropdown', 'Email'];
class QuestionController {
  async index(req, res) {
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
      if (!form) throw { code: 404, message: 'FORM_NOT_FOUND' };

      return res.status(200).json({
        status: true,
        message: 'QUESTIONS_FOUND',
        questions: form.questions,
      });
    } catch (error) {
      return res
        .status(error.code || 500)
        .json({ status: false, message: error.message });
    }
  }
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
        throw { code: 400, message: 'QUESTION_UPDATE_FAILED' };
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

  async update(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: 'FORM_ID_REQUIRED' };
      }
      if (!req.params.questionId) {
        throw { code: 400, message: 'QUESTION_ID_REQUIRED' };
      }

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: 'Invalid ID' };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        throw { code: 400, message: 'Invalid ID' };
      }

      let field = {};
      if (req.body.hasOwnProperty('question')) {
        field['questions.$[indexQuestion].question'] = req.body.question;
      } else if (req.body.hasOwnProperty('required')) {
        field['questions.$[indexQuestion].required'] = req.body.required;
      } else if (req.body.hasOwnProperty('type')) {
        if (!allowedType.includes(req.body.type))
          throw { code: 400, message: 'INVALID_QUESTION_TYPE' };
        field['questions.$[indexQuestion].type'] = req.body.type;
      }

      const question = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.payload.id },
        { $set: field },
        {
          arrayFilters: [
            {
              'indexQuestion.id': mongoose.Types.ObjectId(
                req.params.questionId
              ),
            },
          ],
          new: true,
        }
      );

      if (!question) {
        throw { code: 400, message: 'QUESTION_UPDATE_FAILED' };
      }
      return res.status(200).json({
        status: true,
        message: 'SUCCESS_UPDATE_QUESTION',
        questions: question.questions,
      });
    } catch (error) {
      return res
        .status(error.code || 500)
        .json({ status: false, message: error.message });
    }
  }

  async destroy(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: 'FORM_ID_REQUIRED' };
      }
      if (!req.params.questionId) {
        throw { code: 400, message: 'QUESTION_ID_REQUIRED' };
      }

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: 'Invalid ID' };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        throw { code: 400, message: 'Invalid ID' };
      }

      const form = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.payload.id },
        {
          $pull: {
            questions: { id: mongoose.Types.ObjectId(req.params.questionId) },
          },
        },
        { new: true }
      );
      if (!form) {
        throw { code: 400, message: 'QUESTION_DELETE_FAILED' };
      }

      return res.status(200).json({
        status: true,
        message: 'QUESTION_DELETED_SUCCESFULLY',
        form,
      });
    } catch (error) {
      return res
        .status(error.code || 500)
        .json({ status: false, message: error.message });
    }
  }
}

export default new QuestionController();

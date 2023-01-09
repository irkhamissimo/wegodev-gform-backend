import mongoose from 'mongoose';
import Form from '../models/Form.js';
import Answer from '../models/Answer.js';
import questionRequiredButEmpty from '../libraries/questionRequiredButEmpty.js';

class AnswerController {
  async store(req, res) {
    try {
      if (!req.params.formId) throw { code: 400, message: 'FORM_ID_REQUIRED' };
      if (!mongoose.Types.ObjectId.isValid(req.params.formId))
        throw { code: 400, message: 'FORM_ID_INVALID' };

      let fields = {};
      req.body.answers.forEach((answer) => {
        fields[answer.questionId] = answer.value;
      });

      const answers = await Answer.create({
        formId: req.params.formId,
        userId: req.jwt.payload.id,
        ...fields,
      });
      if (!answers) throw { code: 400, message: 'ANSWER_FAILED' };

      return res
        .status(200)
        .json({ status: true, message: 'SUCCESS_SUCCESS', answers });
    } catch (error) {
      return res
        .status(error.code || 500)
        .json({ status: false, message: error.message });
    }
  }
}

export default new AnswerController();

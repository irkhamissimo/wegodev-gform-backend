import mongoose from 'mongoose';
import Form from '../models/Form.js';
import Answer from '../models/Answer.js';

class ResponseControoler {
  async list(req, res) {
    try {
      if (!req.params.formId) throw { code: 400, message: 'FORM_ID_REQUIRED' };
      if (!mongoose.Types.ObjectId(req.params.formId))
        throw { code: 400, message: 'FORM_ID_INVALID' };

      let form = await Form.findOne({
        _id: req.params.formId,
        userId: req.jwt.payload.id,
      }).populate('answers');

      if (!form) throw { code: 400, message: 'FORM_NOT_FOUND' };

      return res.status(200).json({
        status: true,
        message: 'LIST_FOUND',
        form,
        total: form.answers.length,
        answers: form.answers,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(error.code || 500)
        .json({ status: false, message: error.message });
    }
  }

  async summary(req, res) {
    try {
      if (!req.params.formId) throw { code: 400, message: 'FORM_ID_REQUIRED' };
      if (!mongoose.Types.ObjectId(req.params.formId))
        throw { code: 400, message: 'FORM_ID_INVALID' };

      let form = await Form.findOne({
        _id: req.params.formId,
        userId: req.jwt.payload.id,
      }).populate('answers');

      if (!form) throw { code: 400, message: 'FORM_NOT_FOUND' };

      let summaries = form.questions.map((question) => {
        const summary = {
          type: question.type,
          questionId: question.id,
          question: question.question,
          answers: form.answers.map((answer) => answer[question.id]),
        };
        return summary;
      });

      return res.status(200).json({
        status: true,
        message: 'LIST_FOUND',
        summaries,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(error.code || 500)
        .json({ status: false, message: error.message });
    }
  }
}

export default new ResponseControoler();

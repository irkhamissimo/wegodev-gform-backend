import mongoose from 'mongoose';
import Form from '../models/Form.js';
import Answer from '../models/Answer.js';

class AnswerController {
  async store(req, res) {
    try {
      if (!req.params.formId) throw { code: 400, message: 'FORM_ID_REQUIRED' };
      if (!mongoose.Types.ObjectId.isValid(req.params.formId))
        throw { code: 400, message: 'FORM_ID_INVALID' };

      let forms = await Form.findOne({
        _id: req.params.formId,
        userId: req.jwt.payload.id,
      });

      // ! Berbeda dengan tutorial, saya tidak mau inputannya harus memasukkan questionId ke JSON
      // ! jadi ketika user memasukkan params formId, questionId langsung diperoleh melalui query di bawah
      const answers = forms.questions.map((question, index) => {
        return {
          id: question.id,
          answer: req.body.answers[index],
        };
      });

      // ! Mengubah array 'answers' di atas menjadi object sesuai dengan output yang ada di tutorial
      const fields = answers.reduce((acc, item) => {
        acc[item.id] = item.answer;
        return acc;
      }, {});

      // * check duplicate answer
      const answeredBefore = await Answer.find({
        formId: req.params.formId,
        userId: req.jwt.payload.id
      });
      const hasAnsweredBefore = answeredBefore.some((answers) => {
        return true;
      });

      if (hasAnsweredBefore) {
        throw { code: 400, message: 'DUPLICATE_ANSWER' };
      }

      const answer = await Answer.create({
        formId: req.params.formId,
        userId: req.jwt.payload.id,
        ...fields,
      });

      return res
        .status(200)
        .json({ status: true, message: 'SUCCESS_', answer });
    } catch (error) {
      return res
        .status(error.code || 500)
        .json({ status: false, message: error.message });
    }
  }
}

export default new AnswerController();

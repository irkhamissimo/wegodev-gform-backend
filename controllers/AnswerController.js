import mongoose from 'mongoose';
import Form from '../models/Form.js';
import Answer from '../models/Answer.js';
import duplicateAnswer from '../libraries/duplicateAnswer.js';
import questionRequiredButEmpty from '../libraries/questionRequiredButEmpty.js';
import optionValueNotExist from '../libraries/optionValueNotExist.js';
import questionIdNotValid from '../libraries/questionIdNotValid.js';

class AnswerController {
  async store(req, res) {
    try {
      if (!req.params.formId) throw { code: 400, message: 'FORM_ID_REQUIRED' };
      if (!mongoose.Types.ObjectId.isValid(req.params.formId))
        throw { code: 400, message: 'FORM_ID_INVALID' };
     
      const form = await Form.findById(req.params.formId);

      const isDuplicate = await duplicateAnswer(req.body.answers);
      if (isDuplicate) throw { code: 400, message: 'DUPLICATE_ANSWER' };

      const isEmpty = await questionRequiredButEmpty(form, req.body.answers);
      if (isEmpty) throw { code: 400, message: 'ANSWER_REQUIRED' };

      const notExist = await optionValueNotExist(form, req.body.answers);
      if (notExist.length > 0) throw { code: 400, message: 'OPTION_VALUE_NOT_EXIST', question: notExist[0].question};
      
      const idNotValid = await questionIdNotValid(form, req.body.answers);
      if (idNotValid.length > 0) throw { code: 400, message: 'OPTION_VALUE_NOT_EXIST', question: idNotValid[0].questionId};

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
      console.log(error);
      return res
        .status(error.code || 500)
        .json({
          status: false,
          message: error.message,
          question: error.question || null,
        });
    }
  }
}

export default new AnswerController();

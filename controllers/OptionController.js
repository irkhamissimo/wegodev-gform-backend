import mongoose from 'mongoose';
import Form from '../models/Form.js';

class OptionController {
  async store(req, res) {
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

      const option = {
        id: mongoose.Types.ObjectId(),
        option: req.body.option,
      };
      const form = await Form.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.jwt.payload.id,
        },
        {
          $push: { 'questions.$[indexQuestion].options': option },
        },
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

      if (!form) throw { code: 400, message: 'ADD_OPTION_FAILED' };

      return res.status(200).json({
        status: true,
        message: 'OPTION_UPDATED_SUCCESFULLY',
        option,
      });
    } catch (error) {
      return res
        .status(error.code || 500)
        .json({ status: false, message: error.message });
    }
  }
}

export default new OptionController();

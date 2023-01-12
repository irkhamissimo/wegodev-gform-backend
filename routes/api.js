import express from 'express';
import AuthController from '../controllers/AuthController.js';
import FormController from '../controllers/FormController.js';
import QuestionController from '../controllers/QuestionController.js';
import OptionController from '../controllers/OptionController.js';
import AnswerController from '../controllers/AnswerController.js';
import InviteController from '../controllers/InviteController.js';
import ResponseController from '../controllers/ResponseController.js';

import jwtAuth from '../middlewares/jwtAuth.js';

const router = express.Router();

//Auth
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/login/refresh-token', jwtAuth(), AuthController.refreshToken);

//Form
router.post('/forms', jwtAuth(), FormController.store);
router.get('/forms/:id', jwtAuth(), FormController.show);
router.put('/forms/:id', jwtAuth(), FormController.update);
router.delete('/forms/:id', jwtAuth(), FormController.destroy);
router.get('/forms', jwtAuth(), FormController.index);
router.get('/forms/:id/users', jwtAuth(), FormController.showToUser);

//Questions
router.post('/forms/:id/question', jwtAuth(), QuestionController.store);
router.put(
  '/forms/:id/question/:questionId',
  jwtAuth(),
  QuestionController.update
);
router.delete(
  '/forms/:id/question/:questionId',
  jwtAuth(),
  QuestionController.destroy
);
router.get('/forms/:id/question', jwtAuth(), QuestionController.index);

// options
router.post(
  '/forms/:id/question/:questionId/options',
  jwtAuth(),
  OptionController.store
);
router.put(
  '/forms/:id/question/:questionId/options/:optionId',
  jwtAuth(),
  OptionController.update
);
router.delete(
  '/forms/:id/question/:questionId/options/:optionId',
  jwtAuth(),
  OptionController.destroy
);

// answers
router.post('/answers/:formId', jwtAuth(), AnswerController.store);

// Invites
router.post('/forms/:id/invites', jwtAuth(), InviteController.store);
router.delete('/forms/:id/invites', jwtAuth(), InviteController.destroy);
router.get('/forms/:id/invites', jwtAuth(), InviteController.index);

// responses
router.get('/responses/:formId/list', jwtAuth(), ResponseController.list);


export default router;

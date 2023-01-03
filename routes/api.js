import express from 'express';
import AuthController from '../controllers/AuthController.js';
import FormController from '../controllers/FormController.js';
import QuestionController from '../controllers/QuestionController.js';

import jwtAuth from '../middlewares/jwtAuth.js';


const router = express.Router();

//Auth
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/login/refresh-token', jwtAuth(), AuthController.refreshToken);

//Form
router.post ('/forms', jwtAuth(), FormController.store);
router.get('/forms/:id', jwtAuth(), FormController.show);
router.put('/forms/:id', jwtAuth(), FormController.update);
router.delete('/forms/:id', jwtAuth(), FormController.destroy);
router.get ('/forms', jwtAuth(), FormController.index);

//Questions
router.post ('/forms/:id/question', jwtAuth(), QuestionController.store);
// router.get('/forms/:id', jwtAuth(), FormController.show);
router.put('/forms/:id/question/:questionId', jwtAuth(), QuestionController.update);
// router.delete('/forms/:id', jwtAuth(), FormController.destroy);
// router.get ('/forms', jwtAuth(), FormController.index);



export default router;
import { Router } from 'express';
import { AnswerController } from './controllers/AnswerController';
import { SendMailController } from './controllers/SendMailController';
import { SurveyController } from './controllers/SurveyController';
import { UserController } from './controllers/UserController';
94506015;
const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();

router.post('/users', userController.create);
router.get('/users', userController.getAll);
router.delete('/users', userController.deleteAllUsers);

router.post('/surveys', surveyController.create);
router.get('/surveys', surveyController.getAll);
router.delete('/surveys', surveyController.deleteAllSurveys);

router.post('/sendMail', sendMailController.execute);
router.get('/sendMail', sendMailController.getAll);
router.delete('/sendMail', sendMailController.deleteAllUsersSurveys);

router.get('/answers/:value', answerController.execute);

export { router };

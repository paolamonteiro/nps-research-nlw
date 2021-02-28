import { Router } from 'express';
import { SurveyController } from './controllers/SurveyController';
import { UserController } from './controllers/UserController';

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();

router.post('/users', userController.create);
router.get('/users', userController.getAll);
router.delete('/users', userController.deleteAllUsers);

router.post('/surveys', surveyController.create);
router.get('/surveys', surveyController.getAll);
router.delete('/surveys', surveyController.deleteAllSurveys);

export { router };

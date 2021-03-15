import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { ServiceController } from './controllers/ServiceController';
import { SendMailController } from './controllers/SendMailController';
import { AnswerController } from './controllers/AnswerController';
import { NpsController } from './controllers/NpsController';

const router = Router();

const userController = new UserController();
const serviceController = new ServiceController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();

router.post('/users', userController.create);

router.post('/service', serviceController.create);
router.get('/service', serviceController.show);

router.post('/sendMail', sendMailController.execute);

router.get('/answers/:value', answerController.execute);

router.get('/nps/:service_id', npsController.execute);

export { router };

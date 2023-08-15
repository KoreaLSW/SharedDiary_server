import express from 'express';
//import 'express-async-errors';

import * as authController from '../controller/auth';
import { isAuth } from '../middleware/auth';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/update', isAuth, authController.update);
router.get('/me', isAuth, authController.me);
router.delete('/:id', isAuth, authController.remove);

//router.post('/login',  authController.login);

export default router;

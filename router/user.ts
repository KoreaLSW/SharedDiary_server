import express from 'express';
//import 'express-async-errors';

import * as userController from '../controller/user';
import { isAuth } from '../middleware/auth';
import multer from 'multer';

const router = express.Router();

// 메모리에 임시 저장
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/:id', isAuth, userController.getUser);

//router.post('/login',  authController.login);

export default router;

import express from 'express';
//import 'express-async-errors';

import * as authController from '../controller/auth';
import { isAuth } from '../middleware/auth';
import multer from 'multer';

const router = express.Router();

// 메모리에 임시 저장
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/signup', upload.array('profile-image', 1), authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post(
    '/update',
    isAuth,
    upload.array('profile-image', 1),
    authController.update
);
router.get('/me', isAuth, authController.me);
router.delete('/:id', isAuth, authController.remove);

//router.post('/login',  authController.login);

export default router;

import { CreateComments } from './../type/type';
import express from 'express';

import * as commentController from '../controller/comment';
import { isAuth } from '../middleware/auth';

const router = express.Router();

router.get('/', isAuth, commentController.getComments);
router.post('/', isAuth, commentController.createComments);
//router.put('/:diaryId', isAuth, commentController.updateDiary);
router.delete('/delete', isAuth, commentController.removeComments);

export default router;

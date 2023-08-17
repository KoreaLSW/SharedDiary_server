import { CreateComments } from './../type/type';
import express from 'express';

import * as commentLikeController from '../controller/commentLike';
import { isAuth } from '../middleware/auth';

const router = express.Router();

// 좋아요 눌렀는지 체크
router.get('/', isAuth, commentLikeController.getCommentLikeCheck);

// 좋아요 누름
router.post('/', isAuth, commentLikeController.createCommentLike);

// 좋아요 취소
router.delete('/delete', isAuth, commentLikeController.removeCommentLike);

export default router;

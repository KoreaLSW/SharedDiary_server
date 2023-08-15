import express from 'express';
import { isAuth } from '../middleware/auth';

import * as diaryLikeController from '../controller/diaryLike';

const router = express.Router();

// 좋아요 눌렀는지 체크
router.get('/', isAuth, diaryLikeController.getDiaryLikeCheck);

// 좋아요 누름
router.post('/', isAuth, diaryLikeController.createDiaryLike);

// 좋아요 취소
router.delete('/delete', isAuth, diaryLikeController.removeDiaryLike);

export default router;

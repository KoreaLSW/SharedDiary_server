import express from 'express';

import * as diaryController from '../controller/diary';
import { isAuth } from '../middleware/auth';

const router = express.Router();

// GET /diary
// GET /diary?userId=:userId
router.get('/', isAuth, diaryController.getDiary);
router.get('/all', isAuth, diaryController.getDiaryAll);
router.post('/', isAuth, diaryController.createDiary);
router.put('/:diaryId', isAuth, diaryController.updateDiary);
router.delete('/:diaryId', isAuth, diaryController.removeDiary);

export default router;

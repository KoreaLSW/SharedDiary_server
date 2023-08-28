import express from 'express';
import multer from 'multer';

import * as diaryController from '../controller/diary';
import { isAuth } from '../middleware/auth';

const router = express.Router();

// 메모리에 임시 저장
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 이미지 업로드를 처리할 Multer 설정
// const storage = multer.diskStorage({
//     destination: './public/img/',
//     filename: function (req, file, cb) {
//         cb(null, 'imgfile' + Date.now());
//     },
// });

// GET /diary
// GET /diary?userId=:userId
router.get('/', isAuth, diaryController.getDiaryUser);
router.get('/month/page', isAuth, diaryController.getMonthDiaryPage);
router.get('/month/home', isAuth, diaryController.getMonthDiary);
router.get('/all', isAuth, diaryController.getDiaryAll);
router.post(
    '/',
    isAuth,
    upload.array('images', 5),
    diaryController.createDiary
);
router.put(
    '/:diaryId',
    isAuth,
    upload.array('images', 5),
    diaryController.updateDiary
);
router.delete('/', isAuth, diaryController.removeDiary);

export default router;

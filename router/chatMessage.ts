import express from 'express';
import { isAuth } from '../middleware/auth';
import * as chatMessageController from '../controller/chatMessage';

const router = express.Router();

router.get('/', isAuth, chatMessageController.getChatMessageList); // 메시지 내역 조회
router.post('/', isAuth, chatMessageController.sendChatMessage); // 메시지 전송

export default router;

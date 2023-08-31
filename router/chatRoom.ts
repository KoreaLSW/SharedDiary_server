import express from 'express';
import multer from 'multer';
import { isAuth } from '../middleware/auth';
import * as chatRoomController from '../controller/chatRoom';

const router = express.Router();

// 메모리에 임시 저장
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', isAuth, chatRoomController.getChatRoomList); // 채팅방 리스트 조회
router.post('/', isAuth, chatRoomController.createChatRoom); // 채팅방 생성
router.delete('/', isAuth, chatRoomController.removeChatRoom); // 채팅방 삭제
router.put('/', isAuth, chatRoomController.updateChatRoom); // 채팅방 이름 수정

export default router;

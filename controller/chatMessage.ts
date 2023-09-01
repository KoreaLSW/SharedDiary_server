import { Request, Response } from 'express';
import * as userRepository from '../data/auth';
import * as chatMessageRepository from '../data/chatMessage';
import { GetMessage, SelectMessage, User, sendMessage } from '../type/type';
import { getSocketIO } from '../socket/socketModule';

export async function getChatMessageList(req: Request, res: Response) {
    const { room_id, user_id, participant_user_id }: SelectMessage = req.query
        .selectMessage as SelectMessage;
    console.log('getChatMessageList', room_id, user_id, participant_user_id);

    try {
        const user: User = await userRepository.findByUserId(user_id);
        if (!user) {
            return res.status(401).json({ message: '사용자가 없습니다.' });
        }

        await chatMessageRepository.readChatMessage(
            room_id,
            user_id,
            participant_user_id
        );

        const data: GetMessage = await chatMessageRepository.getChatMessageList(
            user_id,
            participant_user_id
        );
        //console.log('getdiary data', data);

        res.status(200).json(data);
        getSocketIO().emit('chatMessage', data);
    } catch (err) {
        console.log(err);
    }

    res.status(200);
}

export async function sendChatMessage(req: Request, res: Response) {
    const send: sendMessage = req.body;
    console.log('sendChatMessage', send);

    const data = await chatMessageRepository.sendChatMessage(send);
    res.status(201).json(data);
    getSocketIO().emit('chatMessage', 'sendChatMessage');
}

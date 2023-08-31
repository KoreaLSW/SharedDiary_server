import { Request, Response } from 'express';
import * as userRepository from '../data/auth';
import * as chatMessageRepository from '../data/chatMessage';
import { GetMessage, SelectMessage, User, sendMessage } from '../type/type';
import { getSocketIO } from '../socket/socketModule';

export async function getChatMessageList(req: Request, res: Response) {
    const selectMessage: SelectMessage = req.query as SelectMessage;
    console.log('getChatMessageList', selectMessage);

    try {
        const user: User = await userRepository.findByUserId(
            selectMessage.user_id
        );
        if (!user) {
            return res.status(401).json({ message: '사용자가 없습니다.' });
        }

        await chatMessageRepository.readChatMessage(selectMessage);

        const data: GetMessage = await chatMessageRepository.getChatMessageList(
            selectMessage
        );
        //console.log('getdiary data', data);

        res.status(200).json(data);
        getSocketIO().emit('message', data);
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
    getSocketIO().emit('message', 'sendChatMessage');
}

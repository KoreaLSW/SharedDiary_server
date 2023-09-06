import { Request, Response } from 'express';
import * as userRepository from '../data/auth';
import * as chatRoomRepository from '../data/chatRoom';
import { getSocketIO } from '../socket/socketModule';
import {
    ChatRoomUsers,
    GetChatRoomList,
    UpdateChatTitle,
    User,
} from '../type/type';
import { IGetUserAuthInfoRequest } from '../middleware/auth';

export async function getChatRoomList(
    req: IGetUserAuthInfoRequest,
    res: Response
) {
    const userId: string = req.query.userId as string;
    console.log('getChatRoomList', userId);

    try {
        const user: User = await userRepository.findByUserId(userId);
        if (!user) {
            return res.status(401).json({ message: '사용자가 없습니다.' });
        }

        let data: GetChatRoomList[] = await chatRoomRepository.getChatRoomList(
            req.userId!
        );
        data = data.map((item: GetChatRoomList) => {
            // create_date와 message_date를 Date 객체로 파싱합니다.
            const createDate = new Date(item.create_date);
            const messageDate = new Date(item.message_date);

            // 15시간을 더합니다.
            createDate.setHours(createDate.getHours() + 15);
            messageDate.setHours(messageDate.getHours() + 15);

            // 다시 문자열로 변환하여 할당합니다.
            item.create_date = createDate.toISOString();
            item.message_date = messageDate.toISOString();

            // 수정된 item을 반환합니다.
            return item;
        });
        //console.log('getdiary data', data);

        res.status(200).json(data);
        getSocketIO().emit(`${req.userId} readChatRoom`, data);
    } catch (err) {
        console.log(err);
    }

    res.status(200);
}

export async function createChatRoom(
    req: IGetUserAuthInfoRequest,
    res: Response
) {
    const users: ChatRoomUsers = req.body;
    console.log('createChatRoom', users);

    const data = await chatRoomRepository.createRoom(users);

    const data2: GetChatRoomList = await chatRoomRepository.getChatRoomList(
        users.participant_user_id
    );

    res.status(201).json(data);
    getSocketIO().emit(`${users.participant_user_id} readChatRoom`, data2);
}

export async function removeChatRoom(
    req: IGetUserAuthInfoRequest,
    res: Response
) {
    const users: ChatRoomUsers = req.query as ChatRoomUsers;
    console.log('removeChatRoom', req.query);

    if (users.user_id !== req.userId) {
        return res.sendStatus(403);
    }

    await chatRoomRepository.removeRoom(users);

    const data: GetChatRoomList = await chatRoomRepository.getChatRoomList(
        users.participant_user_id
    );

    res.sendStatus(204);
    getSocketIO().emit(`${users.participant_user_id} readChatRoom`, data);
}

export async function updateChatRoom(
    req: IGetUserAuthInfoRequest,
    res: Response
) {
    const updatechat: UpdateChatTitle = req.params as UpdateChatTitle;
    console.log('updateChatRoom', updatechat);

    const data = await chatRoomRepository.updateRoom(updatechat);
    res.status(201).json(data);
    getSocketIO().emit(`${req.userId} readChatRoom`, data);
}

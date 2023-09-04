import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { config } from '../config'; // config 파일 경로에 맞게 수정
import { GetChatRoomList } from '../type/type';
import { getChatRoomList } from '../data/chatRoom';

let socketIO: Server<any> | null = null;

const initSocket = (server: any) => {
    socketIO = new Server(server, {
        cors: {
            origin: config.cors.allowedOrigin,
        },
    });

    socketIO.on('connection', async (socket: Socket) => {
        const userId = socket.handshake.query.user;
        console.log('소켓 클라이언트 연결됨 v 1.0.3');

        socket.on('disconnect', (data) => {
            console.log('클라이언트 연결 해제됨', data);
        });

        socket.on('error', (err) => {
            console.log('소켓 애러 : ' + err);
        });
    });
};

export function getSocketIO() {
    if (!socketIO) {
        throw new Error('Socket not initialized');
    }
    return socketIO;
}

export default initSocket;

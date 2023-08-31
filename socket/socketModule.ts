import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { config } from '../config'; // config 파일 경로에 맞게 수정

let socketIO: Server<any> | null = null;

const initSocket = (server: any) => {
    socketIO = new Server(server, {
        cors: {
            origin: config.cors.allowedOrigin,
        },
    });

    socketIO.on('connection', (socket: Socket) => {
        console.log('소켓 클라이언트 연결됨');

        socket.use((packet, next) => {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }
            jwt.verify(
                token,
                config.jwt.secretKey,
                (error: jwt.VerifyErrors | null, decoded: any) => {
                    if (error) {
                        return next(new Error('Authentication error'));
                    }
                    next();
                }
            );
        });

        socket.on('message', (data) => {
            console.log('data', data);
        });

        socket.on('disconnect', () => {
            console.log('클라이언트 연결 해제됨');
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

import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoute from './router/auth';
import userRoute from './router/user';
import typeRoute from './router/type';
import diaryRoute from './router/diary';
import diaryLikeRoute from './router/diaryLike';
import commentRoute from './router/comment';
import commentLikeRoute from './router/commentLike';
import { db } from './db/mysql';
import { config } from './config';
import cookieParser from 'cookie-parser';

const app = express();

const corsOption = {
    origin: config.cors.allowedOrigin,
    optionsSuccessStatus: 200,
    credentials: true, // allow the Access-Control-Allow-Credentials
};

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(cors(corsOption));

app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/type', typeRoute);
app.use('/diary', diaryRoute);
app.use('/diary/like', diaryLikeRoute);
app.use('/diary/comment', commentRoute);
app.use('/diary/comment/like', commentLikeRoute);

// 파일경로가 없을때
app.use((req, res, next) => {
    res.sendStatus(404);
});

// 서버애러
app.use((error, res, next) => {
    console.error('serverError: ', error);
    res.sendStatus(500);
});

// DB실행
db.getConnection().then((connection) =>
    console.log(`Server is Started... ${new Date()}`)
);

app.listen(config.port.port);

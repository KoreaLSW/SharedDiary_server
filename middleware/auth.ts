import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config';
import * as userRepository from '../data/auth';
import bufferToString from '../bufferToString/bufferToString';

export interface IGetUserAuthInfoRequest extends Request {
    userId?: string;
    token?: string;
}

const AUTH_ERROR = { message: 'Authentication Error' };

export const isAuth = async (
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
) => {
    // 1. Cookie (for Browser)
    // 2. Header (for Non-Browser Client)

    let token: string = '';
    // check the header first
    const authHeader = req.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    // if no token in the header, check the cookie
    if (!token) {
        token = req.cookies['token'];
    }

    if (!token) {
        console.log('11111111111');

        return res.status(401).json(AUTH_ERROR);
    }

    jwt.verify(token, config.jwt.secretKey, async (error, decoded: any) => {
        if (error) {
            console.log('2222222222222222', error);
            return res.status(401).json(AUTH_ERROR);
        }
        let id = '';
        if (decoded.user_id.data) {
            const bufferId: any = decoded.user_id;
            id = Buffer.from(bufferId.data).toString();
        }

        const user = await userRepository.findByUserId(id);
        //const userString = bufferToString(user);
        if (!user) {
            console.log('33333333333333');
            return res.status(401).json(AUTH_ERROR);
        }

        const userString = bufferToString(user.user_id);
        console.log('isAuth User', userString);
        //console.log('isAuth token', token);
        req.userId = userString; // req.customData
        req.token = token;
        next();
    });
};

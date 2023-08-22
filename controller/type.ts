import express, { CookieOptions, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import * as typeRepository from '../data/type';
import { EmotionType, WeatherType } from '../type/type';
import { config } from '../config';
import { IGetUserAuthInfoRequest } from '../middleware/auth';
import bufferToString from '../bufferToString/bufferToString';

export async function getType(req: Request, res: Response) {
    const type: string = req.params.type as string;

    let data: WeatherType | EmotionType;
    try {
        if (type === 'weather') {
            data = await typeRepository.getWeatherType();
            res.status(200).json(bufferToString(data));
        } else if (type === 'emotion') {
            data = await typeRepository.getEmotionType();
            res.status(200).json(bufferToString(data));
        } else {
            res.status(400).json({ message: '타입을 확인해주세요' });
        }
    } catch (err) {
        console.log(err);
    }
}

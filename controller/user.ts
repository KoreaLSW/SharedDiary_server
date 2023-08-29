import { Request, Response } from 'express';
import * as userRepository from '../data/user';
import * as authRepository from '../data/auth';
import { User } from '../type/type';
import bufferToString from '../bufferToString/bufferToString';
import { imageRemove, imageUpload } from '../middleware/image';
import { config } from '../config';

export async function getUser(req: Request, res: Response) {
    const userId: string = req.params.id;

    const user: User = await authRepository.findByUserId(userId);
    if (!user) {
        return res.status(401).json({ message: '사용자가 없습니다.' });
    }

    const data: User = bufferToString(user);

    res.status(200).json(data);
}

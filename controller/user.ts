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

export async function updateUser(req: Request, res: Response) {
    const profileImg = req.files;
    const jsonUser: User = JSON.parse(req.body.user);

    console.log('profileImg', profileImg);
    console.log('jsonUser', jsonUser);

    const user: User = await authRepository.findByUserId(jsonUser.user_id);
    if (!user) {
        return res.status(401).json({ message: '사용자가 없습니다.' });
    }

    const nickname: User = await authRepository.findByNickname(
        jsonUser.user_id
    );
    if (nickname) {
        return res.status(401).json({ message: '중복된 닉네임입니다.' });
    }

    if (jsonUser.profile_img && profileImg?.length !== 0) {
        const imageReName = jsonUser.profile_img.replace(
            'https://' + config.ftp.host,
            '/www'
        );

        try {
            imageRemove(imageReName);
        } catch (err) {
            console.log('imageRemove Error: ', err);

            return res.sendStatus(403);
        }
    }

    if (profileImg?.length !== 0) {
        const profilePath = await imageUpload(
            profileImg as Express.Multer.File[],
            jsonUser.user_id,
            'profile'
        );

        if (profilePath) {
            jsonUser.profile_img = profilePath[0] ?? null;
        }
    }

    const data = await authRepository.updateUserInfo(jsonUser);
    res.status(201).json(data);
}

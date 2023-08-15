import { Request, Response } from 'express';

import * as diaryRepository from '../data/diary';
import { Diary, GetDiary, User } from '../type/type';
import * as userRepository from '../data/auth';
import { IGetUserAuthInfoRequest } from '../middleware/auth';

export async function getDiary(req: Request, res: Response) {
    const userId: string = req.query.userId as string;
    console.log('getDiary', userId);

    try {
        const user: User = await userRepository.findByUserId(userId);
        if (!user) {
            return res.status(401).json({ message: '사용자가 없습니다.' });
        }

        const data: GetDiary = await diaryRepository.getDiaryByUserId(userId);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
    }
}

export async function getDiaryAll(req: IGetUserAuthInfoRequest, res: Response) {
    const userId: string = req.params.userId as string;
    console.log('getDiaryAll', userId);

    try {
        const user: User = await userRepository.findByUserId(userId);
        if (!user) {
            return res.status(401).json({ message: '사용자가 없습니다.' });
        }

        const data: GetDiary = await diaryRepository.getAll(userId);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
    }
}

export async function createDiary(req: Request, res: Response) {
    const diary: Diary = req.body;
    const data = await diaryRepository.create(diary);
    res.status(201).json(data);
}

export async function updateDiary(req: Request, res: Response) {
    const diaryId: string = req.params.diaryId;
    const diary: GetDiary = req.body as GetDiary;

    const data = await diaryRepository.update(diaryId, diary);
    res.status(201).json(data);
}

export async function removeDiary(req: Request, res: Response) {
    const diaryId: string = req.params.diaryId;

    await diaryRepository.remove(diaryId);
    res.status(204);
}

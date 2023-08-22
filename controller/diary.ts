import { Request, Response } from 'express';

import * as diaryRepository from '../data/diary';
import { SetDiary, GetDiary, User } from '../type/type';
import * as userRepository from '../data/auth';
import { IGetUserAuthInfoRequest } from '../middleware/auth';
import { imageUpload } from '../middleware/imageUpload';

export async function getDiary(req: Request, res: Response) {
    const userId: string = req.query.userId as string;

    try {
        const user: User = await userRepository.findByUserId(userId);
        if (!user) {
            return res.status(401).json({ message: '사용자가 없습니다.' });
        }

        const data: GetDiary = await diaryRepository.getDiaryByUserId(userId);
        //console.log('getdiary data', data);

        res.status(200).json(data);
    } catch (err) {
        console.log(err);
    }
}

export async function getDiaryAll(req: IGetUserAuthInfoRequest, res: Response) {
    const userId: string = req.params.userId as string;

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
    //console.log('req.body', req.body);
    const imgFiles = req.files;

    const jsonDiary: SetDiary = JSON.parse(req.body.diary);
    console.log('imgFiles', req.files);

    const imagePathArray = await imageUpload(
        imgFiles as Express.Multer.File[],
        jsonDiary.user_id,
        'diary',
        jsonDiary.diary_date
    );

    if (imagePathArray) {
        jsonDiary.image_01 = imagePathArray[0] ?? null;
        jsonDiary.image_02 = imagePathArray[1] ?? null;
        jsonDiary.image_03 = imagePathArray[2] ?? null;
        jsonDiary.image_04 = imagePathArray[3] ?? null;
        jsonDiary.image_05 = imagePathArray[4] ?? null;
    }

    const data = await diaryRepository.create(jsonDiary);
    res.status(201).json(data);
}

export async function updateDiary(req: IGetUserAuthInfoRequest, res: Response) {
    const diaryId: string = req.params.diaryId;
    const jsonDiary: GetDiary = JSON.parse(req.body.diary);
    const imgFiles = req.files;
    let imagePathArray;

    if (jsonDiary.user_id !== req.userId) {
        return res.sendStatus(403);
    }

    if (imgFiles?.length !== 0) {
        imagePathArray = await imageUpload(
            imgFiles as Express.Multer.File[],
            jsonDiary.user_id,
            'diary',
            jsonDiary.diary_date
        );
    }

    if (imagePathArray) {
        jsonDiary.image_01 = imagePathArray[0] ?? null;
        jsonDiary.image_02 = imagePathArray[1] ?? null;
        jsonDiary.image_03 = imagePathArray[2] ?? null;
        jsonDiary.image_04 = imagePathArray[3] ?? null;
        jsonDiary.image_05 = imagePathArray[4] ?? null;
    }

    const data = await diaryRepository.update(diaryId, jsonDiary);
    res.status(201).json(data);
}

export async function removeDiary(req: IGetUserAuthInfoRequest, res: Response) {
    const diaryId: string = req.query.diaryId as string;
    const userId: string = req.query.userId as string;

    if (userId !== req.userId) {
        return res.sendStatus(403);
    }

    await diaryRepository.remove(diaryId);
    res.sendStatus(204);
}

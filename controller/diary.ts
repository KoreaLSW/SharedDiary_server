import { Request, Response } from 'express';

import * as diaryRepository from '../data/diary';
import { SetDiary, GetDiary, User } from '../type/type';
import * as userRepository from '../data/auth';
import { IGetUserAuthInfoRequest } from '../middleware/auth';
import { imageRemove, imageUpload } from '../middleware/image';
import { config } from '../config';

export async function getDiaryUser(req: Request, res: Response) {
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

export async function getDiaryUserPage(
    req: IGetUserAuthInfoRequest,
    res: Response
) {
    console.log('getDiaryUserPage');
    const userId: string = req.query.userId as string;
    const page: string = req.query.page as string;
    const offset: string = req.query.offset as string;

    let data: GetDiary;
    try {
        const user: User = await userRepository.findByUserId(userId);
        if (!user) {
            return res.status(401).json({ message: '사용자가 없습니다.' });
        }

        if (req.userId === userId) {
            data = await diaryRepository.getDiaryByMyUserIdPage(
                userId,
                page,
                offset
            );
        } else {
            data = await diaryRepository.getDiaryByUserIdPage(
                userId,
                page,
                offset
            );
        }

        //console.log('getdiary data', data);

        res.status(200).json({ data, nextPage: page });
    } catch (err) {
        console.log(err);
    }
}

export async function getMonthDiaryPage(req: Request, res: Response) {
    const Today = new Date();
    const Month = Today.getMonth() + 1;
    const page: string = req.query.page as string;
    const offset: string = req.query.offset as string;

    const userId: string = req.query.user_id as string;
    const month: string = req.query.month
        ? (req.query.month as string)
        : Month.toString();

    try {
        const user: User = await userRepository.findByUserId(userId);
        if (!user) {
            return res.status(401).json({ message: '사용자가 없습니다.' });
        }

        const data: GetDiary = await diaryRepository.getDiaryByMonthPage(
            userId,
            month,
            page,
            offset
        );
        //console.log('getdiary data', data);

        res.status(200).json({ data, nextPage: page });
    } catch (err) {
        console.log(err);
    }
}

export async function getMonthDiary(req: Request, res: Response) {
    const Today = new Date();
    const Month = Today.getMonth() + 1;

    const userId: string = req.query.user_id as string;
    const month: string = req.query.month
        ? (req.query.month as string)
        : Month.toString();

    try {
        const user: User = await userRepository.findByUserId(userId);
        if (!user) {
            return res.status(401).json({ message: '사용자가 없습니다.' });
        }

        const data: GetDiary = await diaryRepository.getDiaryByMonthHome(
            userId,
            month
        );
        //console.log('getdiary data', data);

        res.status(200).json(data);
    } catch (err) {
        console.log(err);
    }
}

export async function getDiaryAll(req: Request, res: Response) {
    const userId: string = req.query.userId as string;
    const page: string = req.query.page as string;
    const offset: string = req.query.offset as string;

    try {
        const user: User = await userRepository.findByUserId(userId);
        if (!user) {
            return res.status(401).json({ message: '사용자가 없습니다.' });
        }

        const data: GetDiary = await diaryRepository.getAll(
            userId,
            page,
            offset
        );
        res.status(200).json({ data, nextPage: page });
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

    // 이미지 서버에 업로드
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
    const imageArray: (string | null)[] = [
        jsonDiary.image_01,
        jsonDiary.image_02,
        jsonDiary.image_03,
        jsonDiary.image_04,
        jsonDiary.image_05,
    ];
    const imgFiles = req.files;

    let imagePathArray;

    if (jsonDiary.user_id !== req.userId) {
        return res.sendStatus(403);
    }

    // 이미지 서버에 업로드
    if (imgFiles?.length !== 0) {
        // 기존의 사진 삭제하기
        imageArray.forEach((image, index) => {
            if (image != null) {
                const imageReName = image.replace(
                    'https://' + config.ftp.host,
                    '/www'
                );
                console.log('imageReName', imageReName);

                try {
                    imageRemove(imageReName);
                } catch (err) {
                    console.log('imageRemove Error: ', err);

                    return res.sendStatus(403);
                }
            }
        });

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

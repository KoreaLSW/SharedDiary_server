import express, { CookieOptions, Request, Response } from 'express';
import { DiaryLike } from '../type/type';
import * as diaryLikeRepository from '../data/diaryLike';

export async function getDiaryLikeCheck(req: Request, res: Response) {
    const diary: DiaryLike = req.body as DiaryLike;

    const data = await diaryLikeRepository.getDiaryLikeCheck(diary);
    res.status(201).json(data);
}

export async function createDiaryLike(req: Request, res: Response) {
    const diaryLike: DiaryLike = req.body;

    const check = await diaryLikeRepository.getDiaryLikeCheck(diaryLike);
    if (check) {
        return res.status(401).json({ message: '이미 좋아요를 눌럿습니다.' });
    }

    const data = await diaryLikeRepository.create(diaryLike);
    res.status(201).json(data);
}

export async function removeDiaryLike(req: Request, res: Response) {
    const diaryLike: DiaryLike = req.body;

    const check = await diaryLikeRepository.getDiaryLikeCheck(diaryLike);

    if (!check) {
        return res.status(401).json({ message: '좋아요내역이 없습니다.' });
    }

    await diaryLikeRepository.remove(diaryLike);
    res.status(204);
}

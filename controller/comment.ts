import { Request, Response } from 'express';

import { CreateComments, GetComment } from '../type/type';
import * as commentRepository from '../data/comment';
import { IGetUserAuthInfoRequest } from '../middleware/auth';

export async function getComments(req: Request, res: Response) {
    const diaryId: string = req.query.diary_id as string;
    const userId: string = req.query.user_id as string;

    try {
        const data: GetComment = await commentRepository.getComments(
            diaryId,
            userId
        );
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
    }
}

export async function createComments(req: Request, res: Response) {
    const comments: CreateComments = req.body;
    const data = await commentRepository.create(comments);
    res.status(201).json(data);
}

export async function removeComments(
    req: IGetUserAuthInfoRequest,
    res: Response
) {
    const commentId: string = req.body.commentId as string;
    const userId: string = req.body.userId as string;

    if (userId !== req.userId) {
        return res.sendStatus(403);
    }

    await commentRepository.remove(commentId);
    res.sendStatus(204);
}

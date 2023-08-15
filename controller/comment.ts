import { Request, Response } from 'express';

import { CreateComments, GetComment } from '../type/type';
import * as commentRepository from '../data/comment';

export async function getComments(req: Request, res: Response) {
    const diaryId: string = req.params.diaryId as string;
    console.log('getComments', diaryId);

    try {
        const data: GetComment = await commentRepository.getComments(diaryId);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
    }
}

export async function createComments(req: Request, res: Response) {
    console.log('createComments', req.body);

    const comments: CreateComments = req.body;
    const data = await commentRepository.create(comments);
    res.status(201).json(data);
}

export async function removeComments(req: Request, res: Response) {
    const commentId: string = req.body.commentId as string;
    const userId: string = req.body.userId as string;

    await commentRepository.remove(commentId);
    res.status(204);
}

import express, { CookieOptions, Request, Response } from 'express';
import { CommentLike } from '../type/type';
import * as commentLikeRepository from '../data/commentLike';

export async function getCommentLikeCheck(req: Request, res: Response) {
    const commentLike: CommentLike = req.body as CommentLike;

    const data = await commentLikeRepository.getCommentLikeCheck(commentLike);
    res.status(201).json(data);
}

export async function createCommentLike(req: Request, res: Response) {
    const commentLike: CommentLike = req.body;

    const check = await commentLikeRepository.getCommentLikeCheck(commentLike);
    if (check) {
        return res.status(401).json({ message: '이미 좋아요를 눌럿습니다.' });
    }

    const data = await commentLikeRepository.create(commentLike);
    res.status(201).json(data);
}

export async function removeCommentLike(req: Request, res: Response) {
    const commentLike: CommentLike = req.body;

    const check = await commentLikeRepository.getCommentLikeCheck(commentLike);

    if (!check) {
        return res.status(401).json({ message: '좋아요내역이 없습니다.' });
    }

    await commentLikeRepository.remove(commentLike);
    res.status(204);
}

import { Request, Response } from 'express';
import * as userRepository from '../data/auth';
import * as followRepository from '../data/follow';
import { User, Follow } from '../type/type';

export async function getFollower(req: Request, res: Response) {
    const followerId: string = req.query.followerId as string;

    try {
        const data: User = await followRepository.getFollower(followerId);
        //console.log('getdiary data', data);

        res.status(200).json(data);
    } catch (err) {
        console.log(err);
    }
}

export async function getFollowing(req: Request, res: Response) {
    const followingId: string = req.query.followingId as string;

    try {
        const data: User = await followRepository.getFollowing(followingId);
        //console.log('getdiary data', data);

        res.status(200).json(data);
    } catch (err) {
        console.log(err);
    }
}

export async function getFollowCheck(req: Request, res: Response) {
    const follow: Follow = req.query as Follow;
    console.log('getFollowCheck', follow);

    try {
        const data: User = await followRepository.getFollowCheck(follow);
        //console.log('getdiary data', data);

        res.status(200).json(data);
    } catch (err) {
        console.log(err);
    }
}

export async function createFollow(req: Request, res: Response) {
    const follow: Follow = req.body;
    console.log('createFollow', follow);
    const data = await followRepository.create(follow);
    res.status(201).json(data);
}

export async function removeFollow(req: Request, res: Response) {
    const follow: Follow = req.query as Follow;
    console.log('removeFollow', follow);

    await followRepository.remove(follow);
    res.sendStatus(204);
}

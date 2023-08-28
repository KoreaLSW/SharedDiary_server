import express, { CookieOptions, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import * as userRepository from '../data/auth';
import { User } from '../type/type';
import { config } from '../config';
import { IGetUserAuthInfoRequest } from '../middleware/auth';
import bufferToString from '../bufferToString/bufferToString';
import { imageUpload } from '../middleware/image';

// 회원가입
export async function signup(req: Request, res: Response) {
    const profileImg = req.files;
    const user: User = JSON.parse(req.body.signup);
    console.log('signup img : ', profileImg);
    console.log('signup user : ', user);

    //const user: User = req.body;
    user.create_date = new Date().toString();

    // Bind parameters must not contain undefined. To pass SQL NULL specify JS null
    // 데이터베이스 쿼리에서는 undefined를 SQL NULL로 전달할 수 없기 때문에 해당 오류가 발생합니다.
    // 이를 해결하기 위해 undefined를 null로 대체해야 합니다.
    user.introduction =
        user.introduction === undefined ? null : user.introduction;
    user.profile_img = user.profile_img === undefined ? null : user.profile_img;

    const userCheck = await userRepository.findByUserId(user.user_id);
    if (userCheck) {
        // 이미 사용자가 있을때
        return res
            .status(409)
            .json({ message: `아이디 ${user.user_id}가 이미 존재합니다.` });
    }

    const nickCheck = await userRepository.findByNickname(user.nickname);
    if (nickCheck) {
        // 이미 닉네임이 있을때
        return res
            .status(409)
            .json({ message: `닉네임 ${user.nickname}가 이미 존재합니다.` });
    }

    const profilePath = await imageUpload(
        profileImg as Express.Multer.File[],
        user.user_id,
        'profile'
    );

    if (profilePath) {
        user.profile_img = profilePath[0] ?? null;
    }

    // 비밀번호를 암호화하는작업
    const hashed = await bcrypt.hash(user.password, config.bcrypt.saltRounds);
    const userId = await userRepository.createUser({
        ...user,
        password: hashed,
    });

    const token: string = createJwtToken(user); // cookie header
    setToken(res, token);
    res.status(201).json({ token, user: user.user_id });
}

// 로그인
export async function login(req: Request, res: Response) {
    const user_id: string = req.body.user_id;
    const password: string = req.body.password;

    //const { user_id, password } = req.body;
    const user: User = await userRepository.findByUserId(user_id);

    if (!user) {
        return res
            .status(401)
            .json({ message: '사용자 또는 비밀번호가 잘못되었습니다.' });
    }
    // 입력된 암호를 암호회해서 기존의 암호와 일치하는지 체크
    const isValidPassword = await bcrypt.compare(password, `` + user.password);
    if (!isValidPassword) {
        return res
            .status(401)
            .json({ message: '사용자 또는 비밀번호가 잘못되었습니다.' });
    }

    const token = createJwtToken(user);
    setToken(res, token);
    res.status(200).json({ token, user_id });
}

export async function logout(req: Request, res: Response) {
    res.cookie('token', '');
    res.status(200).json({ message: 'User has been logged out' });
}

// 비밀번호 변경 및 유저정보 변경
export async function update(req: Request, res: Response) {
    const user: User = req.body;

    const userCheck: User = await userRepository.findByUserId(user.user_id);
    if (!userCheck) {
        return res
            .status(401)
            .json({ message: '사용자 또는 비밀번호가 잘못되었습니다.' });
    }

    if (user.password) {
        // 패스워드 암호화 후 변경하는곳
        const hashed = await bcrypt.hash(
            user.password,
            config.bcrypt.saltRounds
        );
        await userRepository.updatePassword({
            ...user,
            password: hashed,
        });

        const token: string = createJwtToken(user); // cookie header
        setToken(res, token);
        res.status(201).json({ token, user: user.user_id });
    } else {
        // 유저정보 변경하는곳
        await userRepository.updateUserInfo(user);
        res.status(201).json({ user: user.user_id });
    }
}

export async function remove(req: Request, res: Response) {
    const userId: string = req.params.id;

    const user: User = await userRepository.findByUserId(userId);
    if (!user) {
        return res.status(401).json({ message: '사용자가 없습니다.' });
    }

    await userRepository.removeUser(userId);
    res.clearCookie('token');
    res.sendStatus(204);
}

export async function me(req: IGetUserAuthInfoRequest, res: Response) {
    const userId = req.userId as string;

    const token = req.query.token;
    const user: User = await userRepository.findByUserId(userId);
    if (!user) {
        return res.status(404).json({ message: '사용자가 없습니다.' });
    }

    //const user_id = Buffer.from(user.user_id).toString();
    const id = bufferToString(user.user_id);

    res.status(200).json({ token, id });
}

function createJwtToken(user: User): string {
    return jwt.sign(user, config.jwt.secretKey, {
        // 토큰 유효시간
        expiresIn: config.jwt.expiresInSec,
    });
}

function setToken(res: Response, token: string) {
    const options: CookieOptions = {
        maxAge: config.jwt.expiresInSec * 1000, // 쿠키가 만료되는 시간
        httpOnly: true,
        sameSite: 'none', // 서버와 클라이언트가 동일한 IP가 아니더라도 통신할수있게함
        secure: true, // sameSite: 'none'으로 하면 secure: true 해줘야함
    };
    res.cookie('token', token, options); // HTTP-ONLY
}

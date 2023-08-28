import { User } from '../type/type';
import { db } from '../db/mysql';

export async function findByUserId(userId: string): Promise<User> {
    return db
        .execute('SELECT * FROM user_info WHERE user_id = ?', [userId])
        .then((result: any) => {
            //console.log('findByUsername', result);

            return result[0][0];
        });
}

export async function findByNickname(nickName: string): Promise<User> {
    return db
        .execute('SELECT * FROM user_info WHERE nickname = ?', [nickName])
        .then((result: any) => {
            //console.log('findByUsername', result);

            return result[0][0];
        });
}

export async function createUser(user: User): Promise<any> {
    const {
        user_id,
        password,
        nickname,
        email,
        birthday,
        create_date,
        introduction,
        profile_img,
    } = user;
    return (
        db
            .execute(
                'INSERT INTO user_info (user_id, password, nickname, email, birthday, create_date, introduction, profile_img) VALUES (?,?,?,?,?,?,?,?)',
                [
                    user_id,
                    password,
                    nickname,
                    email,
                    birthday,
                    new Date(),
                    introduction,
                    profile_img,
                ]
            )
            // restul 확인해보고 any타입 바꾸기
            .then((result: any) => {
                return result[0].insertId;
            })
    );
}

export async function updatePassword(user: User): Promise<any> {
    const { user_id, password } = user;
    return (
        db
            .execute('UPDATE user_info SET password = ? WHERE user_id = ?', [
                password,
                user_id,
            ])
            // restul 확인해보고 any타입 바꾸기
            .then((result: any) => {
                return result[0][0];
            })
    );
}

export async function updateUserInfo(user: User): Promise<any> {
    const {
        user_id,
        nickname,
        email,
        birthday,
        create_date,
        introduction,
        profile_img,
    } = user;
    return (
        db
            .execute(
                'UPDATE user_info SET nickname = ?, email = ?, birthday =?, create_date = ?, introduction = ?, profile_img = ? WHERE user_id = ?',
                [
                    nickname,
                    email,
                    birthday,
                    create_date,
                    introduction,
                    profile_img,
                    user_id,
                ]
            )
            // restul 확인해보고 any타입 바꾸기
            .then((result: any) => {
                return result[0][0];
            })
    );
}

export async function removeUser(userId: string): Promise<any> {
    const id = userId;
    return (
        db
            .execute('DELETE FROM user_info WHERE user_id = ?', [id])
            // restul 확인해보고 any타입 바꾸기
            .then((result: any) => {
                return result[0][0];
            })
    );
}

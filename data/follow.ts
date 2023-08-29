import bufferToString from '../bufferToString/bufferToString';
import { db } from '../db/mysql';
import { Follow, User } from '../type/type';

export async function getFollower(followerId: string): Promise<User> {
    return db
        .execute(
            `SELECT u.* FROM follow AS f JOIN user_info AS u ON f.follower_id = u.user_id WHERE  f.following_id = ?`,
            [followerId]
        )
        .then((result: any) => {
            //console.log('findByUsername', result);
            const data: User = bufferToString(result[0]);
            //console.log('getDiaryByUserIdData', data);

            return data;
        });
}

export async function getFollowing(followingId: string): Promise<User> {
    return db
        .execute(
            `SELECT u.* FROM follow AS f JOIN user_info AS u ON f.following_id = u.user_id WHERE  f.follower_id = ?`,
            [followingId]
        )
        .then((result: any) => {
            //console.log('findByUsername', result);
            const data: User = bufferToString(result[0]);
            //console.log('getDiaryByUserIdData', data);

            return data;
        });
}

export async function getFollowCheck(follow: Follow): Promise<User> {
    const { followerId, followingId } = follow;
    return db
        .execute(
            `SELECT * FROM follow WHERE  follower_id = ? AND following_id = ?`,
            [followerId, followingId]
        )
        .then((result: any) => {
            //console.log('findByUsername', result);
            const data: User = bufferToString(result[0]);
            //console.log('getDiaryByUserIdData', data);

            return data;
        });
}

export async function create(follow: Follow): Promise<Follow> {
    const { followerId, followingId } = follow;
    return db
        .execute('INSERT INTO follow(follower_id,following_id)VALUE(?,?);', [
            followerId,
            followingId,
        ])
        .then((result: any) => {
            return result[0].insertId;
        });
}

export async function remove(follow: Follow) {
    const { followerId, followingId } = follow;
    return db.execute(
        'DELETE FROM follow WHERE follower_id = ? AND following_id = ?',
        [followerId, followingId]
    );
}

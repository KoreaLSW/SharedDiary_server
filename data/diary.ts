import bufferToString from '../bufferToString/bufferToString';
import { db } from '../db/mysql';
import { Diary, GetDiary } from '../type/type';

const SELECT_LIKE_COUNT: string =
    '(SELECT COUNT(*) FROM diary_like AS dl WHERE dl.diary_id = d.diary_id) AS like_count';
const SELECT_COMMENT_COUNT: string =
    '(SELECT COUNT(*) FROM comment AS c WHERE c.diary_id = d.diary_id) AS comment_count';
const SELECT_LIKE_CHECK =
    '(SELECT COUNT(*) FROM diary_like d2 WHERE d2.diary_id = d.diary_id AND d2.user_id = ? ) AS like_check';

const SELECT_DIARY: string = `SELECT u.user_id, u.nickname, u.profile_img, d.*, ${SELECT_LIKE_COUNT}, ${SELECT_COMMENT_COUNT}, ${SELECT_LIKE_CHECK} FROM diary AS d JOIN user_info AS u ON d.user_id = u.user_id`;

export async function getDiaryByUserId(userId: string): Promise<GetDiary> {
    console.log('getDiaryByUserId', userId);

    return db
        .execute(`${SELECT_DIARY} WHERE d.user_id = ? `, [userId, userId])
        .then((result: any) => {
            //console.log('findByUsername', result);
            const data: GetDiary = bufferToString(result[0]);
            console.log('getDiaryByUserIdData', data);

            return data;
        });
}

export async function getAll(userId: string): Promise<GetDiary> {
    console.log('getAll', userId);
    return await db.execute(SELECT_DIARY, [userId]).then((result: any) => {
        const data: GetDiary = bufferToString(result[0]);
        console.log('getAllData', data);

        return data;
    });
}

export async function create(diary: Diary): Promise<Diary> {
    const {
        diary_id,
        user_id,
        create_date,
        contents,
        share_type,
        weather,
        emotion,
        image_01,
        image_02,
        image_03,
        image_04,
        image_05,
    } = diary;
    return db
        .execute(
            'INSERT INTO diary(user_id,create_date,contents,share_type,weather,emotion,image_01,image_02,image_03,image_04,image_05)VALUE(?,?,?,?,?,?,?,?,?,?,?)',
            [
                user_id,
                new Date(),
                contents,
                share_type,
                weather,
                emotion,
                image_01,
                image_02,
                image_03,
                image_04,
                image_05,
            ]
        )
        .then((result: any) => {
            return result[0].insertId;
        });
}

export async function update(
    diaryId: string,
    diary: GetDiary
): Promise<GetDiary> {
    const {
        diary_id,
        user_id,
        create_date,
        contents,
        share_type,
        weather,
        emotion,
        image_01,
        image_02,
        image_03,
        image_04,
        image_05,
    } = diary;

    return db
        .execute(
            'UPDATE diary SET contents = ?, share_type = ?, weather = ?, emotion = ?, image_01 = ?, image_02 = ?, image_03 = ?, image_04 = ?, image_05 = ? WHERE diary_id = ?',
            [
                contents,
                share_type,
                weather,
                emotion,
                image_01,
                image_02,
                image_03,
                image_04,
                image_05,
                diaryId,
            ]
        )
        .then((result: any) => {
            return result[0].insertId;
        });
}

export async function remove(diaryId: string) {
    return db.execute('DELETE FROM diary WHERE diary_id = ?', [diaryId]);
}

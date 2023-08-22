import bufferToString from '../bufferToString/bufferToString';
import { db } from '../db/mysql';
import { DiaryLike } from '../type/type';

const SELECT_LIKE = 'SELECT diary_id, user_id FROM diary_like';

// 내가 좋아요 눌렀는지 확인
export async function getDiaryLikeCheck(
    diaryLike: DiaryLike
): Promise<DiaryLike> {
    const { diary_id, user_id } = diaryLike;
    return db
        .execute(`${SELECT_LIKE} WHERE diary_id = ? AND user_id = ?`, [
            diary_id,
            user_id,
        ])
        .then((result: any) => {
            //console.log('findByUsername', result);
            const data: DiaryLike = bufferToString(result[0]);
            return result[0][0];
        });
}

export async function create(diaryLike: DiaryLike): Promise<void> {
    const { diary_id, user_id } = diaryLike;

    return db
        .execute('INSERT INTO diary_like(diary_id,user_id)VALUE(?,?)', [
            diary_id,
            user_id,
        ])
        .then((result: any) => {
            return result[0].insertId;
        });
}

export async function remove(diaryLike: DiaryLike) {
    const { diary_id, user_id } = diaryLike;

    return db.execute(
        'DELETE FROM diary_like WHERE diary_id = ? AND user_id = ?',
        [diary_id, user_id]
    );
}

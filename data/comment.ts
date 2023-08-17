import bufferToString from '../bufferToString/bufferToString';
import { db } from '../db/mysql';
import { CreateComments, GetComment } from '../type/type';

const SELECT_LIKE_COUNT =
    '(SELECT COUNT(*) FROM comment_like cl WHERE cl.comment_id = c.comment_id) AS like_count';
const SELECT_LIKE_CHECK =
    '(SELECT COUNT(*) FROM comment_like c2 WHERE c2.comment_id = c.comment_id AND c2.user_id = ? ) AS like_check';

const SELECT_DIARY: string = `SELECT u.user_id, u.profile_img, u.nickname, c.comment_id, c.diary_id,c.contents, c.create_date, ${SELECT_LIKE_COUNT}, ${SELECT_LIKE_CHECK} FROM comment AS c JOIN user_info AS u ON c.user_id = u.user_id WHERE c.diary_id = ?`;

export async function getComments(
    diaryId: string,
    userId: string
): Promise<GetComment> {
    console.log('getComments', diaryId, userId);
    return await db
        .execute(SELECT_DIARY, [userId, diaryId])
        .then((result: any) => {
            const data: GetComment = bufferToString(result[0]);
            console.log('getComments', data);

            return data;
        });
}

export async function create(
    comments: CreateComments
): Promise<CreateComments> {
    const { diary_id, user_id, contents } = comments;
    return db
        .execute(
            'INSERT INTO comment(diary_id,user_id,contents,create_date)VALUE(?,?,?,?)',
            [diary_id, user_id, contents, new Date()]
        )
        .then((result: any) => {
            return result[0].insertId;
        });
}

export async function remove(commentId: string) {
    return db.execute('DELETE FROM comment WHERE comment_id = ?', [commentId]);
}

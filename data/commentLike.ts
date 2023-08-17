import bufferToString from '../bufferToString/bufferToString';
import { db } from '../db/mysql';
import { CommentLike, DiaryLike } from '../type/type';

const SELECT_LIKE = 'SELECT comment_id, user_id FROM comment_like';

// 내가 좋아요 눌렀는지 확인
export async function getCommentLikeCheck(
    commentLike: CommentLike
): Promise<DiaryLike> {
    const { comment_id, user_id } = commentLike;
    return db
        .execute(`${SELECT_LIKE} WHERE comment_id = ? AND user_id = ?`, [
            comment_id,
            user_id,
        ])
        .then((result: any) => {
            //console.log('findByUsername', result);
            const data: CommentLike = bufferToString(result[0]);
            return result[0][0];
        });
}

export async function create(commentLike: CommentLike): Promise<void> {
    const { comment_id, user_id } = commentLike;
    console.log('create comment_id:', comment_id);
    console.log('create user_id:', user_id);

    return db
        .execute('INSERT INTO comment_like(comment_id,user_id)VALUE(?,?)', [
            comment_id,
            user_id,
        ])
        .then((result: any) => {
            return result[0].insertId;
        });
}

export async function remove(commentLike: CommentLike) {
    const { comment_id, user_id } = commentLike;
    console.log('remove', commentLike);

    return db.execute(
        'DELETE FROM comment_like WHERE comment_id = ? AND user_id = ?',
        [comment_id, user_id]
    );
}

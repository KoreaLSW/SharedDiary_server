import bufferToString from '../bufferToString/bufferToString';
import { db } from '../db/mysql';
import { GetMessage, SelectMessage, sendMessage } from '../type/type';

export async function getChatMessageList(
    user_id: string,
    participant_user_id: string
): Promise<any> {
    return db
        .execute(
            `SELECT cm.chat_id,
            cm.message_date, 
            CASE WHEN cm.user_id = ? THEN ? ELSE ? END AS user_id,
            ui.nickname,
            cm.message,
            ui.profile_img,
            IF(mr.read_id IS NULL, 'Unread', 'Read') AS message_status
            FROM chat_messages cm
            JOIN chat_rooms cr ON cm.room_id = cr.room_id
            JOIN room_participants rp ON cr.room_id = rp.room_id
            JOIN user_info ui ON ui.user_id = cm.user_id
            LEFT JOIN message_reads mr ON cm.chat_id = mr.chat_id AND mr.user_id = CASE WHEN cm.user_id = ? THEN ? ELSE ? END
            WHERE (rp.user_id = ? AND cm.user_id = ?)
                OR (rp.user_id = ? AND cm.user_id = ?)
            ORDER BY cm.message_date;
            `,
            [
                user_id,
                user_id,
                participant_user_id,
                user_id,
                participant_user_id,
                user_id,
                user_id,
                participant_user_id,
                participant_user_id,
                user_id,
            ]
        )
        .then((result: any) => {
            //console.log('getMessageRoomList', result[0]);
            const data: GetMessage = bufferToString(result[0]);
            //console.log('getChatMessageList', data);

            return data;
        });
}

export async function sendChatMessage(users: sendMessage): Promise<any> {
    const { user_id, participant_user_id, message } = users;
    return db
        .execute(
            `INSERT INTO chat_messages (room_id, user_id, message)
                SELECT rp.room_id, ?, ?
                FROM room_participants rp
                JOIN room_participants rp_opponent ON rp.room_id = rp_opponent.room_id
                WHERE rp.user_id = ? AND rp_opponent.user_id = ?
                LIMIT 1;`,
            [user_id, message, user_id, participant_user_id]
        )
        .then((result: any) => {
            return result[0].insertId;
        });
}

export async function readChatMessage(
    room_id: string,
    user_id: string,
    participant_user_id: string
): Promise<any> {
    return db
        .execute(
            `INSERT INTO message_reads (chat_id, user_id)
            SELECT cm.chat_id, ?
            FROM chat_messages cm
            WHERE cm.room_id = ?
            AND cm.user_id = ?
            AND cm.chat_id <= (
                SELECT COALESCE(MIN(chat_id), 0)
                FROM chat_messages
                WHERE room_id = ?
                AND user_id = ?
            )
            AND NOT EXISTS (
                SELECT 1
                FROM message_reads mr
                WHERE mr.chat_id = cm.chat_id
                AND mr.user_id = ?
            );
            `,
            [
                user_id,
                room_id,
                participant_user_id,
                room_id,
                participant_user_id,
                user_id,
            ]
        )
        .then((result: any) => {
            return result[0].insertId;
        });
}

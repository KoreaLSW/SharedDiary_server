import bufferToString from '../bufferToString/bufferToString';
import { db } from '../db/mysql';
import { ChatRoomUsers, GetChatRoomList, UpdateChatTitle } from '../type/type';

export async function getChatRoomList(userId: string): Promise<any> {
    return db
        .execute(
            `SELECT cr.room_id, 
            cr.room_name, 
            cr.create_date, 
            CASE WHEN rp.user_id = ? THEN rp_opponent.user_id ELSE rp.user_id END AS participant_user_id,
            ui.profile_img,
            ui.nickname AS participant_nickname,
            cm.chat_id,
            IFNULL(unread_counts.unread_count, 0) AS unread_count,
            COALESCE(cm.message, 'No messages') as message,
            cm.message_date
                FROM chat_rooms cr
                JOIN room_participants rp ON cr.room_id = rp.room_id
                JOIN room_participants rp_opponent ON cr.room_id = rp_opponent.room_id AND rp_opponent.user_id != ?
                JOIN user_info ui ON ui.user_id = rp_opponent.user_id
                LEFT JOIN (
                    SELECT cr.room_id,
                        COALESCE(unread_count, 0) AS unread_count
                FROM chat_rooms cr
                JOIN room_participants rp ON cr.room_id = rp.room_id
                LEFT JOIN (
                    SELECT cm.room_id,
                            COUNT(*) AS unread_count
                    FROM chat_messages cm
                    LEFT JOIN message_reads mr ON cm.chat_id = mr.chat_id AND mr.user_id = ?
                    JOIN room_participants rp ON cm.room_id = rp.room_id
                    WHERE cm.user_id = rp.user_id 
                    AND cm.room_id = rp.room_id
                    AND rp.user_id != ?
                    AND mr.read_id IS NULL
                    GROUP BY cm.room_id
                ) unread_counts ON cr.room_id = unread_counts.room_id
                WHERE rp.user_id = ?
                ) unread_counts ON cr.room_id = unread_counts.room_id
                LEFT JOIN (
                    SELECT room_id, MAX(chat_id) AS max_chat_id
                    FROM chat_messages
                    GROUP BY room_id
                ) max_chat ON cr.room_id = max_chat.room_id
                LEFT JOIN chat_messages cm ON max_chat.room_id = cm.room_id AND max_chat.max_chat_id = cm.chat_id
                WHERE rp.user_id = ?;`,
            [userId, userId, userId, userId, userId, userId]
        )
        .then((result: any) => {
            //console.log('getMessageRoomList', result[0]);
            const data: GetChatRoomList = bufferToString(result[0]);
            console.log('getDiaryByUserIdData', data);

            return data;
        });
}

export async function createRoom(users: ChatRoomUsers): Promise<any> {
    const { user_id, participant_user_id } = users;
    return db
        .execute(
            `INSERT INTO chat_rooms (room_name, create_date)
                VALUES (?, NOW());
                SET @room_id = LAST_INSERT_ID();
                INSERT INTO room_participants (user_id, room_id)
                VALUES (?, @room_id), (?, @room_id);`,
            [`${participant_user_id}님과의 채팅`, user_id, participant_user_id]
        )
        .then((result: any) => {
            return result[0].insertId;
        });
}

export async function removeRoom(users: ChatRoomUsers): Promise<any> {
    const { user_id, participant_user_id } = users;
    return db
        .execute(
            `DELETE FROM chat_rooms
                WHERE room_id IN (
                    SELECT rp.room_id
                        FROM room_participants rp
                            JOIN room_participants rp_opponent ON rp.room_id = rp_opponent.room_id
                WHERE (rp.user_id = ? AND rp_opponent.user_id = ?)
                    OR (rp.user_id = ? AND rp_opponent.user_id = ?)
            );`,
            [user_id, participant_user_id, participant_user_id, user_id]
        )
        .then((result: any) => {
            return result[0].insertId;
        });
}

export async function updateRoom(updatechat: UpdateChatTitle): Promise<any> {
    const { user_id, participant_user_id, title } = updatechat;

    return db
        .execute(
            `UPDATE chat_rooms cr
                JOIN room_participants rp ON cr.room_id = rp.room_id
                JOIN room_participants rp_opponent ON cr.room_id = rp_opponent.room_id
                    SET cr.room_name = ?
                        WHERE (rp.user_id = ? AND rp_opponent.user_id = ?)
                        OR (rp.user_id = ? AND rp_opponent.user_id = ?);`,
            [title, user_id, participant_user_id, participant_user_id, user_id]
        )
        .then((result: any) => {
            return result[0].insertId;
        });
}

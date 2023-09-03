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
            console.log('getChatRoomList', data);

            return data;
        });
}

export async function createRoom(users: ChatRoomUsers): Promise<any> {
    const { user_id, participant_user_id } = users;

    // 채팅방을 생성하기 전에 미리 생성된 채팅방이 있는지 확인
    const [rows] = await db.execute(
        `SELECT rp1.room_id
            FROM room_participants rp1
            WHERE rp1.user_id = ? AND EXISTS (
                SELECT 1
                FROM room_participants rp2
                WHERE rp2.user_id = ? AND rp1.room_id = rp2.room_id
            );
        `,
        [user_id, participant_user_id]
    );

    if ((rows as any).length > 0) {
        // 미리 만들어진 채팅방이 존재함

        const roomId = (rows as any)[0].room_id;
        return roomId;
    } else {
        // 미리 만들어진 채팅방이 존재하지 않음

        // 1. 채팅 방 생성
        const createRoomQuery = `INSERT INTO chat_rooms (room_name, create_date)
                                    VALUES (?, NOW())`;
        const createRoomParams = [`${participant_user_id}님과의 채팅`];

        // 2. 방 생성 후의 마지막 삽입된 ID를 가져옴
        const getLastInsertIdQuery = `SELECT LAST_INSERT_ID() as room_id`;

        // 3. 방 참가자 추가
        const addParticipantsQuery = `INSERT INTO room_participants (user_id, room_id)
                                        VALUES (?, ?), (?, ?)`;
        const addParticipantsParams = [user_id, 0, participant_user_id, 0]; // 여기서 0은 아직 알 수 없는 값을 의미합니다.

        try {
            // 1. 채팅 방 생성
            const [createRoomResult] = await db.execute(
                createRoomQuery,
                createRoomParams
            );

            // 2. 방 생성 후의 마지막 삽입된 ID를 가져옴
            const [lastInsertIdResult] = await db.execute(getLastInsertIdQuery);
            const room_id = (lastInsertIdResult as any)[0].room_id;

            // 3. 방 참가자 추가
            await db.execute(addParticipantsQuery, [
                user_id,
                room_id,
                participant_user_id,
                room_id,
            ]);

            return room_id;
        } catch (error) {
            console.error('Error creating room:', error);
            throw error;
        }
    }
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

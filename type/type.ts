export type User = {
    user_id: string;
    password: string;
    passwordUpdate: string;
    nickname: string;
    email: string;
    birthday: string;
    create_date: string;
    introduction: string | null;
    profile_img: string | null;
};

export type SetDiary = {
    user_id: string;
    create_date: string;
    diary_date: string;
    contents: string;
    share_type: number;
    weather: number;
    emotion: number;
    image_01: string | null;
    image_02: string | null;
    image_03: string | null;
    image_04: string | null;
    image_05: string | null;
};

export type GetDiary = {
    user_id: string;
    nickname: string;
    profile_img: string | null;
    diary_id: number;
    create_date: string;
    diary_date: string;
    contents: string;
    share_type: number;
    weather: number;
    emotion: number;
    image_01: string | null;
    image_02: string | null;
    image_03: string | null;
    image_04: string | null;
    image_05: string | null;
    like_count: number;
    comment_count: number;
};

export type DiaryLike = {
    user_id: string; // 내 아이디
    diary_id: string; // 게시물 아이디
};

export type CreateComments = {
    diary_id: string;
    user_id: string;
    contents: string;
};

export type GetComment = {
    user_id: string;
    profile_img: string;
    nickname: string;
    comment_id: string;
    diary_id: string;
    contents: string;
    create_date: string;
};

export type CommentLike = {
    user_id: string; // 내 아이디
    comment_id: string; // 댓글 아이디
};

export type WeatherType = {
    weather_id: string; // 날씨 아이디
    weather_text: string; // 날씨 텍스트
};

export type EmotionType = {
    emotion_id: string; // 감정 아이디
    emotion_text: string; // 감정 텍스트
};

export type Follow = {
    followerId: string;
    followingId: string;
};

export type GetChatRoomList = {
    room_id: number;
    room_name: string;
    create_date: string;
    participant_user_id: string;
    participant_nickname: string;
    profile_img: string;
    chat_id: number;
    message: string;
    message_date: string;
    unread_count: number;
};

export type ChatRoomUsers = {
    user_id: string;
    participant_user_id: string;
};

export type UpdateChatTitle = {
    user_id: string;
    participant_user_id: string;
    title: string;
};

export type SelectMessage = {
    room_id: string;
    user_id: string;
    participant_user_id: string;
};

export type sendMessage = {
    user_id: string;
    participant_user_id: string;
    message: string;
};

export type GetMessage = {
    chat_id: number;
    message_date: string;
    user_id: string;
    nickname: string;
    message: string;
    profile_img: string;
    message_status: 'Read' | 'Unread';
};

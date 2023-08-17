export type User = {
    user_id: string;
    password: string;
    nickname: string;
    email: string;
    birthday: string;
    create_date: string;
    introduction: string | null;
    profile_img: string | null;
};

export type Diary = {
    diary_id: number;
    user_id: string;
    create_date: string;
    dreate_date: string;
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
    dreate_date: string;
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

import { rateLimit } from 'express-rate-limit';
import { config } from '../config';

export default rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequest, // IP별로 시간설정 한 만큼 얼마나 통신이 가능한지
    message: '요청이 제한되었습니다. 1분뒤에 다시 시도해주세요.',
});

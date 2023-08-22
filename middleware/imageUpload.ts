import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import { Client } from 'basic-ftp';
import { config } from '../config';

const Readable = require('stream').Readable;

export async function imageUpload(
    imagePath: Express.Multer.File[],
    userId: string,
    type: string,
    date?: string
) {
    let imagePatharray: string[] = [];

    // FTP 업로드
    const client = new Client();
    try {
        await client.access({
            host: config.ftp.host,
            user: config.ftp.user,
            password: config.ftp.password,
            secure: false, // true로 설정하면 FTPS 사용
        });

        for (let i = 0; i < imagePath.length; i++) {
            // 랜덤 문자열 생성
            const randomImgName = uuidv4().replace(/-/g, '').substring(0, 12);
            const imageBuffer = await sharp(imagePath[i].buffer)
                .resize({ width: 800 })
                .jpeg({ quality: 80 }) // JPEG 품질 설정
                .toBuffer();

            const imageStream = new Readable();
            imageStream.push(imageBuffer);
            imageStream.push(null); // Stream 종료를 알림

            // 폴더 생성 후 이미지 저장
            await client.ensureDir(`/www/img/${type}/${userId}/${date}`);

            // FTP에 이미지 저장
            await client.uploadFrom(
                imageStream,
                `/www/img/${type}/${userId}/${date}/${randomImgName}.jpg`
            );
            imagePatharray.push(
                `${config.ftp.host}/img/${type}/${userId}/${date}/${randomImgName}.jpg`
            );
        }
        return imagePatharray;
    } catch (error) {
        console.error('Error uploading file:', error);
    } finally {
        client.close();
    }
}

import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import { Client } from 'basic-ftp';
import { config } from '../config';

const Readable = require('stream').Readable;

async function createClient() {
    const client = new Client();

    await client.access({
        host: config.ftp.host,
        user: config.ftp.user,
        password: config.ftp.password,
        secure: false, // true로 설정하면 FTPS 사용
    });

    return client;
}

export async function imageUpload(
    imagePath: Express.Multer.File[],
    userId: string,
    type: string,
    date?: string
) {
    const client = await createClient();

    let WIDTH: number = 800;
    let HEIGHT: number = 800;
    let imagePatharray: string[] = [];
    if (type === 'diary') {
        WIDTH = 200;
        HEIGHT = 200;
    } else {
        WIDTH = 60;
        HEIGHT = 60;
        console.log('프로필');
    }

    try {
        for (let i = 0; i < imagePath.length; i++) {
            // 랜덤 문자열 생성
            const randomImgName = uuidv4().replace(/-/g, '').substring(0, 12);
            const imageBuffer = await sharp(imagePath[i].buffer)
                .resize({ width: WIDTH, height: HEIGHT })
                .jpeg({ quality: 80 }) // JPEG 품질 설정
                .toBuffer();

            const imageStream = new Readable();
            imageStream.push(imageBuffer);
            imageStream.push(null); // Stream 종료를 알림

            if (date) {
                // 폴더 생성 후 이미지 저장
                await client.ensureDir(`/www/img/${type}/${userId}/${date}`);

                // FTP에 이미지 저장
                await client.uploadFrom(
                    imageStream,
                    `/www/img/${type}/${userId}/${date}/${randomImgName}.jpg`
                );
                imagePatharray.push(
                    `https://${config.ftp.host}/img/${type}/${userId}/${date}/${randomImgName}.jpg`
                );
            } else {
                // 폴더 생성 후 이미지 저장
                await client.ensureDir(`/www/img/${type}/${userId}`);

                // FTP에 이미지 저장
                await client.uploadFrom(
                    imageStream,
                    `/www/img/${type}/${userId}/${randomImgName}.jpg`
                );

                imagePatharray.push(
                    `https://${config.ftp.host}/img/${type}/${userId}/${randomImgName}.jpg`
                );
            }
        }
        return imagePatharray;
    } catch (error) {
        return console.error('Error uploading file:', error);
    } finally {
        client.close();
    }
}

export async function imageRemove(filePath: string) {
    const client = await createClient();

    try {
        // 파일 삭제
        await client.remove(filePath);
    } catch (error) {
        throw new Error(`imageRemove Error: ${error}`);
    } finally {
        client.close();
    }
}

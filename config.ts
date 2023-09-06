import dotenv from 'dotenv';
dotenv.config();

function required(key: string, defaultValue?: number): string {
    const value: any = process.env[key] || defaultValue;
    if (value == null) {
        throw new Error(`Key ${key} is undefined`);
    }
    return value;
}

export const config = {
    jwt: {
        secretKey: required('JWT_SECRET'),
        expiresInSec: parseInt(required('JWT_EXPIRES_SEC', 86400)),
    },
    bcrypt: {
        saltRounds: parseInt(required('BCRYPT_SALT_ROUNDS', 12)),
    },
    port: {
        port: parseInt(required('PORT', 8080)),
    },
    db: {
        host: required('DB_HOST'),
        user: required('DB_USER'),
        database: required('DB_DATABASE'),
        password: required('DB_PASSWORD'),
        charset: required('DB_CHARSET'),
    },
    cors: {
        allowedOrigin: required('CORS_ALLOW_ORIGIN'),
    },
    ftp: {
        host: required('FTP_SERVER_HOST'),
        user: required('FTP_SERVER_USER'),
        password: required('FTP_SERVER_PASSWORD'),
    },
    rateLimit: {
        windowMs: 60000,
        maxRequest: 100,
    },
};

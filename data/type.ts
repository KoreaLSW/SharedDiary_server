import { EmotionType, User, WeatherType } from '../type/type';
import { db } from '../db/mysql';

export async function getWeatherType(): Promise<WeatherType> {
    return db.execute('SELECT * FROM weather_type').then((result: any) => {
        //console.log('findByUsername', result);

        return result[0];
    });
}

export async function getEmotionType(): Promise<EmotionType> {
    return db.execute('SELECT * FROM emotion_type').then((result: any) => {
        return result[0];
    });
}

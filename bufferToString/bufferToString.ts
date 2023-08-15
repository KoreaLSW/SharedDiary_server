export default function bufferToString<T>(data: T): T {
    if (!data || typeof data !== 'object') {
        return data;
    }

    if (Buffer.isBuffer(data)) {
        return (data as any).toString('utf8') as T;
    }

    if (Array.isArray(data)) {
        const result: any[] = [];
        for (const item of data) {
            result.push(bufferToString(item));
        }
        return result as T;
    }

    const result: any = {};
    for (const key in data) {
        if (key === 'create_date' && data[key] instanceof Date) {
            // Adjust the date to Korean time (+09:00)
            const koreanTime = new Date(data[key] as Date);
            koreanTime.setHours(koreanTime.getHours() + 9);

            // Format the date in the desired string format (e.g., "2023-08-07 13:58:33")
            const formattedDate = koreanTime
                .toISOString()
                .replace('T', ' ')
                .substring(0, 19);
            result[key] = formattedDate;
        } else {
            result[key] = bufferToString(data[key]);
        }
    }

    return result as T;
}

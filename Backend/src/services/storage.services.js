import ImageKit from '@imagekit/nodejs';
import { config } from '../config/config.js';

const client = new ImageKit({
    privateKey: config.PRIVATE_KEY_IMAGEKIT, // This is the default and can be omitted
});


export async function uploadFile({ buffer, fileName, folder = "snitch" }) {
    const result = await client.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder
    })

    return result
}
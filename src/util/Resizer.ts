import path from "path";
import sharp from "sharp";

import { v4 as uuid } from "uuid";

export class Resizer {
    folder: string;
    width: number;
    height: number;
    quality: number;

    constructor(properties: {
        folder: string;
        width: number;
        height: number;
        quality: number;
    }) {
        this.folder = properties.folder;
        this.width = properties.width;
        this.height = properties.height;
        this.quality = properties.quality;
    }

    async save(buffer: any, filename: any = null) {
        filename = filename ?? Resizer.generateFilename();
        const filepath = this.filepath(filename);

        await sharp(buffer)
            .resize(this.width, this.height, {
                fit: sharp.fit.cover,
                withoutEnlargement: false,
            })
            .png({
                progressive: true,
                compressionLevel: 9,
                adaptiveFiltering: true,
                quality: this.quality,
            })
            .toFile(filepath);

        return filename;
    }

    static generateFilename() {
        const today = new Date();
        const date = `${today.getFullYear()}${(
            "0" +
            (today.getMonth() + 1)
        ).slice(1)}${("0" + today.getDate()).slice(1)}`;
        return `${date}_${uuid()}.png`;
    }

    filepath(filename: string) {
        return path.resolve(`${this.folder}/${filename}`);
    }
}

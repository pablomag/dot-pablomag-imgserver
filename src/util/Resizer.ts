import path from "path";
import sharp from "sharp";

import { v4 as uuid } from "uuid";

export class Resizer {
    folder: string;
    width: number;
    height: number;
    quality: number;

    constructor(
        properties: {
            folder: string,
            width: number,
            height: number,
            quality: number,
        }
    ){
        this.folder = properties.folder;
        this.width = properties.width;
        this.height = properties.height;
        this.quality = properties.quality;
    }

    async save(buffer: any) {
        const filename = Resizer.filename();
        const filepath = this.filepath(filename);

        await sharp(buffer)
            .resize(
                this.width,
                this.height,
                {
                    fit: sharp.fit.contain,
                    withoutEnlargement: false,
                }
            )
            .png({
                progressive: true,
                compressionLevel: 9,
                adaptiveFiltering: true,
                quality: 80,
            })
            .toFile(filepath);

        return filename;
    }

    static filename() {
        return `${uuid()}.png`;
    }

    filepath(filename: string) {
        return path.resolve(`${this.folder}/${filename}`);
    }
}

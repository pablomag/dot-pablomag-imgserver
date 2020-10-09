import path from "path";
import sharp from "sharp";

import { v4 as uuid } from "uuid";

export class Resize {
    folder: string;
    width: number;
    height: number;

    constructor(properties: { folder: string; width: number; height: number }) {
        this.folder = properties.folder;
        this.width = properties.width;
        this.height = properties.height;
    }

    async save(buffer: any) {
        const filename = Resize.filename();
        const filepath = this.filepath(filename);

        await sharp(buffer)
            .resize(this.width, this.height, {
                fit: sharp.fit.inside,
                withoutEnlargement: false,
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

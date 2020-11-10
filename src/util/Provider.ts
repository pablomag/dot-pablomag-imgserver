import axios from "axios";
import path from "path";
import fs from "fs";

import { PROVIDER_URI, PROVIDER_CLIENT_ID } from "../constants";

export class Provider {
    async search(keyword: string, page: number = 1): Promise<any> {
        const itemsPerPage = 20;
        const url = `${PROVIDER_URI}/search/photos?query=${keyword}&page=${page}&per_page=${itemsPerPage}&client_id=${PROVIDER_CLIENT_ID}`;
        const result = await axios.get(url);

        return result.data;
    }

    async download(image: any): Promise<any> {
        const url = `${image.full}&client_id=${PROVIDER_CLIENT_ID}`;
        const imageTempPath = path.resolve(
            __dirname,
            `../../data/images/__temp_${image.id}-${image.user.id}.png`
        );
        const writer = fs.createWriteStream(imageTempPath);

        const response = await axios.get(url, { responseType: "stream" });
        response.data.pipe(writer);

        const saveTempFile = async () => {
            return new Promise((resolve, reject) => {
                writer.on("finish", () =>
                    resolve({
                        status: "success",
                        message: "Temporary image created successfully",
                        imageTempPath,
                    })
                );
                writer.on("error", () =>
                    reject({
                        status: "error",
                        message: "Error while creating temporary file",
                    })
                );
            });
        };
        return await saveTempFile();
    }

    async delete(path: string): Promise<any> {
        try {
            fs.unlinkSync(path);
        } catch (error) {
            console.error(error);
        }
    }
}

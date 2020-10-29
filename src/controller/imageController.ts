import path from "path";
import fs from "fs";
import { Request, Response, Router } from "express";

import { Resizer } from "../util/Resizer";
import { Provider } from "../util/Provider";

import bodyParser from "../middleware/bodyParser";
import upload from "./../middleware/uploader";

import { IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_QUALITY } from "../constants";

const router = Router();

router.post(
    "/upload",
    upload.single("image"),
    async (req: Request, res: Response) => {
        if (!req.file) {
            return res.status(404).json({ status: "error", message: "No image found" });
        }

        try {
            const imagePath = path.join(__dirname, "../../data/images");
            const properties = {
                folder: imagePath,
                width: IMAGE_WIDTH,
                height: IMAGE_HEIGHT,
                quality: IMAGE_QUALITY,
            };
            const fileUpload = new Resizer(properties);
            const filename = await fileUpload.save(req.file.buffer);

            return res.status(200).json({ status: "success", message: "Image uploaded", image: filename });
        } catch (error: any) {
            return res.status(500).json({ status: "error", message: error.message });
        }
    }
);

router.delete("/delete", [bodyParser], async (req: Request, res: Response) => {
    const path = `./data/images/${req.body.image}`;
    fs.unlink(path, (error) => {
        if (error) {
            return res.status(500).json({ status: "error", message: error.message });
        }
        return res.status(200).json({ status: "success", message: "Image deleted" });
    });
});

router.get("/search/:keyword", async (req: Request, res: Response) => {
    const keyword = req.params.keyword;
    if (!keyword) {
        return res.status(400).json({ status: "error", message: "No keyword provided" });
    }

    const imageProvider = new Provider();
    try {
        const images = await imageProvider.search(keyword);
        if (!images) {
            return res.status(200).json({ status: "error", message: "No images found" });
        }

        return res.status(200).json({ status: "success", message: `${images.total} images found`, images: images.results });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
});

router.post("/download", [bodyParser], async (req: Request, res: Response) => {
    const { image } = req.body;
    if (!image) {
        return res.status(400).json({ status: "error", message: "No image provided" });
    }

    const imageProvider = new Provider();
    try {
        const result = await imageProvider.download(image);
        if (!result) {
            return res.status(200).json({ status: "error", message: "Error downloading image" });
        }

        const imagePath = path.join(__dirname, "../../data/images");
        const properties = {
            folder: imagePath,
            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,
            quality: IMAGE_QUALITY,
        };
        const fileUpload = new Resizer(properties);
        const filename = await fileUpload.save(result.imageTempPath);

        await imageProvider.delete(result.imageTempPath);

        return res.status(200).json({ status: "success", message: "Download successful", filename });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
});

export default router;

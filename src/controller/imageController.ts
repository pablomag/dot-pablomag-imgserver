import { Request, Response, Router } from "express";

import { Resizer } from "../util/Resizer";
import { Provider } from "../util/Provider";
import {
    propertiesMobile,
    propertiesDesktop,
    imagePath,
} from "../util/Properties";

import bodyParser from "../middleware/bodyParser";
import upload from "./../middleware/uploader";

const router = Router();

router.post(
    "/upload",
    upload.single("image"),
    async (req: Request, res: Response) => {
        if (!req.file) {
            return res
                .status(404)
                .json({ status: "error", message: "No image provided" });
        }

        try {
            const fileUploadMobile = new Resizer(propertiesMobile);
            const filename = await fileUploadMobile.save(req.file.buffer);

            const fileUploadDesktop = new Resizer(propertiesDesktop);
            await fileUploadDesktop.save(req.file.buffer, filename);

            return res.status(200).json({
                status: "success",
                message: "Image uploaded",
                image: filename,
            });
        } catch (error: any) {
            return res
                .status(500)
                .json({ status: "error", message: error.message });
        }
    }
);

router.delete("/delete", [bodyParser], async (req: Request, res: Response) => {
    const { image } = req.body;
    if (!image) {
        return res
            .status(200)
            .json({ status: "error", message: "No image found" });
    }

    const imageProvider = new Provider();
    try {
        await imageProvider.delete(`${imagePath}/mobile/${image}`);
        await imageProvider.delete(`${imagePath}/desktop/${image}`);

        return res.status(200).json({
            status: "success",
            message: `Image ${image} deleted`,
            image,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ status: "error", message: error.message });
    }
});

router.get("/search/:keyword", async (req: Request, res: Response) => {
    const { keyword } = req.params;
    if (!keyword) {
        return res
            .status(400)
            .json({ status: "error", message: "No keyword provided" });
    }

    const imageProvider = new Provider();
    try {
        const images = await imageProvider.search(keyword);
        if (!images) {
            return res
                .status(200)
                .json({ status: "error", message: "No images found" });
        }

        return res.status(200).json({
            status: "success",
            message: `${images.total} images found`,
            images: images.results,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ status: "error", message: error.message });
    }
});

router.post("/download", [bodyParser], async (req: Request, res: Response) => {
    const { image } = req.body;
    if (!image) {
        return res
            .status(400)
            .json({ status: "error", message: "No image provided" });
    }

    const imageProvider = new Provider();
    try {
        const result = await imageProvider.download(image);
        if (!result) {
            return res
                .status(200)
                .json({ status: "error", message: "Error downloading image" });
        }

        const fileUploadMobile = new Resizer(propertiesMobile);
        const filename = await fileUploadMobile.save(result.imageTempPath);

        const fileUploadDesktop = new Resizer(propertiesDesktop);
        await fileUploadDesktop.save(result.imageTempPath, filename);

        await imageProvider.delete(result.imageTempPath);

        return res.status(200).json({
            status: "success",
            message: "Image uploaded",
            filename,
        });
    } catch (error: any) {
        return res
            .status(500)
            .json({ status: "error", message: error.message });
    }
});

export default router;

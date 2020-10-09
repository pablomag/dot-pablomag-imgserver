import path from "path";
import fs from "fs";
import { Request, Response, Router } from "express";

import { Resize } from "./../util/resize";

import bodyParser from "../middleware/bodyParser";
import upload from "./../middleware/uploader";

const router = Router();

router.post(
    "/upload",
    upload.single("image"),
    async (req: Request, res: Response) => {
        try {
            const imagePath = path.join(__dirname, "../../data/images");
            const properties = {
                folder: imagePath,
                width: 1280,
                height: 1280,
            };

            const fileUpload = new Resize(properties);

            if (!req.file) {
                return res.status(404).json({ error: "No image found", req });
            }

            const filename = await fileUpload.save(req.file.buffer);

            return res.status(200).json({ image: filename });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
);

router.delete("/delete", [bodyParser], async (req: Request, res: Response) => {
    const path = `./data/images/${req.body.image}`;
    console.log(path);
    fs.unlink(path, (error) => {
        if (error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(200).json({ message: "Image deleted" });
    });
});

export default router;

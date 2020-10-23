import path from "path";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

import auth from "./middleware/auth";
import imageController from "./controller/imageController";

import { API_URI, API_PORT, API_SECRET } from "./constants";

export const service = express();

service.use(compression());
service.use(helmet());

service.use(
    cors({
        origin: `${API_URI}:${API_PORT}`,
        credentials: true,
    })
);

service.use(cookieParser(API_SECRET));

service.use(auth, (req: Request, _: Response, next: NextFunction) => {
    console.log(`${req.method}: ${req.url}`);
    return next();
});

service.use("/image", imageController);

service.use("/images/", express.static(path.join(__dirname, "../data/images")));

service.use((error: any, res: Response) => {
    return res
        .status(error.statusCode || 500)
        .json({ message: "Internal server error" });
});

import path from "path";

import {
    IMAGE_WIDTH_MOBILE,
    IMAGE_HEIGHT_MOBILE,
    IMAGE_WIDTH_DESKTOP,
    IMAGE_HEIGHT_DESKTOP,
    IMAGE_QUALITY,
} from "../constants";

export const imagePath = path.join(__dirname, "../../data/images");

export const propertiesMobile = {
    folder: `${imagePath}/mobile`,
    width: IMAGE_WIDTH_MOBILE,
    height: IMAGE_HEIGHT_MOBILE,
    quality: IMAGE_QUALITY,
};

export const propertiesDesktop = {
    folder: `${imagePath}/desktop`,
    width: IMAGE_WIDTH_DESKTOP,
    height: IMAGE_HEIGHT_DESKTOP,
    quality: IMAGE_QUALITY,
};

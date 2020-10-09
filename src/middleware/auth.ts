import { Request, Response, NextFunction } from "express";

async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    try {
        if (!req.signedCookies.qid) {
            return res
                .status(401)
                .json({ message: "No authorization provided" });
        }
    } catch (error) {
        console.error("Error: " + error);
    }
    next();
}

export default authMiddleware;

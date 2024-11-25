import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import { JWT_SECREAT } from "./config";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const decode = jwt.verify(header as string, JWT_SECREAT);

    if(decode){
        //@ts-ignore
        req.userId = decode.id
        next();
    }else{
        res.status(403).json({
            message: "You are not logedin :("
        })
    }
}
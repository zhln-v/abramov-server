import { NextFunction, Request, Response } from "express";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.status || 500;
    const message = err.message || "Что-то пошло не так";

    res.status(statusCode).json({ error: message });
};

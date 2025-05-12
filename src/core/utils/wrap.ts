import { Request, Response, NextFunction } from 'express';

/**
 * Оборачивает асинхронный метод класса и автоматически ловит ошибки
 */
export const wrap =
    (fn: (req: Request, res: Response, next: NextFunction) => Promise<any> | void) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

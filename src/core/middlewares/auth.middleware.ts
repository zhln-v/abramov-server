import { Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ message: 'Токен не найден' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, '1234567890') as {
            id: string;
            telegramId: string;
            role: Role; // <--- Здесь заменил на Role
        };

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Некорректный токен' });
        return;
    }
};

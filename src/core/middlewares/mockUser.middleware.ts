import { Request, Response, NextFunction } from 'express';

export function mockUser(req: Request, res: Response, next: NextFunction) {
    // ВРЕМЕННО — хардкодим Telegram ID или user.id
    req.user = {
        id: 'mock-user-id-123',
        telegramId: '123456789',
        role: 'USER',
    };

    next();
}

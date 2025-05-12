import { Role } from '@prisma/client';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                telegramId?: string;
                role?: Role;
            };
        }
    }
}

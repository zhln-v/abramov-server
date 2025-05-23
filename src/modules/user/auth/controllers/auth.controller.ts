import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../core/db';
import { Role } from '@prisma/client';

export const registerUser = async (req: Request, res: Response) => {
    const { telegramId, firstName, lastName, username } = req.body;

    try {
        let user = await prisma.user.findUnique({
            where: { telegramId },
        });

        // Если пользователя нет — регистрируем
        if (!user) {
            user = await prisma.user.create({
                data: {
                    telegramId,
                    role: Role.USER,
                },
            });
        }

        // Генерируем JWT токен
        const token = jwt.sign({ id: user.id }, '1234567890', {
            expiresIn: '7d',
        });

        return res.json({ token, user });
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
};

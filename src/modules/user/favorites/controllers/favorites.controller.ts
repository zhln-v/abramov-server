import { Request, Response } from 'express';
import { UserFavoritesService } from '../services/favorites.service';

export class UserFavoritesController {
    // Получить все избранные товары пользователя
    static async getAll(req: Request, res: Response) {
        if (!req.user) {
            return res.status(401).json({ message: 'Пользователь не авторизован' });
        }

        try {
            const favorites = await UserFavoritesService.getAll(req.user.id);
            return res.status(200).json(favorites);
        } catch (error: any) {
            console.error('Ошибка при получении избранного:', error.message);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Добавить товар в избранное
    static async add(req: Request, res: Response) {
        if (!req.user) {
            return res.status(401).json({ message: 'Пользователь не авторизован' });
        }

        try {
            const favorite = await UserFavoritesService.add(req.user.id, req.params.productId);
            return res.status(201).json(favorite);
        } catch (error: any) {
            if (error.code === 'P2002') {
                // Prisma код ошибки уникальности
                return res.status(409).json({ message: 'Товар уже в избранном' });
            }
            console.error('Ошибка при добавлении в избранное:', error.message);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Удалить товар из избранного
    static async remove(req: Request, res: Response) {
        if (!req.user) {
            return res.status(401).json({ message: 'Пользователь не авторизован' });
        }

        try {
            const result = await UserFavoritesService.remove(req.user.id, req.params.productId);

            return res.status(204).send();
        } catch (error: any) {
            console.error('Ошибка при удалении из избранного:', error.message);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

import { Request, Response } from 'express';
import { UserFavoritesService } from '../services/favorites.service';

export class UserFavoritesController {
    static async getAll(req: Request, res: Response) {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const favorites = await UserFavoritesService.getAll(req.user.id);
        res.json(favorites);
    }

    static async add(req: Request, res: Response) {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const favorite = await UserFavoritesService.add(req.user.id, req.params.productId);
        res.status(201).json(favorite);
    }

    static async remove(req: Request, res: Response) {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        await UserFavoritesService.remove(req.user.id, req.params.productId);
        res.status(204).send();
    }
}

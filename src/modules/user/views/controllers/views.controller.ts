import { Request, Response } from 'express';
import { UserViewsService } from '../services/views.service';

export class UserViewsController {
    static async record(req: Request, res: Response) {
        const userId = req.user?.id;
        const { productId } = req.params;

        await UserViewsService.record(userId, productId);
        res.status(204).send();
    }

    static async getAll(req: Request, res: Response) {
        const userId = req.user!.id;
        const views = await UserViewsService.getAll(userId);
        res.json(views);
    }
}

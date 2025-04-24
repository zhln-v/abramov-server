import { Request, Response } from 'express';
import { rateProductSchema } from '../dto/ratings.schema';
import { UserRatingsService } from '../services/ratings.service';

export class UserRatingsController {
    static async getAll(req: Request, res: Response) {
        const userId = req.user!.id;
        const ratings = await UserRatingsService.getAll(userId);
        res.json(ratings);
    }

    static async rate(req: Request, res: Response) {
        const parsed = rateProductSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json(parsed.error);
        }

        const userId = req.user!.id;
        const { productId } = req.params;
        const rating = await UserRatingsService.rate(userId, productId, parsed.data.value);
        res.status(201).json(rating);
    }

    static async remove(req: Request, res: Response) {
        const userId = req.user!.id;
        const { productId } = req.params;
        await UserRatingsService.remove(userId, productId);
        res.status(204).send();
    }
}

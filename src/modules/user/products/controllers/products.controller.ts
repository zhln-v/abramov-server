import { Request, Response } from 'express';
import { UserProductService } from '../services/products.service';
import { prisma } from '../../../../core/db';

export class UserProductsController {
    static async getAll(req: Request, res: Response) {
        const { search, category } = req.query;

        let categoryId: string | undefined;

        if (typeof category === 'string' && category.trim().length > 0) {
            const foundCategory = await prisma.category.findFirst({
                where: { name: category },
            });

            if (!foundCategory) {
                return res.status(404).json({ error: 'Категория не найдена' });
                categoryId = undefined;
            } else {
                categoryId = foundCategory.id;
            }
        }

        const products = await UserProductService.getAll({
            search: String(search || ''),
            categoryId,
        });
        res.json(products);
    }

    static async getById(req: Request, res: Response) {
        const product = await UserProductService.getById(req.params.id);
        res.json(product);
    }
}

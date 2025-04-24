import { Request, Response } from 'express';
import { UserProductService } from '../services/products.service';

export class UserProductsController {
    static async getAll(req: Request, res: Response) {
        const { search, category } = req.query;
        const products = await UserProductService.getAll({
            search: String(search || ''),
            categoryId: category ? String(category) : undefined,
        });
        res.json(products);
    }

    static async getById(req: Request, res: Response) {
        const product = await UserProductService.getById(req.params.id);
        res.json(product);
    }
}

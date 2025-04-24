import { Request, Response } from 'express';
import { BaseController } from '../../../../core/base/base.controller';
import { ProductService } from '../services/products.service';
import { createProductSchema, updateProductSchema } from '../dto/products.schema';

export class ProductsController extends BaseController<typeof ProductService> {
    constructor() {
        super(ProductService);
    }

    async create(req: Request, res: Response) {
        const parsed = createProductSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json(parsed.error);
        }
        const product = await this.service.create(parsed.data);
        return res.status(201).json(product);
    }

    async update(req: Request, res: Response) {
        const parsed = updateProductSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json(parsed.error);
        }
        const product = await this.service.update(req.params.id, parsed.data);
        return res.json(product);
    }
}

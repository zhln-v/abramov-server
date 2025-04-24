import { Request, Response } from 'express';
import { BaseController } from '../../../../core/base/base.controller';
import { CategoryService } from '../services/categories.service';
import { createCategorySchema, updateCategorySchema } from '../dto/categories.schema';

export class CategoriesController extends BaseController<typeof CategoryService> {
    constructor() {
        super(CategoryService);
    }

    async create(req: Request, res: Response) {
        const parsed = createCategorySchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json(parsed.error);
        }
        const category = await this.service.create(parsed.data);
        return res.status(201).json(category);
    }

    async update(req: Request, res: Response) {
        const parsed = updateCategorySchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json(parsed.error);
        }
        const category = await this.service.update(req.params.id, parsed.data);
        return res.json(category);
    }

    async getTree(req: Request, res: Response) {
        const tree = await this.service.getTree();
        return res.json(tree);
    }

    async getChildren(req: Request, res: Response) {
        const children = await this.service.getChildren(req.params.id);
        return res.json(children);
    }
}

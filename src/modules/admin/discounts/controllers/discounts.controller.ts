import { Request, Response } from 'express';
import { BaseController } from '../../../../core/base/base.controller';
import { DiscountService } from '../services/discounts.service';
import { createDiscountSchema, updateDiscountSchema } from '../dto/discounts.schema';

export class DiscountsController extends BaseController<typeof DiscountService> {
    constructor() {
        super(DiscountService);
    }

    async create(req: Request, res: Response) {
        const parsed = createDiscountSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json(parsed.error);
        }
        const discount = await this.service.create(parsed.data);
        return res.status(201).json(discount);
    }

    async update(req: Request, res: Response) {
        const parsed = updateDiscountSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json(parsed.error);
        }
        const discount = await this.service.update(req.params.id, parsed.data);
        return res.json(discount);
    }
}

import { Request, Response } from 'express';
import { BaseController } from '../../../../core/base/base.controller';
import { PromoCodeService } from '../services/promocodes.service';
import { createPromoCodeSchema, updatePromoCodeSchema } from '../dto/promocodes.schema';

export class PromoCodesController extends BaseController<typeof PromoCodeService> {
    constructor() {
        super(PromoCodeService);
    }

    async create(req: Request, res: Response) {
        const parsed = createPromoCodeSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json(parsed.error);
        }
        const promo = await this.service.create(parsed.data);
        return res.status(201).json(promo);
    }

    async update(req: Request, res: Response) {
        const parsed = updatePromoCodeSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json(parsed.error);
        }
        const promo = await this.service.update(req.params.id, parsed.data);
        return res.json(promo);
    }
}

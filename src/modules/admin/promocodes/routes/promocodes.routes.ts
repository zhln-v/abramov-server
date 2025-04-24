import { Router } from 'express';
import { PromoCodesController } from '../controllers/promocodes.controller';
import { wrap } from '../../../../core/utils/wrap';

const adminPromoRouter = Router();
const controller = new PromoCodesController();

adminPromoRouter.get('/admin/promocodes', wrap(controller.getAll.bind(controller)));
adminPromoRouter.get('/admin/promocodes/:id', wrap(controller.getById.bind(controller)));
adminPromoRouter.post('/admin/promocodes', wrap(controller.create.bind(controller)));
adminPromoRouter.patch('/admin/promocodes/:id', wrap(controller.update.bind(controller)));
adminPromoRouter.delete('/admin/promocodes/:id', wrap(controller.delete.bind(controller)));

export default adminPromoRouter;

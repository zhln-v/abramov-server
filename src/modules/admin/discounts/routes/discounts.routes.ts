import { Router } from 'express';
import { DiscountsController } from '../controllers/discounts.controller';
import { wrap } from '../../../../core/utils/wrap';

const adminDiscountRouter = Router();
const controller = new DiscountsController();

adminDiscountRouter.get('/admin/discounts', wrap(controller.getAll.bind(controller)));
adminDiscountRouter.get('/admin/discounts/:id', wrap(controller.getById.bind(controller)));
adminDiscountRouter.post('/admin/discounts', wrap(controller.create.bind(controller)));
adminDiscountRouter.patch('/admin/discounts/:id', wrap(controller.update.bind(controller)));
adminDiscountRouter.delete('/admin/discounts/:id', wrap(controller.delete.bind(controller)));

export default adminDiscountRouter;

import { Router } from 'express';
import { ProductsController } from '../controllers/products.controller';
import { wrap } from '../../../../core/utils/wrap';

const adminProductsRouter = Router();
const controller = new ProductsController();

adminProductsRouter.get('/admin/products', wrap(controller.getAll.bind(controller)));
adminProductsRouter.get('/admin/products/:id', wrap(controller.getById.bind(controller)));
adminProductsRouter.post('/admin/products', wrap(controller.create.bind(controller)));
adminProductsRouter.patch('/admin/products/:id', wrap(controller.update.bind(controller)));
adminProductsRouter.delete('/admin/products/:id', wrap(controller.delete.bind(controller)));

export default adminProductsRouter;

import { Router } from 'express';
import { CategoriesController } from '../controllers/categories.controller';
import { wrap } from '../../../../core/utils/wrap';

const adminCatRouter = Router();
const controller = new CategoriesController();

adminCatRouter.get('/admin/categories', wrap(controller.getAll.bind(controller)));
adminCatRouter.get('/admin/categories/:id', wrap(controller.getById.bind(controller)));
adminCatRouter.post('/admin/categories', wrap(controller.create.bind(controller)));
adminCatRouter.patch('/admin/categories/:id', wrap(controller.update.bind(controller)));
adminCatRouter.delete('/admin/categories/:id', wrap(controller.delete.bind(controller)));
adminCatRouter.get('/admin/cattree', wrap(controller.getTree.bind(controller)));
adminCatRouter.get('/admin/categories/:id/children', wrap(controller.getChildren.bind(controller)));

export default adminCatRouter;

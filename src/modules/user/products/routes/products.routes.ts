import { Router } from 'express';
import { UserProductsController } from '../controllers/products.controller';
import { wrap } from '../../../../core/utils/wrap';

const userProductsRouter = Router();

userProductsRouter.get('/user/products', wrap(UserProductsController.getAll));
userProductsRouter.get('/user/products/:id', wrap(UserProductsController.getById));

export default userProductsRouter;

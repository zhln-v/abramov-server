import { Router } from 'express';
import { UserViewsController } from '../controllers/views.controller';
import { wrap } from '../../../../core/utils/wrap';

const userViewsRouter = Router();

userViewsRouter.post('/user/views/:productId', wrap(UserViewsController.record));
userViewsRouter.get('/user/views', wrap(UserViewsController.getAll));

export default userViewsRouter;

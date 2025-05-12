import { Router } from 'express';
import { UserFavoritesController } from '../controllers/favorites.controller';
import { wrap } from '../../../../core/utils/wrap';
import { authMiddleware } from '../../../../core/middlewares/auth.middleware';

const userFavoritesRouter = Router();

userFavoritesRouter.get('/user/favorites', authMiddleware, wrap(UserFavoritesController.getAll));
userFavoritesRouter.post(
    '/user/favorites/:productId',
    authMiddleware,
    wrap(UserFavoritesController.add),
);
userFavoritesRouter.delete(
    '/user/favorites/:productId',
    authMiddleware,
    wrap(UserFavoritesController.remove),
);

export default userFavoritesRouter;

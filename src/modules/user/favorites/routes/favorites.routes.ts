import { Router } from 'express';
import { UserFavoritesController } from '../controllers/favorites.controller';
import { wrap } from '../../../../core/utils/wrap';

const userFavoritesRouter = Router();

userFavoritesRouter.get('/user/favorites', wrap(UserFavoritesController.getAll));
userFavoritesRouter.post('/user/favorites/:productId', wrap(UserFavoritesController.add));
userFavoritesRouter.delete('/user/favorites/:productId', wrap(UserFavoritesController.remove));

export default userFavoritesRouter;

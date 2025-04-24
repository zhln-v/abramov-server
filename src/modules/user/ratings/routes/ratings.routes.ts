import { Router } from 'express';
import { UserRatingsController } from '../controllers/ratings.controller';
import { wrap } from '../../../../core/utils/wrap';

const userRatingRouter = Router();

userRatingRouter.get('/user/ratings', wrap(UserRatingsController.getAll));
userRatingRouter.post('/user/ratings/:productId', wrap(UserRatingsController.rate));
userRatingRouter.delete('/user/ratings/:productId', wrap(UserRatingsController.remove));

export default userRatingRouter;

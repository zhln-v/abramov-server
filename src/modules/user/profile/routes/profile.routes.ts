import { Router } from 'express';
import { UserProfileController } from '../controllers/profile.controller';
import { authMiddleware } from '../../../../core/middlewares/auth.middleware';

const userRouter = Router();

userRouter.get('/user/me', authMiddleware, UserProfileController.getMe);

export default userRouter;

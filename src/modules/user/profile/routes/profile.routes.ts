import { Router } from 'express';
import { UserProfileController } from '../controllers/profile.controller';

const userRouter = Router();

userRouter.get('/user/me', UserProfileController.getMe);

export default userRouter;

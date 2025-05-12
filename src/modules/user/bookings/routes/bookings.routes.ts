import { Router } from 'express';
import { UserBookingController } from '../controllers/bookings.controller';
import { wrap } from '../../../../core/utils/wrap';
import { authMiddleware } from '../../../../core/middlewares/auth.middleware';

const userBookingsRouter = Router();

userBookingsRouter.post('/user/bookings', authMiddleware, wrap(UserBookingController.create));
userBookingsRouter.get('/user/bookings', authMiddleware, wrap(UserBookingController.getAll));
userBookingsRouter.get('/user/bookings/:id', authMiddleware, wrap(UserBookingController.getById));
userBookingsRouter.delete('/user/bookings/:id', authMiddleware, wrap(UserBookingController.delete));

export default userBookingsRouter;

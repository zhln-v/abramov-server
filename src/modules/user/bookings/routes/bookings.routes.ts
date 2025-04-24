import { Router } from 'express';
import { UserBookingController } from '../controllers/bookings.controller';
import { wrap } from '../../../../core/utils/wrap';

const userBookingsRouter = Router();

userBookingsRouter.post('/user/bookings', wrap(UserBookingController.create));
userBookingsRouter.get('/user/bookings', wrap(UserBookingController.getAll));
userBookingsRouter.get('/user/bookings/:id', wrap(UserBookingController.getById));

export default userBookingsRouter;

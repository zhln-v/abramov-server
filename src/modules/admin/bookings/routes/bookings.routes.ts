import { Router } from 'express';
import { BookingController } from '../controllers/bookings.controller';
import { wrap } from '../../../../core/utils/wrap';

const adminBookingsRouter = Router();

adminBookingsRouter.get('/admin/bookings', wrap(BookingController.getAll));
adminBookingsRouter.get('/admin/bookings/:id', wrap(BookingController.getById));
adminBookingsRouter.patch('/admin/bookings/:id/status', wrap(BookingController.updateStatus));

export default adminBookingsRouter;

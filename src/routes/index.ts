import { Router } from 'express';
import adminCatRouter from '../modules/admin/categories/routes/categories.routes';
import adminProductsRouter from '../modules/admin/products/routes/products.routes';
import adminPromoRouter from '../modules/admin/promocodes/routes/promocodes.routes';
import adminDiscountRouter from '../modules/admin/discounts/routes/discounts.routes';
import adminBookingsRouter from '../modules/admin/bookings/routes/bookings.routes';
import adminAnalyticsRouter from '../modules/admin/analytics/routes/analytics.routes';

export const router = Router();

/*
 * Admin routes
 */
router.use('/', adminCatRouter);
router.use('/', adminProductsRouter);
router.use('/', adminPromoRouter);
router.use('/', adminDiscountRouter);
router.use('/', adminBookingsRouter);
router.use('/', adminAnalyticsRouter);

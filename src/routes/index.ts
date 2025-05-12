import { Router } from 'express';
import adminCatRouter from '../modules/admin/categories/routes/categories.routes';
import adminProductsRouter from '../modules/admin/products/routes/products.routes';
import adminPromoRouter from '../modules/admin/promocodes/routes/promocodes.routes';
import adminDiscountRouter from '../modules/admin/discounts/routes/discounts.routes';
import adminBookingsRouter from '../modules/admin/bookings/routes/bookings.routes';
import adminAnalyticsRouter from '../modules/admin/analytics/routes/analytics.routes';
import userProductsRouter from '../modules/user/products/routes/products.routes';
import userBookingsRouter from '../modules/user/bookings/routes/bookings.routes';
import userFavoritesRouter from '../modules/user/favorites/routes/favorites.routes';
import userRatingRouter from '../modules/user/ratings/routes/ratings.routes';
import userViewsRouter from '../modules/user/views/routes/views.routes';
import userRouter from '../modules/user/profile/routes/profile.routes';
import authRouter from '../modules/user/auth/routes/auth.routes';
import uploadsRouter from '../modules/admin/uploads/routes/uploads.routes';

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

/*
 * User routes
 */
router.use('/', userProductsRouter);
router.use('/', userBookingsRouter);
router.use('/', userFavoritesRouter);
router.use('/', userRatingRouter);
router.use('/', userViewsRouter);
router.use('/', userRouter);
router.use('/', authRouter);
router.use('/', uploadsRouter);

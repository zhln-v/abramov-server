import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { wrap } from '../../../../core/utils/wrap';

const adminAnalyticsRouter = Router();

adminAnalyticsRouter.get('/admin/analytics/summary', wrap(AnalyticsController.summary));
adminAnalyticsRouter.get('/admin/analytics/bookings', wrap(AnalyticsController.bookingTrends));
adminAnalyticsRouter.get('/admin/analytics/revenue', wrap(AnalyticsController.revenueTrends));
adminAnalyticsRouter.get('/admin/analytics/top-products', wrap(AnalyticsController.topProducts));
adminAnalyticsRouter.get(
    '/admin/analytics/top-categories',
    wrap(AnalyticsController.topCategories),
);

export default adminAnalyticsRouter;

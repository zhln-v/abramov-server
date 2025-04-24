import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';

export class AnalyticsController {
    static async summary(req: Request, res: Response) {
        const data = await AnalyticsService.getSummary();
        res.json(data);
    }

    static async bookingTrends(req: Request, res: Response) {
        const data = await AnalyticsService.getBookingTrends();
        res.json(data);
    }

    static async revenueTrends(req: Request, res: Response) {
        const data = await AnalyticsService.getRevenueTrends();
        res.json(data);
    }

    static async topProducts(req: Request, res: Response) {
        const data = await AnalyticsService.getTopProducts();
        res.json(data);
    }

    static async topCategories(req: Request, res: Response) {
        const data = await AnalyticsService.getTopCategories();
        res.json(data);
    }
}

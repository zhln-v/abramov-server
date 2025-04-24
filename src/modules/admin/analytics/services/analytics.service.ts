import { prisma } from '../../../../core/db';
import { subDays, format } from 'date-fns';

export class AnalyticsService {
    static async getSummary() {
        const totalBookings = await prisma.booking.count();
        const confirmed = await prisma.booking.count({ where: { status: 'CONFIRMED' } });
        const canceled = await prisma.booking.count({ where: { status: 'CANCELED' } });
        const users = await prisma.user.count();

        const totalRevenueResult = await prisma.bookingItem.aggregate({
            _sum: { priceSnapshot: true },
        });

        return {
            totalBookings,
            confirmed,
            canceled,
            users,
            totalRevenue: totalRevenueResult._sum.priceSnapshot || 0,
        };
    }

    static async getBookingTrends(days = 30) {
        const since = subDays(new Date(), days);
        const bookings = await prisma.booking.findMany({
            where: { createdAt: { gte: since } },
            select: { createdAt: true },
        });

        const trends: Record<string, number> = {};

        for (let i = 0; i <= days; i++) {
            const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
            trends[date] = 0;
        }

        for (const b of bookings) {
            const day = format(b.createdAt, 'yyyy-MM-dd');
            if (trends[day] !== undefined) {
                trends[day]++;
            }
        }

        return Object.entries(trends)
            .map(([date, count]) => ({ date, count }))
            .reverse();
    }

    static async getRevenueTrends(days = 30) {
        const since = subDays(new Date(), days);
        const items = await prisma.bookingItem.findMany({
            where: {
                booking: {
                    createdAt: { gte: since },
                    status: 'CONFIRMED',
                },
            },
            select: {
                priceSnapshot: true,
                booking: {
                    select: { createdAt: true },
                },
            },
        });

        const trends: Record<string, number> = {};

        for (let i = 0; i <= days; i++) {
            const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
            trends[date] = 0;
        }

        for (const item of items) {
            const day = format(item.booking.createdAt, 'yyyy-MM-dd');
            if (trends[day] !== undefined) {
                trends[day] += item.priceSnapshot;
            }
        }

        return Object.entries(trends)
            .map(([date, value]) => ({ date, value }))
            .reverse();
    }

    static async getTopProducts(limit = 5) {
        return prisma.bookingItem.groupBy({
            by: ['variantId'],
            _count: { variantId: true },
            orderBy: { _count: { variantId: 'desc' } },
            take: limit,
        });
    }

    static async getTopCategories(limit = 5) {
        return prisma.productCategory.groupBy({
            by: ['categoryId'],
            _count: { categoryId: true },
            orderBy: { _count: { categoryId: 'desc' } },
            take: limit,
        });
    }
}

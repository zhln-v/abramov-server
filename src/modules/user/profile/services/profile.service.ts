import { prisma } from '../../../../core/db';

export class UserProfileService {
    static async getUserProfile(userId: string) {
        const [user, bookings, favorites, ratings, views] = await Promise.all([
            prisma.user.findUnique({ where: { id: userId } }),
            prisma.booking.count({ where: { userId } }),
            prisma.favorite.count({ where: { userId } }),
            prisma.rating.count({ where: { userId } }),
            prisma.productView.count({ where: { userId } }),
        ]);

        return {
            id: user?.id,
            telegramId: user?.telegramId,
            role: user?.role,
            createdAt: user?.createdAt,
            stats: {
                bookings,
                favorites,
                ratings,
                views,
            },
        };
    }
}

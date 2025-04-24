import { prisma } from '../../../../core/db';

export class UserRatingsService {
    static async getAll(userId: string) {
        return prisma.rating.findMany({
            where: { userId },
            include: { product: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    static async rate(userId: string, productId: string, value: number) {
        return prisma.rating.upsert({
            where: {
                userId_productId: { userId, productId },
            },
            update: { value },
            create: { userId, productId, value },
        });
    }

    static async remove(userId: string, productId: string) {
        return prisma.rating.delete({
            where: {
                userId_productId: { userId, productId },
            },
        });
    }
}

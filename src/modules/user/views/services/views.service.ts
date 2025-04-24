import { prisma } from '../../../../core/db';

export class UserViewsService {
    static async record(userId: string | undefined, productId: string) {
        return prisma.productView.create({
            data: {
                userId,
                productId,
            },
        });
    }

    static async getAll(userId: string) {
        const views = await prisma.productView.findMany({
            where: { userId },
            include: {
                product: {
                    include: {
                        variants: true,
                        discounts: { include: { discount: true } },
                        categories: { include: { category: true } },
                    },
                },
            },
            orderBy: { viewedAt: 'desc' },
            distinct: ['productId'],
            take: 20,
        });

        return views.map((v) => v.product);
    }
}

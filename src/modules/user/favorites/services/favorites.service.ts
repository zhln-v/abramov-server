import { prisma } from '../../../../core/db';
import { NotFoundError } from '../../../../core/errors/AppError';

export class UserFavoritesService {
    static async getAll(userId: string) {
        const favorites = await prisma.favorite.findMany({
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
            orderBy: { createdAt: 'desc' },
        });

        return favorites.map((fav) => fav.product);
    }

    static async add(userId: string, productId: string) {
        const exists = await prisma.favorite.findFirst({
            where: { userId, productId },
        });

        if (exists) return exists;

        return prisma.favorite.create({
            data: { userId, productId },
        });
    }

    static async remove(userId: string, productId: string) {
        const favorite = await prisma.favorite.findFirst({
            where: { userId, productId },
        });

        if (!favorite) throw new NotFoundError('Товар не в избранном');

        return prisma.favorite.delete({ where: { id: favorite.id } });
    }
}

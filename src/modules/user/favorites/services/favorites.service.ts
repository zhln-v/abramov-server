import { prisma } from '../../../../core/db';
import { NotFoundError } from '../../../../core/errors/AppError';

export class UserFavoritesService {
    // 🔍 Получение всех избранных товаров
    static async getAll(userId: string) {
        try {
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
        } catch (error: any) {
            console.error(`Ошибка при получении избранного: ${error.message}`);
            throw new Error('Не удалось получить список избранного');
        }
    }

    // ➕ Добавление товара в избранное
    static async add(userId: string, productId: string) {
        try {
            const exists = await prisma.favorite.findFirst({
                where: { userId, productId },
            });

            if (exists) {
                console.warn(`Товар уже в избранном: ${productId}`);
                return exists;
            }

            // Транзакция на создание избранного
            const [favorite, product] = await prisma.$transaction([
                prisma.favorite.create({
                    data: { userId, productId },
                }),
                prisma.product.findUnique({
                    where: { id: productId },
                    include: {
                        variants: true,
                        discounts: { include: { discount: true } },
                        categories: { include: { category: true } },
                    },
                }),
            ]);

            return product;
        } catch (error: any) {
            console.error(`Ошибка при добавлении в избранное: ${error.message}`);
            throw new Error('Не удалось добавить в избранное');
        }
    }

    // ❌ Удаление товара из избранного
    static async remove(userId: string, productId: string) {
        try {
            const favorite = await prisma.favorite.findFirst({
                where: { userId, productId },
            });

            if (!favorite) {
                console.warn(`Попытка удалить несуществующий товар из избранного: ${productId}`);
                throw new NotFoundError('Товар не найден в избранном');
            }

            await prisma.favorite.delete({
                where: { id: favorite.id },
            });

            return { message: 'Товар успешно удалён из избранного' };
        } catch (error: any) {
            console.error(`Ошибка при удалении из избранного: ${error.message}`);
            throw new Error('Не удалось удалить из избранного');
        }
    }
}

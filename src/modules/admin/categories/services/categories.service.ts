import { prisma } from '../../../../core/db';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/categories.schema';
import { NotFoundError } from '../../../../core/errors/AppError';

export class CategoryService {
    /**
     * Получить все категории (без иерархии)
     */
    static async getAll() {
        return prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
    }

    /**
     * Получить категорию по ID
     */
    static async getById(id: string) {
        const category = await prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            throw new NotFoundError('Категория не найдена');
        }
        return category;
    }

    /**
     * Создать новую категорию
     */
    static async create(data: CreateCategoryDto) {
        return prisma.category.create({
            data: {
                name: data.name,
                parentId: data.parentId || null,
            },
        });
    }

    /**
     * Обновить существующую категорию
     */
    static async update(id: string, data: UpdateCategoryDto) {
        await this.getById(id); // Проверка
        return prisma.category.update({
            where: { id },
            data: {
                name: data.name,
                parentId: data.parentId ?? undefined,
            },
        });
    }

    /**
     * Удалить категорию и все связанные данные
     * - Рекурсивное удаление всех подкатегорий
     * - Удаление всех товаров, которые относятся к этой категории
     * - Удаление связей в ProductCategory, DiscountCategory
     */
    static async delete(id: string) {
        // 🔍 Проверяем, существует ли категория
        await this.getById(id);

        // 🔄 Транзакция на удаление всех зависимых данных
        await prisma.$transaction(async (tx) => {
            // 1️⃣ Найти все дочерние категории
            const children = await tx.category.findMany({
                where: { parentId: id },
            });

            // 🔄 Рекурсивно удалить подкатегории
            for (const child of children) {
                await this.delete(child.id);
            }

            // 2️⃣ Удаляем связи с продуктами
            await tx.productCategory.deleteMany({
                where: { categoryId: id },
            });

            // 3️⃣ Удаляем скидки на категорию
            await tx.discountCategory.deleteMany({
                where: { categoryId: id },
            });

            // 4️⃣ Удаляем все товары, которые принадлежат категории
            const products = await tx.product.findMany({
                where: {
                    categories: {
                        some: { categoryId: id },
                    },
                },
            });

            const productIds = products.map((p) => p.id);

            if (productIds.length > 0) {
                // 🛑 Удаляем связанные данные
                await tx.productVariant.deleteMany({
                    where: { productId: { in: productIds } },
                });

                await tx.rating.deleteMany({
                    where: { productId: { in: productIds } },
                });

                await tx.favorite.deleteMany({
                    where: { productId: { in: productIds } },
                });

                await tx.productView.deleteMany({
                    where: { productId: { in: productIds } },
                });

                await tx.discountProduct.deleteMany({
                    where: { productId: { in: productIds } },
                });

                // 🗑️ Удаляем продукты
                await tx.product.deleteMany({
                    where: { id: { in: productIds } },
                });
            }

            // 5️⃣ Удаляем саму категорию
            await tx.category.delete({
                where: { id },
            });
        });
    }

    /**
     * Получить подкатегории
     */
    static async getChildren(parentId: string) {
        return prisma.category.findMany({
            where: { parentId },
            orderBy: { name: 'asc' },
        });
    }

    /**
     * Получить дерево категорий (2 уровня вложенности)
     */
    static async getTree() {
        return prisma.category.findMany({
            where: { parentId: null },
            orderBy: { name: 'asc' },
            include: {
                children: {
                    orderBy: { name: 'asc' },
                    include: {
                        children: {
                            orderBy: { name: 'asc' },
                        },
                    },
                },
            },
        });
    }
}

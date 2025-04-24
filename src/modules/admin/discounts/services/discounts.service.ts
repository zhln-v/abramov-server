import { prisma } from '../../../../core/db';
import { CreateDiscountDto, UpdateDiscountDto } from '../dto/discounts.schema';
import { NotFoundError } from '../../../../core/errors/AppError';

export class DiscountService {
    static async getAll() {
        return prisma.discount.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    static async getById(id: string) {
        const discount = await prisma.discount.findUnique({ where: { id } });
        if (!discount) throw new NotFoundError('Скидка не найдена');
        return discount;
    }

    static async create(data: CreateDiscountDto) {
        const { productIds = [], categoryIds = [], ...discountData } = data;

        return prisma.discount.create({
            data: {
                ...discountData,
                products: {
                    create: productIds.map((productId) => ({ productId })),
                },
                categories: {
                    create: categoryIds.map((categoryId) => ({ categoryId })),
                },
            },
        });
    }

    static async update(id: string, data: UpdateDiscountDto) {
        await this.getById(id);

        const { productIds, categoryIds, ...updateData } = data;

        // Обновляем основные поля
        const discount = await prisma.discount.update({
            where: { id },
            data: updateData,
        });

        // Очистка старых связей
        if (productIds) {
            await prisma.discountProduct.deleteMany({ where: { discountId: id } });
            await prisma.discount.update({
                where: { id },
                data: {
                    products: {
                        create: productIds.map((productId) => ({ productId })),
                    },
                },
            });
        }

        if (categoryIds) {
            await prisma.discountCategory.deleteMany({ where: { discountId: id } });
            await prisma.discount.update({
                where: { id },
                data: {
                    categories: {
                        create: categoryIds.map((categoryId) => ({ categoryId })),
                    },
                },
            });
        }

        return this.getById(id);
    }

    static async delete(id: string) {
        await this.getById(id);

        await prisma.discountProduct.deleteMany({ where: { discountId: id } });
        await prisma.discountCategory.deleteMany({ where: { discountId: id } });
        return prisma.discount.delete({ where: { id } });
    }
}

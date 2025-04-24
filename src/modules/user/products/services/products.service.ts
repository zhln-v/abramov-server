import { prisma } from '../../../../core/db';
import { calculateFinalPrice } from '../../../../core/utils/pricing.util';

export class UserProductService {
    static async getAll({ search, categoryId }: { search?: string; categoryId?: string }) {
        const products = await prisma.product.findMany({
            where: {
                name: { contains: search, mode: 'insensitive' },
                categories: categoryId ? { some: { categoryId } } : undefined,
            },
            include: {
                variants: true,
                discounts: { include: { discount: true } },
                categories: { include: { category: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        return products.map((p) => ({
            ...p,
            finalPrice: calculateFinalPrice(p.basePrice, p.discounts),
        }));
    }

    static async getById(id: string) {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                variants: true,
                discounts: { include: { discount: true } },
                categories: { include: { category: true } },
            },
        });

        if (!product) throw new Error('Товар не найден');

        return {
            ...product,
            finalPrice: calculateFinalPrice(product.basePrice, product.discounts),
        };
    }
}

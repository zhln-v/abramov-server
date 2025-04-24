import { prisma } from '../../../../core/db';
import { CreateProductDto, UpdateProductDto } from '../dto/products.schema';
import { NotFoundError } from '../../../../core/errors/AppError';

function calculateFinalPrice(
    basePrice: number,
    discounts: { discount: { type: string; value: number; active: boolean } }[],
): number {
    let price = basePrice;

    for (const { discount } of discounts) {
        if (!discount.active) continue;

        if (discount.type === 'PERCENT') {
            price -= (price * discount.value) / 100;
        } else if (discount.type === 'FIXED') {
            price -= discount.value;
        }
    }

    return Math.max(price, 0);
}

export class ProductService {
    static async getAll() {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                variants: true,
                discounts: { include: { discount: true } },
                categories: { include: { category: true } },
            },
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

        if (!product) throw new NotFoundError('Товар не найден');

        return {
            ...product,
            finalPrice: calculateFinalPrice(product.basePrice, product.discounts),
        };
    }

    static async create(data: CreateProductDto) {
        const { variants, discountIds, categoryIds, ...productData } = data as any;

        return prisma.product.create({
            data: {
                ...productData,
                variants: {
                    create: variants,
                },
                discounts: discountIds
                    ? {
                          create: discountIds.map((discountId: string) => ({
                              discountId,
                          })),
                      }
                    : undefined,
                categories: categoryIds
                    ? {
                          create: categoryIds.map((categoryId: string) => ({
                              categoryId,
                          })),
                      }
                    : undefined,
            },
            include: {
                variants: true,
                discounts: { include: { discount: true } },
                categories: { include: { category: true } },
            },
        });
    }

    static async update(id: string, data: UpdateProductDto) {
        await this.getById(id);

        const { variants, discountIds, categoryIds, ...productData } = data as any;

        await prisma.product.update({
            where: { id },
            data: productData,
        });

        if (variants) {
            await prisma.productVariant.deleteMany({ where: { productId: id } });

            await prisma.product.update({
                where: { id },
                data: {
                    variants: {
                        create: variants,
                    },
                },
            });
        }

        if (discountIds) {
            await prisma.discountProduct.deleteMany({ where: { productId: id } });

            await prisma.product.update({
                where: { id },
                data: {
                    discounts: {
                        create: discountIds.map((discountId: string) => ({
                            discountId,
                        })),
                    },
                },
            });
        }

        if (categoryIds) {
            await prisma.productCategory.deleteMany({ where: { productId: id } });

            await prisma.product.update({
                where: { id },
                data: {
                    categories: {
                        create: categoryIds.map((categoryId: string) => ({
                            categoryId,
                        })),
                    },
                },
            });
        }

        return this.getById(id);
    }

    static async delete(id: string) {
        await this.getById(id);

        await prisma.productVariant.deleteMany({ where: { productId: id } });
        await prisma.rating.deleteMany({ where: { productId: id } });
        await prisma.favorite.deleteMany({ where: { productId: id } });
        await prisma.discountProduct.deleteMany({ where: { productId: id } });
        await prisma.productView.deleteMany({ where: { productId: id } });
        await prisma.productCategory.deleteMany({ where: { productId: id } });

        return prisma.product.delete({ where: { id } });
    }
}

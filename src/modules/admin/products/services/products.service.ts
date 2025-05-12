import { prisma } from '../../../../core/db';
import { CreateProductDto, UpdateProductDto } from '../dto/products.schema';
import { NotFoundError } from '../../../../core/errors/AppError';
import { calculateFinalPrice } from '../../../../core/utils/pricing.util';

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
        const { variants, discountIds, categoryIds, ...productData } = data;

        console.log(data);

        // Создание продукта
        const product = await prisma.product.create({
            data: {
                ...productData,
                variants: {
                    create: variants,
                },
            },
            include: {
                variants: true,
            },
        });

        // Привязка категорий
        if (categoryIds?.length) {
            await prisma.productCategory.createMany({
                data: categoryIds.map((categoryId: string) => ({
                    productId: product.id,
                    categoryId: categoryId,
                })),
            });
        }

        // Привязка скидок
        if (discountIds?.length) {
            await prisma.discountProduct.createMany({
                data: discountIds.map((discountId: string) => ({
                    productId: product.id,
                    discountId: discountId,
                })),
            });
        }

        // Возвращаем продукт с категориями и скидками
        return this.getById(product.id);
    }

    static async update(id: string, data: UpdateProductDto) {
        await this.getById(id);

        const { variants, discountIds, categoryIds, ...productData } = data;

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

            await prisma.discountProduct.createMany({
                data: discountIds.map((discountId: string) => ({
                    productId: id,
                    discountId: discountId,
                })),
            });
        }

        if (categoryIds) {
            await prisma.productCategory.deleteMany({ where: { productId: id } });

            await prisma.productCategory.createMany({
                data: categoryIds.map((categoryId: string) => ({
                    productId: id,
                    categoryId: categoryId,
                })),
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

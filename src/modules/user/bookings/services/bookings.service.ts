import { prisma } from '../../../../core/db';
import { CreateBookingDto } from '../dto/bookings.schema';
import { calculateFinalPrice } from '../../../../core/utils/pricing.util';

export class UserBookingService {
    static async create(userId: string, dto: CreateBookingDto) {
        const { items, promoCode, comment } = dto;

        const promo = promoCode
            ? await prisma.promoCode.findFirst({
                  where: {
                      code: promoCode,
                      active: true,
                      startsAt: { lte: new Date() },
                      endsAt: { gte: new Date() },
                  },
              })
            : null;

        const booking = await prisma.booking.create({
            data: {
                userId,
                comment,
                promoCodeId: promo?.id,
                items: {
                    create: await Promise.all(
                        items.map(async ({ variantId, quantity }) => {
                            const variant = await prisma.productVariant.findUnique({
                                where: { id: variantId },
                                include: {
                                    product: {
                                        include: { discounts: { include: { discount: true } } },
                                    },
                                },
                            });

                            if (!variant) throw new Error('Вариант товара не найден');

                            const price = calculateFinalPrice(
                                variant.price,
                                variant.product.discounts,
                            );

                            return {
                                variantId,
                                quantity,
                                priceSnapshot: price,
                            };
                        }),
                    ),
                },
                statusHistory: {
                    create: {
                        status: 'PENDING',
                    },
                },
            },
            include: {
                items: { include: { variant: true } },
                statusHistory: true,
            },
        });

        if (promo) {
            await prisma.promoCodeRedemption.create({
                data: {
                    userId,
                    promoCodeId: promo.id,
                    bookingId: booking.id,
                },
            });

            await prisma.promoCode.update({
                where: { id: promo.id },
                data: { usedCount: { increment: 1 } },
            });
        }

        return booking;
    }

    static async getAll(userId: string) {
        return prisma.booking.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        variant: {
                            include: { product: true },
                        },
                    },
                },
                promoCode: true,
                statusHistory: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    static async getById(userId: string, id: string) {
        const booking = await prisma.booking.findFirst({
            where: { id, userId },
            include: {
                items: {
                    include: {
                        variant: {
                            include: { product: true },
                        },
                    },
                },
                promoCode: true,
                statusHistory: true,
            },
        });

        if (!booking) throw new Error('Бронь не найдена');
        return booking;
    }
}

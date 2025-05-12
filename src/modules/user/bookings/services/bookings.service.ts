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
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
                promoCode: true,
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

        return this.formatBookingResponse(booking);
    }

    static async getAll(userId: string) {
        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
                promoCode: true,
                statusHistory: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        console.log(bookings.map(this.formatBookingResponse));

        return bookings.map(this.formatBookingResponse);
    }

    static async getById(userId: string, id: string) {
        const booking = await prisma.booking.findFirst({
            where: { id, userId },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
                promoCode: true,
                statusHistory: true,
            },
        });

        if (!booking) throw new Error('Бронь не найдена');
        return this.formatBookingResponse(booking);
    }

    static async delete(userId: string, bookingId: string) {
        const booking = await prisma.booking.findFirst({
            where: { id: bookingId, userId },
        });

        if (!booking) {
            throw new Error('Бронирование не найдено или у вас нет доступа');
        }

        // Удаляем связанные элементы (BookingItem и BookingStatusHistory)
        await prisma.bookingItem.deleteMany({
            where: { bookingId },
        });

        await prisma.bookingStatusHistory.deleteMany({
            where: { bookingId },
        });

        // Удаляем саму бронь
        await prisma.booking.delete({
            where: { id: bookingId },
        });
    }

    // ✅ Форматирование ответа
    static formatBookingResponse(booking: any) {
        return {
            id: booking.id,
            status: booking.status,
            comment: booking.comment,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
            promoCode: booking.promoCode
                ? {
                      code: booking.promoCode.code,
                      type: booking.promoCode.discount?.type,
                      value: booking.promoCode.discount?.value,
                  }
                : null,
            items: booking.items.map((item: any) => ({
                id: item.id,
                quantity: item.quantity,
                priceSnapshot: item.priceSnapshot,
                variant: {
                    id: item.variant.id,
                    sku: item.variant.sku,
                    size: item.variant.size,
                    color: item.variant.color,
                    price: item.variant.price,
                    images: item.variant.images,
                    product: {
                        id: item.variant.product.id,
                        name: item.variant.product.name,
                        description: item.variant.product.description,
                        basePrice: item.variant.product.basePrice,
                    },
                },
            })),
            statusHistory: booking.statusHistory.map((history: any) => ({
                id: history.id,
                status: history.status,
                comment: history.comment,
                changedAt: history.changedAt,
            })),
        };
    }
}

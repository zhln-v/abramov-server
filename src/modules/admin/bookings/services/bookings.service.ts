import { prisma } from '../../../../core/db';
import { NotFoundError } from '../../../../core/errors/AppError';
import { BookingStatus } from '@prisma/client';

export class BookingService {
    static async getAll() {
        return prisma.booking.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: true,
                items: {
                    include: {
                        variant: {
                            include: { product: true },
                        },
                    },
                },
                statusHistory: true,
                promoCode: true,
            },
        });
    }

    static async getById(id: string) {
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                user: true,
                items: {
                    include: {
                        variant: {
                            include: { product: true },
                        },
                    },
                },
                statusHistory: true,
                promoCode: true,
            },
        });

        if (!booking) throw new NotFoundError('Бронь не найдена');
        return booking;
    }

    static async getByStatus(status: BookingStatus) {
        return prisma.booking.findMany({
            where: { status },
            orderBy: { createdAt: 'desc' },
            include: {
                user: true,
                items: {
                    include: {
                        variant: {
                            include: { product: true },
                        },
                    },
                },
                statusHistory: true,
                promoCode: true,
            },
        });
    }

    static async updateStatus(id: string, status: BookingStatus, comment?: string) {
        const booking = await this.getById(id);

        await prisma.bookingStatusHistory.create({
            data: {
                bookingId: id,
                status,
                comment,
            },
        });

        return prisma.booking.update({
            where: { id },
            data: {
                status,
                comment,
            },
        });
    }
}

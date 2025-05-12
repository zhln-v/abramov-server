import { Request, Response } from 'express';
import { BookingService } from '../services/bookings.service';
import { updateBookingStatusSchema } from '../dto/bookings.schema';
import { BookingStatus } from '@prisma/client';

export class BookingController {
    static async getAll(req: Request, res: Response) {
        const bookings = await BookingService.getAll();
        res.json(bookings);
    }

    static async getById(req: Request, res: Response) {
        const booking = await BookingService.getById(req.params.id);
        res.json(booking);
    }

    static async getByStatus(req: Request, res: Response) {
        const { status } = req.params;

        // Проверяем, что статус существует в Enum
        if (!Object.values(BookingStatus).includes(status as BookingStatus)) {
            return res.status(400).json({ error: 'Некорректный статус бронирования' });
        }

        const bookings = await BookingService.getByStatus(status as BookingStatus);
        res.json(bookings);
    }

    static async updateStatus(req: Request, res: Response) {
        const parsed = updateBookingStatusSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json(parsed.error);
        }

        const updated = await BookingService.updateStatus(
            req.params.id,
            parsed.data.status,
            parsed.data.comment,
        );

        res.json(updated);
    }
}

import { Request, Response } from 'express';
import { createBookingSchema } from '../dto/bookings.schema';
import { UserBookingService } from '../services/bookings.service';

export class UserBookingController {
    static async create(req: Request, res: Response) {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const parsed = createBookingSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json(parsed.error);
        }

        const booking = await UserBookingService.create(req.user.id, parsed.data);
        res.status(201).json(booking);
    }

    static async getAll(req: Request, res: Response) {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const bookings = await UserBookingService.getAll(req.user.id);
        res.json(bookings);
    }

    static async getById(req: Request, res: Response) {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const booking = await UserBookingService.getById(req.user.id, req.params.id);
        res.json(booking);
    }

    static async delete(req: Request, res: Response) {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const bookingId = req.params.id;

        try {
            await UserBookingService.delete(req.user.id, bookingId);
            res.status(204).send();
        } catch (error: any) {
            console.error('Ошибка при удалении бронирования:', error.message);
            res.status(500).json({ message: 'Не удалось удалить бронирование.' });
        }
    }
}

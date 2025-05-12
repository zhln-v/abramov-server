import { z } from 'zod';

export const updateBookingStatusSchema = z.object({
    status: z.enum(['CONFIRMED', 'CANCELED', 'RECEIVED']),
    comment: z.string().optional(),
});

export type UpdateBookingStatusDto = z.infer<typeof updateBookingStatusSchema>;

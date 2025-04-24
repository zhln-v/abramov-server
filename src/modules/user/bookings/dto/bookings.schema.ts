import { z } from 'zod';

export const createBookingSchema = z.object({
    items: z.array(
        z.object({
            variantId: z.string(),
            quantity: z.number().min(1),
        }),
    ),
    promoCode: z.string().optional(),
    comment: z.string().optional(),
});

export type CreateBookingDto = z.infer<typeof createBookingSchema>;

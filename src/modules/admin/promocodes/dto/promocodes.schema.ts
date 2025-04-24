import { z } from 'zod';

export const createPromoCodeSchema = z.object({
    code: z.string().min(3),
    discountId: z.string().cuid(),
    usageLimit: z.number().int().positive().optional(),
    active: z.boolean().optional(),
    startsAt: z.string().datetime().optional(),
    endsAt: z.string().datetime().optional(),
});

export const updatePromoCodeSchema = createPromoCodeSchema.partial();

export type CreatePromoCodeDto = z.infer<typeof createPromoCodeSchema>;
export type UpdatePromoCodeDto = z.infer<typeof updatePromoCodeSchema>;

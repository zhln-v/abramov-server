import { z } from 'zod';

export const createDiscountSchema = z.object({
    name: z.string().min(1),
    type: z.enum(['PERCENT', 'FIXED']),
    value: z.number().positive(),
    active: z.boolean().optional(),
    startsAt: z.string().datetime().optional(),
    endsAt: z.string().datetime().optional(),
    productIds: z.array(z.string().uuid()).optional(),
    categoryIds: z.array(z.string().uuid()).optional(),
});

export const updateDiscountSchema = createDiscountSchema.partial();

export type CreateDiscountDto = z.infer<typeof createDiscountSchema>;
export type UpdateDiscountDto = z.infer<typeof updateDiscountSchema>;

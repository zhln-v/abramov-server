import { z } from 'zod';

export const rateProductSchema = z.object({
    value: z.number().min(1).max(5),
});

export type RateProductDto = z.infer<typeof rateProductSchema>;

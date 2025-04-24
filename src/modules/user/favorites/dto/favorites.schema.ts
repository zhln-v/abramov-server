import { z } from 'zod';

export const productIdParamSchema = z.object({
    productId: z.string().cuid({ message: 'Невалидный UUID продукта' }),
});

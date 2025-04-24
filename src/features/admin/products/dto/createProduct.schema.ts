import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    price: z.number().nonnegative(),
    discountPrice: z.number().optional(),
    categoryId: z.string().optional(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;

import { z } from 'zod';

export const productVariantSchema = z.object({
    sku: z.string().min(1),
    size: z.string().optional(),
    color: z.string().optional(),
    price: z.number().nonnegative(),
    quantity: z.number().int().nonnegative(),
    images: z.array(z.string().url()),
});

export const createProductSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    basePrice: z.number().nonnegative(),
    categoryId: z.string().cuid(),
    discountIds: z.array(z.string().uuid()).optional(),
    variants: z.array(productVariantSchema),
});

export const updateProductSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    basePrice: z.number().optional(),
    categoryId: z.string().cuid().optional(),
    discountIds: z.array(z.string().uuid()).optional(),
    variants: z
        .array(
            productVariantSchema.extend({
                id: z.string().cuid().optional(),
            }),
        )
        .optional(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;

import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z.string().min(1, 'Название обязательно'),
    parentId: z.string().cuid().optional(),
});

export const updateCategorySchema = z.object({
    name: z.string().min(1).optional(),
    parentId: z.string().cuid().nullable().optional(),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;

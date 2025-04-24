import { z } from "zod";
import { paginationQuerySchema } from "../../../core/pagination/schema";

export const getAllProductsQuerySchema = paginationQuerySchema.extend({
    search: z.string().optional(),
    categoryId: z.string().optional(),
});

export type GetAllProductsQuery = z.infer<typeof getAllProductsQuerySchema>;

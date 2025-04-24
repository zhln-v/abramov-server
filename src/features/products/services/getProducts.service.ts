import { prisma } from "../../../core/db";
import {
    PaginationParams,
    PaginatedResponse,
} from "../../../core/pagination/types";
import { applyPagination } from "../../../core/pagination";
import { getPrismaPagination } from "../../../core/pagination/prisma";
import { GetAllProductsQuery } from "../dto/query.schema";

type GetProductsParams = GetAllProductsQuery & PaginationParams;

export const getProductsService = async (
    params: GetProductsParams
): Promise<PaginatedResponse<any>> => {
    const { search, categoryId, page, limit, sort, order } = params;

    const where: Record<string, any> = {};

    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            {
                characteristics: {
                    some: {
                        value: { contains: search, mode: "insensitive" },
                    },
                },
            },
        ];
    }

    if (categoryId) {
        where.categoryId = categoryId;
    }

    const paginationOptions = getPrismaPagination({ page, limit, sort, order });

    const [total, products] = await Promise.all([
        prisma.product.count({ where }),
        prisma.product.findMany({
            where,
            ...paginationOptions,
            include: {
                images: true,
                variations: true,
                characteristics: {
                    include: { characteristic: true },
                },
            },
        }),
    ]);

    return applyPagination(products, total, { page, limit });
};

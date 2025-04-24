import { PaginationParams } from "./types";

export const getPrismaPagination = (pagination: PaginationParams) => {
    const { page, limit, sort, order } = pagination;

    return {
        skip: (page - 1) * limit,
        take: limit,
        orderBy: sort ? { [sort]: order ?? "asc" } : undefined,
    };
};

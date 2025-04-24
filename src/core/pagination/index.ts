import { PaginationParams, PaginationMeta } from "./types";

export const applyPagination = <T>(
    items: T[],
    total: number,
    pagination: PaginationParams
): { data: T[]; meta: PaginationMeta } => {
    const { page, limit } = pagination;

    return {
        data: items,
        meta: {
            total,
            page,
            limit,
        },
    };
};

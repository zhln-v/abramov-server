export type PaginationParams = {
    page: number;
    limit: number;
    sort?: string;
    order?: "asc" | "desc";
};

export type PaginationMeta = {
    total: number;
    page: number;
    limit: number;
};

export type PaginatedResponse<T> = {
    data: T[];
    meta: PaginationMeta;
};

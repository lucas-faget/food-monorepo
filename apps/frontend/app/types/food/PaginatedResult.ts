export type PaginatedResult<T> = {
    data: T[];
    meta: {
        total: number;
        perPage: number;
        currentPage: number;
        firstPage?: number;
        lastPage?: number;
        firstPageUrl?: string | null;
        lastPageUrl?: string | null;
        previousPageUrl?: string | null;
        nextPageUrl?: string | null;
    };
};

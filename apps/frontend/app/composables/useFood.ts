import type { PaginatedResult, Product } from "~/types/food";

export const useFood = () => {
    const api = useApi();

    const getProduct = (barcode: string) => {
        return api<Product>(`/food/${barcode}`);
    };

    const search = (query: string, page: number = 1, perPage: number = 20) => {
        return api<PaginatedResult<Product>>("/food", {
            query: { q: query, page, page_size: perPage },
        });
    };

    return {
        getProduct,
        search,
    };
};

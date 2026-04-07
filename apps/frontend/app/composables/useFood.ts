import type { SearchResult, Product } from "~/types/food";

export const useFood = () => {
    const api = useApi();

    const getProduct = (barcode: string) => {
        return api<Product>(`/food/${barcode}`);
    };

    const search = (q: string, page = 1, pageSize = 20) => {
        return api<SearchResult>("/food", {
            query: { q, page, page_size: pageSize },
        });
    };

    return {
        getProduct,
        search,
    };
};

import type { PaginatedResult, Product } from "~/types/food";

export const useProduct = () => {
    const api = useApi();

    const getProducts = (page: number = 1, pageSize: number = 20) => {
        return api<PaginatedResult<Product>>("/products", {
            query: {
                page,
                page_size: pageSize,
            },
        });
    };

    const getProduct = (id: number) => {
        return api<Product>(`/products/${id}`);
    };

    const createProduct = (payload: Partial<Product>) => {
        return api<Product>("/products", {
            method: "POST",
            body: payload,
        });
    };

    const updateProduct = (id: number, payload: Partial<Product>) => {
        return api<Product>(`/products/${id}`, {
            method: "PUT",
            body: payload,
        });
    };

    const deleteProduct = (id: number) => {
        return api<void>(`/products/${id}`, {
            method: "DELETE",
        });
    };

    return {
        getProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
    };
};

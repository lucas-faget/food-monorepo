import type { PaginatedResult, Product } from "~/types/food";
import type { RequestOptions } from "~/types/RequestOptions";

export const useProduct = () => {
    const api = useApi();
    const { handle } = useApiRequest();

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

    const createProduct = (
        payload: Partial<Product>,
        options: RequestOptions<Product> = {
            successMessage: "Product created successfully",
            errorMessage: "Failed to create product",
        },
    ) => {
        return handle(
            () =>
                api<Product>("/products", {
                    method: "POST",
                    body: payload,
                }),
            options,
        );
    };

    const updateProduct = (id: number, payload: Partial<Product>) => {
        return handle(
            () =>
                api<Product>(`/products/${id}`, {
                    method: "PUT",
                    body: payload,
                }),
            {
                successMessage: "Product updated successfully",
                errorMessage: "Failed to update product",
            },
        );
    };

    const deleteProduct = (id: number) => {
        return handle(
            () =>
                api<void>(`/products/${id}`, {
                    method: "DELETE",
                }),
            {
                successMessage: "Product deleted successfully",
                errorMessage: "Failed to delete product",
            },
        );
    };

    return {
        getProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
    };
};

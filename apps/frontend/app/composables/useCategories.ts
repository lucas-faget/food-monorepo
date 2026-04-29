import type { Category } from "~/types/food";

export const useCategories = () => {
    const api = useApi();

    const getCategories = () => {
        return api<Category[]>("/categories");
    };

    return {
        getCategories,
    };
};

import type { Product } from "./Product";

export type SearchResult = {
    page: number;
    page_count: number;
    page_size: number;
    count: number;
    products: Product[];
};

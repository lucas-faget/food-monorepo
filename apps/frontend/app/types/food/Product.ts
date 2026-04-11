import type { Nutriments } from "./Nutriments";

export type Product = {
    id?: number;
    barcode: string | null;
    name: string;
    brand: string | null;
    categories: string | null;
    imageUrl: string | null;
    nutriments: Nutriments | null;
    createdAt?: string;
    updatedAt?: string;
};

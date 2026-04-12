import type { Nutrients } from "./Nutrients";

export type Product = {
    id?: number;
    barcode?: string | null;
    name: string;
    brand: string | null;
    categories: string | null;
    imageUrl: string | null;
    servingSize: number | null;
    servingSizeUnit: string | null;
    nutrients: Nutrients | null;
    nutriScore: string | null;
    createdAt?: string;
    updatedAt?: string;
};

import type { Nutriments } from "./Nutriments";

export type Product = {
    barcode: string;
    name: string;
    brand?: string;
    categories?: string;
    imageUrl?: string;
    nutriments?: Nutriments;
};

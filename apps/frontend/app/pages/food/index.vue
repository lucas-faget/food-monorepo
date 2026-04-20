<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { useClipboard } from "@vueuse/core";
import type { Product } from "~/types/food";

const toast = useToast();
const { copy } = useClipboard();

const query = ref<string>("");
const page = ref<number>(1);
const perPage = ref<number>(20);

// For local dev only
// const { data, pending } = useFetch("products.json");

const { search } = useFood();

const { data, pending } = useAsyncData(
    () => `food-${query.value}-${page.value}-${perPage.value}`,
    () => search(query.value, page.value, perPage.value),
);

const products = computed<Product[]>(() => data.value?.data ?? []);
const total = computed<number>(() => data.value?.meta?.total ?? 0);

const actions = (product: Product): DropdownMenuItem[] => [
    {
        label: "Add product",
        icon: "i-lucide-shopping-basket",
    },
    {
        label: "View product details",
        icon: "i-lucide-eye",
    },
    {
        label: "Copy barcode",
        icon: "i-lucide-copy",
        onSelect() {
            copy(product.barcode);

            toast.add({
                title: "Barcode copied to clipboard!",
                color: "success",
                icon: "i-lucide-circle-check",
            });
        },
    },
];
</script>

<template>
    <ProductTable
        productKey="barcode"
        :products
        :total
        v-model:query="query"
        v-model:page="page"
        v-model:perPage="perPage"
        :actions
        :loading="pending"
    />
</template>

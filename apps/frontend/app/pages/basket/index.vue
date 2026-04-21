<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import type { Product } from "~/types/food";

definePageMeta({
    actions: ["createProduct"],
});

const { deleteProduct } = useProduct();

const query = ref<string>("");
const page = ref<number>(1);
const perPage = ref<number>(20);

const { getProducts } = useProduct();

const { data, pending, refresh } = useAsyncData(
    () => `food-${page.value}-${perPage.value}`,
    () => getProducts(page.value, perPage.value),
);

const products = computed<Product[]>(() => data.value?.data ?? []);
const total = computed<number>(() => data.value?.meta?.total ?? 0);

const actions = (product: Product): DropdownMenuItem[] => [
    {
        label: "New intake",
        icon: "i-lucide-plus",
    },
    {
        label: "View product details",
        icon: "i-lucide-eye",
    },
    {
        label: "Delete product",
        icon: "i-lucide-trash-2",
        color: "error",
        async onSelect() {
            if (!product.id) return;
            await deleteProduct(product.id);
            await refresh();
        },
    },
];
</script>

<template>
    <ProductTable
        productKey="id"
        :products
        :total
        v-model:query="query"
        v-model:page="page"
        v-model:perPage="perPage"
        :actions
        :loading="pending"
    />
</template>

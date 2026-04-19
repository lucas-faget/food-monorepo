<script setup lang="ts">
import type { Product } from "~/types/food";

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
</script>

<template>
    <ProductTable
        productKey="barcode"
        :products
        :total
        v-model:query="query"
        v-model:page="page"
        v-model:perPage="perPage"
        :loading="pending"
    />
</template>

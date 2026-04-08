<script setup lang="ts">
import type { Product } from "~/types/food";

const query = ref<string>("");
const page = ref<number>(1);
const pageSize = ref<number>(20);

// For local dev only
// const { data, pending } = useFetch("products.json");

const { search } = useFood();

const { data, pending } = useAsyncData(
    () => `food-${query.value}-${page.value}-${pageSize.value}`,
    () => search(query.value, page.value, pageSize.value),
    {
        watch: [query, page, pageSize],
    },
);

const products = computed<Product[]>(() => data.value?.products ?? []);
const count = computed<number>(() => data.value?.count ?? 0);
</script>

<template>
    <FoodTable
        :products="products"
        v-model:query="query"
        v-model:page="page"
        v-model:page-size="pageSize"
        v-model:count="count"
        :loading="pending"
    />
</template>

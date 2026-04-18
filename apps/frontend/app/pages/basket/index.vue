<script setup lang="ts">
import type { Product } from "~/types/food";

definePageMeta({
    actions: ["createProduct"],
});

const query = ref<string>("");
const page = ref<number>(1);
const perPage = ref<number>(20);

const { getProducts } = useProduct();

const { data, pending } = useAsyncData(
    () => `food-${page.value}-${perPage.value}`,
    () => getProducts(page.value, perPage.value),
);

const products = computed<Product[]>(() => data.value?.data ?? []);
const total = computed<number>(() => data.value?.meta?.total ?? 0);
</script>

<template>
    <ProductTable
        :products
        :total
        v-model:query="query"
        v-model:page="page"
        v-model:perPage="perPage"
        :loading="pending"
    />
</template>

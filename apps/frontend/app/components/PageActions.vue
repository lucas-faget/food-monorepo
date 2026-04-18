<script setup lang="ts">
const route = useRoute();

const actions = computed(() => {
    return (route.meta.actions as string[]) || [];
});
</script>

<template>
    <CreateProductModal v-if="actions.includes('createProduct')" />
</template>

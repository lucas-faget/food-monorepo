<script setup lang="ts"></script>

<template>
    <UModal title="Create a product" scrollable>
        <UButton label="New product" icon="i-lucide-plus" />

        <template #body>
            <ProductForm />
        </template>
    </UModal>
</template>

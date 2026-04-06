<script setup lang="ts">
const { breadcrumb } = useNav();
</script>

<template>
    <UBreadcrumb :items="breadcrumb" />
</template>

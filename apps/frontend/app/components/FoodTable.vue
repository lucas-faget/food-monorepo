<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import { useClipboard } from "@vueuse/core";
import { upperFirst } from "scule";
import type { Product } from "~/types/food";

const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const toast = useToast();
const { copy } = useClipboard();

const props = withDefaults(
    defineProps<{
        products: Product[];
        query: string;
        page: number;
        pageSize: number;
        count: number;
        loading?: boolean;
    }>(),
    {
        loading: false,
    },
);

const q = defineModel<string>("query");
const p = defineModel<number>("page");
const ps = defineModel<number>("pageSize");
const c = defineModel<number>("count");

const table = useTemplateRef("table");

const columns: TableColumn<Product>[] = [
    {
        accessorKey: "barcode",
        header: "#",
        cell: ({ row }) => `#${row.getValue("barcode")}`,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => row.getValue("name"),
    },
    {
        accessorKey: "brand",
        header: "Brand",
        cell: ({ row }) => row.getValue("brand"),
    },
    {
        id: "category",
        accessorKey: "categories",
        header: "Category",
        cell: ({ row }) => {
            const value = row.getValue("category") as string;
            const [category] = value.split(",");
            if (!category) return null;
            return h(
                UBadge,
                {
                    class: "capitalize",
                    variant: "subtle",
                    color: "neutral",
                },
                () => category.trim(),
            );
        },
    },
    {
        id: "actions",
        meta: {
            class: {
                td: "text-right",
            },
        },
        cell: ({ row }) => {
            return h(
                UDropdownMenu,
                {
                    content: {
                        align: "end",
                    },
                    items: getRowItems(row),
                    "aria-label": "Actions dropdown",
                },
                () =>
                    h(UButton, {
                        icon: "i-lucide-ellipsis-vertical",
                        color: "neutral",
                        variant: "ghost",
                        "aria-label": "Actions dropdown",
                    }),
            );
        },
    },
];

function getRowItems(row: Row<Product>) {
    return [
        {
            type: "label",
            label: "Actions",
        },
        {
            label: "Copy barcode",
            icon: "i-lucide-copy",
            onSelect() {
                copy(row.original.barcode);

                toast.add({
                    title: "Barcode copied to clipboard!",
                    color: "success",
                    icon: "i-lucide-circle-check",
                });
            },
        },
        {
            type: "separator",
        },
        {
            label: "View product details",
            icon: "i-lucide-eye",
        },
        {
            label: "Add to my products",
            icon: "i-lucide-shopping-basket",
        },
    ];
}

const pageSizeItems = ref<number[]>([5, 10, 20, 50, 100]);
</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <UInput v-model="q" :loading icon="i-lucide-search" size="lg" placeholder="Search food..." />
            </div>
            <div class="flex items-center">
                <UDropdownMenu
                    :items="
                        table?.tableApi
                            ?.getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => ({
                                label: upperFirst(column.id),
                                type: 'checkbox' as const,
                                checked: column.getIsVisible(),
                                onUpdateChecked(checked: boolean) {
                                    table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked);
                                },
                                onSelect(e: Event) {
                                    e.preventDefault();
                                },
                            }))
                    "
                    :content="{ align: 'end' }"
                >
                    <UButton label="Columns" color="neutral" variant="outline" trailing-icon="i-lucide-chevron-down" />
                </UDropdownMenu>
            </div>
        </div>
        <UTable ref="table" :data="products" :columns="columns" :loading="loading" class="flex-1" />
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <USelect v-model="ps" :items="pageSizeItems" />
                <span>products per page</span>
            </div>
            <div class="flex items-center gap-4">
                <UPagination v-model:page="p" :items-per-page="ps" :total="c" size="lg" />
            </div>
        </div>
    </div>
</template>

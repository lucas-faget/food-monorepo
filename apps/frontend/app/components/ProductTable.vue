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
        productKey: "barcode" | "id";
        products: Product[];
        total: number;
        loading?: boolean;
    }>(),
    {
        loading: false,
    },
);

console.log(props.productKey);

const query = defineModel<string>("query");
const page = defineModel<number>("page");
const perPage = defineModel<number>("perPage");

watch([query, perPage], () => {
    page.value = 1;
});

const table = useTemplateRef("table");

const tab = ref<"list" | "grid">("list");

const columnVisibility = ref({
    barcode: false,
    image: true,
});

const barcodeColumn: TableColumn<Product> = {
    accessorKey: "barcode",
    header: "#",
    cell: ({ row }: { row: Row<Product> }) => row.getValue("barcode"),
};

const columns: TableColumn<Product>[] = [
    ...(props.productKey === "barcode" ? [barcodeColumn] : []),
    {
        id: "image",
        accessorKey: "imageUrl",
        header: "Image",
        cell: ({ row }) => {
            const url = row.getValue("image") as string;
            if (!url) return h("div");
            return h("img", {
                src: url,
                alt: row.getValue("name"),
                class: "min-w-12 w-16 h-16 object-cover object-center rounded cursor-pointer hover:scale-110 transition",
                onClick: () => openPreview(url),
            });
        },
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
            const value = row.getValue("category");
            if (!value || typeof value !== "string") {
                return h("div");
            }
            const [category] = value.split(",");
            if (!category) {
                return h("div");
            }
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
                    items: getRowItems(row.original),
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

function getMainItem(product: Product) {
    switch (props.productKey) {
        case "barcode":
            return {
                label: "Add product",
                icon: "i-lucide-shopping-basket",
            };
        case "id":
            return {
                label: "New intake",
                icon: "i-lucide-plus",
            };
    }
}

function getCopyBarcodeItem(product: Product) {
    return {
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
    };
}

function getDeleteItem() {
    return {
        label: "Delete product",
        icon: "i-lucide-trash-2",
        color: "error",
    };
}

function getRowItems(product: Product) {
    return [
        {
            type: "label",
            label: "Actions",
        },
        ...(tab.value === "list" ? [getMainItem(product), { type: "separator" }] : []),
        {
            label: "View product details",
            icon: "i-lucide-eye",
        },
        ...(props.productKey === "barcode" ? [getCopyBarcodeItem(product)] : [getDeleteItem()]),
    ];
}

const pageSizes = ref<number[]>([5, 10, 20, 50, 100]);

const imageModalOpen = ref<boolean>(false);
const previewImageUrl = ref<string | null>(null);

function openPreview(url: string) {
    imageModalOpen.value = true;
    previewImageUrl.value = url;
}
</script>

<template>
    <UModal v-model:open="imageModalOpen" :scrollable="true">
        <template #content>
            <img v-if="previewImageUrl" :src="previewImageUrl" class="rounded-lg" alt="Preview image" />
        </template>
    </UModal>

    <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <UInput v-model="query" :loading icon="i-lucide-search" size="lg" placeholder="Search food..." />
            </div>
            <div class="flex items-center gap-2.5">
                <UTabs
                    v-model="tab"
                    :items="[
                        { value: 'list', icon: 'i-lucide-list' },
                        { value: 'grid', icon: 'i-lucide-layout-grid' },
                    ]"
                    size="sm"
                    class="h-9"
                />
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
        <div v-if="tab === 'grid'" class="flex flex-wrap gap-4">
            <UPageCard
                v-for="(product, index) in products"
                :key="product[productKey] ?? index"
                :title="product.name"
                :description="product.brand ?? ''"
                reverse
                spotlight
                class="w-56"
                :ui="{ footer: 'w-full' }"
            >
                <template #footer>
                    <div class="flex min-w-0 items-center gap-2.5">
                        <UButton :icon="getMainItem(product).icon" block>{{ getMainItem(product).label }}</UButton>
                        <UDropdownMenu :items="getRowItems(product)">
                            <UButton icon="i-lucide-ellipsis-vertical" variant="outline" />
                        </UDropdownMenu>
                    </div>
                </template>
                <img
                    v-if="product.imageUrl"
                    :src="product.imageUrl"
                    :alt="product.name"
                    class="aspect-square w-full rounded object-cover"
                />
            </UPageCard>
        </div>
        <UTable
            v-else
            ref="table"
            v-model:column-visibility="columnVisibility"
            :data="products"
            :columns="columns"
            :loading="loading"
            class="flex-1"
        />
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <USelect v-model="perPage" :items="pageSizes" />
                <span>products per page</span>
            </div>
            <div class="flex items-center gap-4">
                <UPagination v-model:page="page" :items-per-page="perPage" :total="total" size="lg" />
            </div>
        </div>
    </div>
</template>

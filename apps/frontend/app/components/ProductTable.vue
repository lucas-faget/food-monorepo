<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { DropdownMenuItem, TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import { watchDebounced } from "@vueuse/core";
import { upperFirst } from "scule";
import type { Product } from "~/types/food";

const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const props = withDefaults(
    defineProps<{
        productKey: "barcode" | "id";
        products: Product[];
        total: number;
        mainAction?: DropdownMenuItem;
        actions?: (product: Product) => DropdownMenuItem[];
        loading?: boolean;
    }>(),
    {
        loading: false,
    },
);

const query = defineModel<string>("query");
const page = defineModel<number>("page");
const perPage = defineModel<number>("perPage");

const q = ref(query.value);

watch([query, perPage], () => {
    page.value = 1;
});

watchDebounced(
    q,
    (value: string) => {
        query.value = value;
    },
    { debounce: 500 },
);

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

const actionsColumn: TableColumn<Product> = {
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
    ...(props.actions ? [actionsColumn] : []),
];

const getMainAction = (product: Product): DropdownMenuItem | null => {
    return props.actions?.(product)?.[0] ?? null;
};

const getRowItems = (product: Product): DropdownMenuItem[] => {
    const items = props.actions?.(product) ?? [];
    if (items.length === 0) return [];

    return [
        {
            type: "label",
            label: "Actions",
        },
        {
            type: "separator",
        },
        ...(tab.value === "grid" ? items.slice(1) : items),
    ];
};

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
                <UInput v-model="q" :loading icon="i-lucide-search" size="lg" placeholder="Search food..." />
            </div>
            <div class="flex items-center gap-2.5">
                <UDropdownMenu
                    v-if="tab === 'list'"
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
                <UTabs
                    v-model="tab"
                    :items="[
                        { value: 'list', icon: 'i-lucide-list' },
                        { value: 'grid', icon: 'i-lucide-layout-grid' },
                    ]"
                    size="sm"
                    class="h-9"
                />
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
                        <UButton
                            v-if="getMainAction(product)"
                            :icon="getMainAction(product)?.icon"
                            block
                            @click="(e: Event) => getMainAction(product)?.onSelect?.(e)"
                        >
                            {{ getMainAction(product)?.label }}
                        </UButton>
                        <UDropdownMenu v-if="actions" :items="getRowItems(product)">
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

<script setup lang="ts">
import * as v from "valibot";
import type { Nutrients, Product } from "~/types/food";

const { createProduct } = useProduct();
const { getCategories } = useCategories();

const tab = ref<"product" | "nutrients">("product");
const servingTab = ref<"serving" | "quantity_100">("serving");

const units: string[] = ["g", "mL"];
const nutriScores: string[] = ["a", "b", "c", "d", "e"];
const nutriScoreColors = {
    a: "bg-green-500",
    b: "bg-lime-500",
    c: "bg-yellow-500",
    d: "bg-orange-500",
    e: "bg-red-500",
};

const { data, pending } = await useAsyncData("categories", () => getCategories());
const categories = computed<string[]>(() => data.value?.map((c) => c.name) || []);

/**
 * Form state
 */
const state = reactive({
    name: "",
    brand: "",
    categories: null,
    imageUrl: "",
    nutriScore: undefined,
    servingSize: 100,
    servingSizeUnit: "g",
    nutrients: {
        energy_kcal: 0,
        energy_kcal_100: 0,
        energy_kj: 0,
        energy_kj_100: 0,
        fat: 0,
        fat_100: 0,
        saturated_fat: undefined,
        saturated_fat_100: undefined,
        carbohydrates: 0,
        carbohydrates_100: 0,
        sugars: undefined,
        sugars_100: undefined,
        proteins: 0,
        proteins_100: 0,
        fiber: undefined,
        fiber_100: undefined,
        salt: undefined,
        salt_100: undefined,
        sodium: undefined,
        sodium_100: undefined,
    },
});

/**
 * Valibot schema
 */
const schema = v.object({
    name: v.pipe(v.string(), v.minLength(1, "Name is required")),
    brand: v.string(),
    categories: v.nullable(v.union([v.string(), v.array(v.string())])),
    imageUrl: v.string(),
    nutriScore: v.optional(v.picklist(nutriScores, "Invalid Nutri-Score")),
    servingSize: v.pipe(v.number("Serving size is required"), v.minValue(1, "Serving size must > 0")),
    servingSizeUnit: v.picklist(units, "Invalid unit"),
    nutrients: v.object({
        energy_kcal: v.pipe(v.number("Energy (kcal) is required"), v.minValue(0, "Energy (kcal) must be \u2265 0")),
        energy_kcal_100: v.pipe(v.number("Energy (kcal) is required"), v.minValue(0, "Energy (kcal) must be \u2265 0")),
        energy_kj: v.pipe(v.number("Energy (kcal) is required"), v.minValue(0, "Energy (kJ) must be \u2265 0")),
        energy_kj_100: v.pipe(v.number("Energy (kcal) is required"), v.minValue(0, "Energy (kJ) must be \u2265 0")),
        fat: v.pipe(v.number("Fat is required"), v.minValue(0, "Fat must be ≥ 0")),
        fat_100: v.pipe(v.number("Fat is required"), v.minValue(0, "Fat must be ≥ 0")),
        saturated_fat: v.optional(v.pipe(v.number(), v.minValue(0, "Saturated fat must be \u2265 0"))),
        saturated_fat_100: v.optional(v.pipe(v.number(), v.minValue(0, "Saturated fat must be \u2265 0"))),
        carbohydrates: v.pipe(v.number("Carbohydrates is required"), v.minValue(0, "Carbohydrates must be \u2265 0")),
        carbohydrates_100: v.pipe(
            v.number("Carbohydrates is required"),
            v.minValue(0, "Carbohydrates must be \u2265 0"),
        ),
        sugars: v.optional(v.pipe(v.number(), v.minValue(0, "Sugars must be \u2265 0"))),
        sugars_100: v.optional(v.pipe(v.number(), v.minValue(0, "Sugars must be \u2265 0"))),
        proteins: v.pipe(v.number("Proteins is required"), v.minValue(0, "Proteins must be \u2265 0")),
        proteins_100: v.pipe(v.number("Proteins is required"), v.minValue(0, "Proteins must be \u2265 0")),
        fiber: v.optional(v.pipe(v.number(), v.minValue(0, "Fiber must be \u2265 0"))),
        fiber_100: v.optional(v.pipe(v.number(), v.minValue(0, "Fiber must be \u2265 0"))),
        salt: v.optional(v.pipe(v.number(), v.minValue(0, "Salt must be \u2265 0"))),
        salt_100: v.optional(v.pipe(v.number(), v.minValue(0, "Salt must be \u2265 0"))),
        sodium: v.optional(v.pipe(v.number(), v.minValue(0, "Sodium must be \u2265 0"))),
        sodium_100: v.optional(v.pipe(v.number(), v.minValue(0, "Sodium must be \u2265 0"))),
    }),
});

/**
 * Nutrient fields config
 */
const nutrimentFields = [
    { key: "energy_kcal", key100: "energy_kcal_100", label: "Energy (kcal)", unit: "kcal", required: true },
    { key: "energy_kj", key100: "energy_kj_100", label: "Energy (kJ)", unit: "kJ", required: true },
    { key: "fat", key100: "fat_100", label: "Fat", unit: "g", required: true },
    { key: "saturated_fat", key100: "saturated_fat_100", label: "Saturated fat", unit: "g", required: false },
    { key: "carbohydrates", key100: "carbohydrates_100", label: "Carbohydrates", unit: "g", required: true },
    { key: "sugars", key100: "sugars_100", label: "Sugars", unit: "g", required: false },
    { key: "proteins", key100: "proteins_100", label: "Proteins", unit: "g", required: true },
    { key: "fiber", key100: "fiber_100", label: "Fiber", unit: "g", required: false },
    { key: "salt", key100: "salt_100", label: "Salt", unit: "g", required: false },
    { key: "sodium", key100: "sodium_100", label: "Sodium", unit: "g", required: false },
];

/**
 * Submit
 */
const onSubmit = async (event: any) => {
    const payload: Partial<Product> = {
        ...event.data,
        categories: Array.isArray(event.data.categories) ? event.data.categories.join(",") : event.data.categories,
        imageUrl: event.data.imageUrl ? `https://${event.data.imageUrl}` : "",
        nutrients: Object.fromEntries(Object.entries(event.data.nutrients).filter(([_, value]) => value !== undefined)),
    };

    await createProduct(payload);
};
</script>

<template>
    <UForm :state="state" :schema="schema" class="flex flex-col gap-4" @submit="onSubmit">
        <!-- Tabs -->
        <UTabs
            variant="link"
            v-model="tab"
            :items="[
                { label: 'Product', value: 'product', icon: 'i-lucide-package' },
                { label: 'Nutrients', value: 'nutrients', icon: 'i-lucide-sliders-horizontal' },
            ]"
            class="w-full"
        />

        <div class="flex-1 space-y-4">
            <!-- Product -->
            <div v-if="tab === 'product'" class="grid grid-cols-1 gap-4">
                <UFormField label="Name" name="name" required>
                    <UInput v-model="state.name" placeholder="Name" class="w-full" />
                </UFormField>

                <UFormField label="Brand" name="brand">
                    <UInput v-model="state.brand" placeholder="Brand" class="w-full" />
                </UFormField>

                <UFormField label="Category" name="categories">
                    <USelectMenu
                        v-model="state.categories"
                        placeholder="Select category"
                        :items="categories"
                        :loading="pending"
                        clear
                        class="w-full"
                    />
                </UFormField>

                <UFormField label="Image" name="imageUrl">
                    <UFieldGroup class="w-full">
                        <UBadge color="neutral" variant="subtle" size="lg" label="https://" />
                        <UInput v-model="state.imageUrl" placeholder="www.example.com" class="flex-1" />
                    </UFieldGroup>
                </UFormField>

                <UFormField label="Nutri-score" name="nutriScore">
                    <UTabs
                        v-model="state.nutriScore"
                        :items="
                            nutriScores.map((nutriScore) => ({
                                label: nutriScore.toUpperCase(),
                                value: nutriScore,
                            }))
                        "
                        :ui="{
                            indicator: state.nutriScore ? nutriScoreColors[state.nutriScore] : 'bg-primary',
                        }"
                        size="xl"
                        class="w-fit"
                    />
                </UFormField>
            </div>

            <!-- Nutrients -->
            <div v-else class="flex flex-col gap-6">
                <UFormField label="Serving size" name="servingSize" required>
                    <UFieldGroup class="w-full">
                        <UInputNumber v-model="state.servingSize" class="flex-1" />
                        <USelect v-model="state.servingSizeUnit" :items="units" variant="subtle" />
                    </UFieldGroup>
                </UFormField>

                <UTabs
                    v-model="servingTab"
                    :items="[
                        {
                            label: `per serving (${state.servingSize} ${state.servingSizeUnit})`,
                            value: 'serving',
                        },
                        {
                            label: `per 100 ${state.servingSizeUnit}`,
                            value: 'quantity_100',
                        },
                    ]"
                >
                    <template #content="{ item }">
                        <div class="mt-2 grid grid-cols-2 gap-4">
                            <UFormField
                                v-for="field in nutrimentFields"
                                :key="field.key"
                                :label="field.label"
                                :name="`nutrients.${item.value === 'serving' ? field.key : field.key100}`"
                                :required="field.required"
                            >
                                <UFieldGroup class="w-full">
                                    <UInput
                                        v-model="
                                            state.nutrients[
                                                `${item.value === 'serving' ? field.key : field.key100}` as keyof Nutrients
                                            ]
                                        "
                                        type="number"
                                        class="flex-1"
                                    />
                                    <UBadge color="neutral" variant="subtle" size="lg" :label="field.unit" />
                                </UFieldGroup>
                            </UFormField>
                        </div>
                    </template>
                </UTabs>
            </div>

            <div class="flex justify-end pt-4">
                <UButton type="submit" color="primary">Create</UButton>
            </div>
        </div>
    </UForm>
</template>

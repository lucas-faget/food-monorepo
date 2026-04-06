<script setup lang="ts">
import type { DropdownMenuItem, SidebarProps } from "@nuxt/ui";

const { sidebarOpen, navigationMenu, toggleSidebar } = useNav();
const colorMode = useColorMode();

defineProps<Pick<SidebarProps, "variant" | "collapsible" | "side">>();

const user = ref({
    name: "Lucas Faget",
    avatar: {
        src: "https://github.com/lucas-faget.png",
        alt: "Lucas Faget",
    },
});

const userItems = computed<DropdownMenuItem[][]>(() => [
    [
        {
            label: "Profile",
            icon: "i-lucide-user",
        },
        {
            label: "Settings",
            icon: "i-lucide-settings",
        },
    ],
    [
        {
            label: "Appearance",
            icon: "i-lucide-sun-moon",
            children: [
                {
                    label: "Light",
                    icon: "i-lucide-sun",
                    type: "checkbox",
                    checked: colorMode.value === "light",
                    onUpdateChecked(checked: boolean) {
                        if (checked) colorMode.preference = "light";
                    },
                    onSelect(e: Event) {
                        e.preventDefault();
                    },
                },
                {
                    label: "Dark",
                    icon: "i-lucide-moon",
                    type: "checkbox",
                    checked: colorMode.value === "dark",
                    onUpdateChecked(checked: boolean) {
                        if (checked) colorMode.preference = "dark";
                    },
                    onSelect(e: Event) {
                        e.preventDefault();
                    },
                },
            ],
        },
    ],
    [
        {
            label: "GitHub",
            icon: "i-simple-icons-github",
            to: "https://github.com/lucas-faget/food-monorepo",
            target: "_blank",
        },
        {
            label: "Log out",
            icon: "i-lucide-log-out",
        },
    ],
]);
</script>

<template>
    <div
        class="flex flex-1"
        :class="[variant === 'inset' && 'bg-neutral-50 dark:bg-neutral-950', side === 'right' && 'flex-row-reverse']"
    >
        <USidebar
            v-model:open="sidebarOpen"
            :variant="variant"
            :collapsible="collapsible"
            :side="side"
            :ui="{
                container: 'h-full',
            }"
        >
            <template #header>
                <UIcon name="i-simple-icons-nuxt" class="size-8" />
            </template>

            <template #default="{ state }">
                <UNavigationMenu
                    :key="state"
                    :items="navigationMenu"
                    orientation="vertical"
                    :ui="{ link: 'p-1.5 overflow-hidden' }"
                />
            </template>

            <template #footer>
                <UDropdownMenu
                    :items="userItems"
                    :content="{ align: 'center', collisionPadding: 12 }"
                    :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width) min-w-48' }"
                >
                    <UButton
                        v-bind="user"
                        :label="user?.name"
                        trailing-icon="i-lucide-chevrons-up-down"
                        color="neutral"
                        variant="ghost"
                        square
                        class="data-[state=open]:bg-elevated w-full overflow-hidden"
                        :ui="{
                            trailingIcon: 'text-dimmed ms-auto',
                        }"
                    />
                </UDropdownMenu>
            </template>
        </USidebar>

        <div
            class="peer-data-[variant=inset]:ring-default bg-default flex flex-1 flex-col overflow-hidden peer-data-[variant=inset]:m-4 peer-data-[variant=inset]:rounded-xl peer-data-[variant=inset]:shadow-sm peer-data-[variant=inset]:ring lg:peer-data-[variant=floating]:my-4 lg:peer-data-[variant=inset]:not-peer-data-[collapsible=offcanvas]:ms-0"
        >
            <div
                class="flex h-(--ui-header-height) shrink-0 items-center gap-6 px-4"
                :class="[variant !== 'floating' && 'border-default border-b', side === 'right' && 'justify-end']"
            >
                <UButton
                    :icon="side === 'left' ? 'i-lucide-panel-left' : 'i-lucide-panel-right'"
                    color="neutral"
                    variant="ghost"
                    aria-label="Toggle sidebar"
                    @click="toggleSidebar"
                />

                <Breadcrumb />
            </div>

            <div class="flex-1 p-4">
                <slot />
            </div>
        </div>
    </div>
</template>

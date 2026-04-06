import type { NavigationMenuItem, BreadcrumbItem } from "@nuxt/ui";

export const useNav = () => {
    const sidebarOpen = ref<boolean>(true);

    const navigationMenu = computed<NavigationMenuItem[]>(() => [
        {
            label: "Dashboard",
            icon: "i-lucide-layout-dashboard",
            to: "/",
        },
        {
            label: "Search food",
            icon: "i-lucide-search",
            to: "/food",
            defaultOpen: true,
            children: sidebarOpen.value
                ? [
                      {
                          label: "All products",
                          icon: "i-lucide-list-tree",
                          to: "/food",
                      },
                  ]
                : [],
        },
        {
            label: "My products",
            icon: "i-lucide-shopping-basket",
            to: "/basket",
        },
    ]);

    const breadcrumb = computed<BreadcrumbItem[]>(() => {
        const route = useRoute();
        const items: BreadcrumbItem[] = [{ label: "Dashboard", to: "/" }];

        for (const item of navigationMenu.value) {
            if (route.path === "/") {
                continue;
            }

            if (route.path === item.to) {
                items.push({ label: item.label, icon: item.icon, to: item.to });
                break;
            }
        }

        return items;
    });

    const toggleSidebar = () => {
        sidebarOpen.value = !sidebarOpen.value;
    };

    return {
        sidebarOpen,
        navigationMenu,
        breadcrumb,
        toggleSidebar,
    };
};

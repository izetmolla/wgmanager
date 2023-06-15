

const navigations: NavigationItem[] = [
    {
        type: "item",
        to: "/dashboard",
        name: "Dashboard",
        icon: "dashboard",
        iconProps: { size: "20px" }

    },
    {
        type: "item",
        to: "/users",
        name: "Users",
        icon: "users",
        iconProps: { size: "20px" }

    },
    {
        type: "item",
        to: "/clients",
        name: "Clients",
        icon: "wireguard",
        iconProps: { size: "20px" }
    },
    {
        type: "item",
        to: "/settings",
        name: "Settings",
        icon: "home",
        iconProps: { size: "20px" }

    },
    // {
    //     type: "item",
    //     to: "/dashboard",
    //     name: "Dashboard",
    //     icon: "home"
    // },
    // {
    //     type: "item",
    //     to: "/mail",
    //     name: "Mail",
    //     icon: "home"
    // },
    // {
    //     type: "group",
    //     name: "Settings",
    //     icon: "home",
    //     to: "/settings",
    //     childrens: [
    //         { type: "item", to: "/settings/general", name: "General" },
    //         { type: "item", to: "/settings/options", name: "Options" }
    //     ]
    // },
];

export default navigations;

export type NavigationItem = {
    type: "item" | "group";
    name: string;
    icon?: string;
    to?: string;
    childrens?: NavigationItem[];
    iconProps?: {
        size?: string | number;
    };

};
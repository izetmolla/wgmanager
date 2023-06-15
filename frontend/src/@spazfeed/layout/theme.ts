export const defaultTheme: DefaultTheme = {
    leftSidebar: {
        removed: false,
        toggledMenu: false,
        collapsedMenu: false,
    },
    noHeader: false,
    noLeftSidebar: false,
    noFooter: false,
    headerHeight: 50,
    leftSidebarWidth: 260,
    contentHeight: window.innerHeight - 50,
    leftSidebarHeight: window.innerHeight - 50,
    dark: {
        leftSidebar: {
            background: "blueGray.700",
            itemHover: "lightBlue.700",
            itemBg: "gray.700",
            itemText: "gray.200",
            itemTextHover: "gray.700",
            itemBgActive: "lightBlue.900",
            itemTextActive: "gray.200",
            itemHoverActive: "lightBlue.900",
            itemTextHoverActive: "red.700",
            menuContent: "blueGray.800"
        },
        header: {
            background: "blueGray.800",
        }
    },
    light: {
        leftSidebar: {
            background: "blueGray.700",
            itemHover: "lightBlue.700",
            itemBg: "gray.700",
            itemText: "gray.200",
            itemTextHover: "gray.700",
            itemBgActive: "lightBlue.900",
            itemTextActive: "gray.200",
            itemHoverActive: "lightBlue.900",
            itemTextHoverActive: "red.700",
            menuContent: "blueGray.800"
        },
        header: {
            background: "blueGray.800",
        }
    }
}
export default defaultTheme

export interface DefaultTheme {
    leftSidebar: {
        removed: boolean
        toggledMenu: boolean
        collapsedMenu: boolean
    },
    noHeader: boolean
    noLeftSidebar: boolean
    noFooter: boolean
    headerHeight: number
    leftSidebarWidth: number
    leftSidebarHeight: number
    contentHeight: number
    dark: DefaultThemeColors
    light: DefaultThemeColors
}

export interface DefaultThemeColors {
    leftSidebar: {
        background: string,
        itemBg: string
        itemText: string
        itemTextHover: string
        itemHover: string
        itemBgActive: string
        itemTextActive: string
        itemHoverActive: string
        itemTextHoverActive: string
        menuContent: string
    },
    header: {
        background: string
    }

}
import { FC, ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { NativeBaseProvider, extendTheme } from "native-base";
import defaultTheme, { DefaultTheme } from "./theme";
const nativeBaseTheme = extendTheme({
    config: {
        initialColorMode: "light",
    }
});


interface ApplayoutInterface {
    children: ReactNode;
}



export interface LayoutContextModel {
    theme: DefaultTheme,
    collapseleftSidebar: (collapsedMenu?: boolean) => void,
    toggleleftSidebar: (toggledMenu?: boolean) => void
    setComponentHeight: (height: number, comp: string) => void

}

const LayoutContext = createContext<LayoutContextModel>({
    theme: defaultTheme,
    collapseleftSidebar: (collapsedMenu?: boolean) => { },
    toggleleftSidebar: (toggledMenu?: boolean) => { },
    setComponentHeight: (height: number, comp: string) => { }
})


const setupTheme = (theme: DefaultTheme) => {
    // lgrad.colors = lgrad.colors?.map((color: string) => {
    //     return getColor(color, theme.colors, theme);
    // });
}


const enableSplashScreen = () => {
    const splashScreen = document.getElementById('splash-screen')
    if (splashScreen) {
        splashScreen.style.setProperty('display', 'flex')
    }
}

const disableSplashScreen = () => {
    const splashScreen = document.getElementById('splash-screen')
    if (splashScreen) {
        splashScreen.style.setProperty('display', 'none')
    }
}


const ThemeProvider: FC<ApplayoutInterface> = ({ children }): JSX.Element => {
    const [theme, setTheme] = useState<DefaultTheme>(defaultTheme)
    useEffect(() => {
        disableSplashScreen()
    }, [])



    const toggleleftSidebar = (toggledMenu: boolean = !theme.leftSidebar.toggledMenu) => {
        setTheme({ ...theme, leftSidebar: { ...theme.leftSidebar, toggledMenu } })
    }
    const collapseleftSidebar = (collapsedMenu: boolean = !theme.leftSidebar.collapsedMenu) => {
        setTheme({ ...theme, leftSidebar: { ...theme.leftSidebar, collapsedMenu } })
    }




    const setComponentHeight = (height: number, comp: string) => {
        setTheme({ ...theme, [comp]: height })
    }


    const value: LayoutContextModel = {
        theme,
        toggleleftSidebar,
        collapseleftSidebar,
        setComponentHeight
    }

    return (
        <LayoutContext.Provider value={value}>
            <NativeBaseProvider theme={nativeBaseTheme}>
                {children}
            </NativeBaseProvider>
        </LayoutContext.Provider>

    )
}


export const ThemeConsumer = LayoutContext.Consumer;
export function useLayout() {
    return useContext(LayoutContext)
}
export default ThemeProvider

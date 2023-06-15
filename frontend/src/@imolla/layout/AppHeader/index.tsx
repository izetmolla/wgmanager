import { Box, Divider } from "native-base";
import { FC } from "react";
import { useLayout } from "..";

import { LayoutChangeEvent } from "react-native";
import HeaderLogo from "./HeaderLogo";
import HeaderLeftMenu from "./HeaderLeftMenu";

interface AppHeaderInterface {
    isMobile?: boolean,
    onLayout?: (event: LayoutChangeEvent) => void
}
const AppHeader: FC<AppHeaderInterface> = ({ isMobile, onLayout }): JSX.Element => {
    const { theme } = useLayout()
    return (
        <Box position="fixed" top={0} left={0} right={0} zIndex={9995} onLayout={onLayout}>
            <Box height={theme?.headerHeight} _light={{ backgroundColor: 'white' }} _dark={{ backgroundColor: 'gray.700' }} p={3} flexDirection="row" alignItems="center" justifyContent="space-between">
                <HeaderLogo isMobile={isMobile} />
                <HeaderLeftMenu />
            </Box>
            <Divider />
        </Box>
    )
}


export default AppHeader
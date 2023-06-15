import { Box, Button, Text } from "native-base"
import { useLayout } from "..";
import { FC } from "react";

interface HeaderLogoInterface {
    isMobile?: boolean
}
const HeaderLogo: FC<HeaderLogoInterface> = ({ isMobile = false }) => {

    const { theme, toggleleftSidebar } = useLayout();
    return (
        <Box maxW={theme.leftSidebarWidth} flexDirection="row">
            <Text>Logo </Text>
            {isMobile && <Button onPress={() => toggleleftSidebar()} size="xs">Menu</Button>}
        </Box>
    )
}

export default HeaderLogo;
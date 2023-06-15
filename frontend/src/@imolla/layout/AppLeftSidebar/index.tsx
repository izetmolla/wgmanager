import React, { FC } from "react";
import { Box, ScrollView, useColorMode, useTheme } from "native-base";
import { } from "@imolla/types";
import { useLayout } from "..";
import { useWindowDimensions } from "react-native";

import { AppSidebarNav } from "./AppSidebarNav";
import navigations from "pages/LeftSidebar";
import { NavTest } from "./NavTest";

interface LeftSidebarInterface {
  isMobile: boolean;
  // toggled: boolean
}

const LeftSidebar: FC<LeftSidebarInterface> = ({ isMobile }): JSX.Element => {
  const { colorMode } = useColorMode();

  const ttt = useLayout();
  const layout = useLayout();

  if (isMobile) {
    return (
      <AppSidebarNav
        layout={layout}
        isMobile={isMobile}
        items={navigations}
        colors={layout.theme[colorMode || "light"].leftSidebar}
      />
    );
  } else {
    return (
      <Box>
        <ScrollView maxW={layout.theme.leftSidebarWidth} showsVerticalScrollIndicator={false}>
          <AppSidebarNav
            layout={layout}
            items={navigations}
            colors={layout.theme[colorMode || "light"].leftSidebar}
          />
        </ScrollView>
      </Box>
    );
  }
};

export default LeftSidebar;

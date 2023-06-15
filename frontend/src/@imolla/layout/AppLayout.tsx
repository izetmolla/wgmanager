import React, {
  FC,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Badge, Box, ScrollView, Text, useBreakpointValue } from "native-base";
import { ThemeConsumer, useLayout } from ".";
import { Navigate, Outlet } from "react-router-dom";
import LeftSidebar from "./AppLeftSidebar";
import AppHeader from "./AppHeader";
import { AppLoader } from "@imolla/components";
import { useAppSelector } from "@imolla/hooks";

interface AppLayoutInterface {}

const AppLayout: FC<AppLayoutInterface> = ({}): JSX.Element => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isLoggedin } = useAppSelector((state) => state.authorization);

  return isLoggedin ? (
    <ThemeConsumer>
      {({ theme, setComponentHeight }) => (
        <Box
          width="100%"
          minHeight={window.innerHeight}
          _light={{ backgroundColor: "blueGray.100" }}
          _dark={{ backgroundColor: "blueGray.700" }}
        >
          {isMobile && <LeftSidebar isMobile={isMobile} />}
          <AppHeader
            isMobile={isMobile}
            onLayout={(e) =>
              setComponentHeight(e.nativeEvent.layout.height, "headerHeight")
            }
          />
          <Box height={window.innerHeight}>
            <Box
              flex={1}
              marginTop={Number(theme?.headerHeight)}
              flexDirection={isMobile ? "column" : "row"}
              onLayout={(e) =>
                setComponentHeight(e.nativeEvent.layout.height, "contentHeight")
              }
            >
              {!isMobile && <LeftSidebar isMobile={isMobile} />}
              <Box
                flex={1}
                height={window.innerHeight - Number(theme?.headerHeight)}
              >
                <ScrollView>
                  <Suspense fallback={<AppLoader full />}>
                    <Outlet />
                  </Suspense>
                </ScrollView>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </ThemeConsumer>
  ) : (
    <Navigate to="/login" replace={true} />
  );
};

export default AppLayout;

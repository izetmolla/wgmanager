import { Box } from "native-base";
import React, { FC } from "react";
// import { defaultColors } from "shared/config";
import "./loader.css";


interface AppLoaderTypes {
    bottomComponent?: any
    notFullScreen?: boolean
    full?: boolean
}

const AppLoader: FC<AppLoaderTypes> = ({ bottomComponent, notFullScreen }) => {
    return (
        <Box {...(notFullScreen ? {} : { minHeight: "100vh" })}  justifyContent="center" alignContent="center">
            <div className="loader-spin">
                <span className="spazfeed-dot spazfeed-dot-spin">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                </span>
            </div>
            {bottomComponent}
        </Box>
    );
};

export default AppLoader;
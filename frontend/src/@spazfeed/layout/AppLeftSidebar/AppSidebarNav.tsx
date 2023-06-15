import React, { FC, Fragment } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Badge, Text, useTheme, getColor, useColorMode } from 'native-base'
import { MenuItem, Sidebar, SubMenu, Menu, menuClasses, MenuItemStyles } from 'react-pro-sidebar'
import { Icon } from '@spazfeed/components'
import { LayoutContextModel, useLayout } from '..'
import { DefaultThemeColors } from '../theme'
import { useWindowDimensions } from 'react-native'

interface AppSidebarNavInterface {
    layout: LayoutContextModel
    items: any
    colors: DefaultThemeColors["leftSidebar"]
    isMobile?: boolean
}





// hex to rgba converter
const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};





export const AppSidebarNav: FC<AppSidebarNavInterface> = ({ items, colors, isMobile, layout }: any) => {
    const height = useWindowDimensions().height
    const themea = useTheme()
    const location = useLocation()


    for (const [key, value] of Object.entries(colors)) {
        colors[key] = getColor(value, themea.colors, themea)
    }




    const menuItemStyles: MenuItemStyles = {
        // root: {
        //     fontSize: '13px',
        //     fontWeight: 400,
        // },
        // icon: {
        //     color: themes[theme].menu.icon,
        //     [`&.${menuClasses.disabled}`]: {
        //         color: themes[theme].menu.disabled.color,
        //     },
        // },
        SubMenuExpandIcon: {
            color: '#b6b7b9',
        },
        // subMenuContent: ({ level }) => ({
        //     // backgroundColor: "red"
        //     // level === 0 ? hexToRgba(colors.menuContent, hasImage && !layout?.theme?.leftSidebar?.collapsedMenu ? 0.4 : 1) : 'transparent'
        // }),
        button: ({ level, active, disabled }) => {
            return {
                color: active ? colors.itemTextActive : colors.itemText,
                backgroundColor: active ? colors.itemBgActive : colors.background,
                '&:hover': {
                    color: active ? colors.itemTextHoverActive : colors.itemTextHover,
                    backgroundColor: active ? colors.itemHoverActive : colors.itemHover
                }
            }
        },
        // label: ({ open }) => ({
        //     fontWeight: open ? 600 : undefined,
        // }),
    };


    const navItem = (item: any, index: any) => {
        let cc: any = {};
        let isActive = false;
        if (item.to) {
            isActive = location.pathname.startsWith(item.to)
            cc.component = <Link to={item.to} />
        }
        if (typeof item.icon == "string") {
            cc.icon = <Icon color={colors.itemText} name={item.icon} {...item?.iconProps} />
        }

        return (
            <MenuItem active={isActive} key={index} {...cc}  >
                <Text numberOfLines={1} color={colors.itemText}>{item.name}</Text>
            </MenuItem>
        )
    }
    const navGroup = (item: any, index: any) => {
        let cc: any = {};
        let isActive;
        if (typeof item.icon == "string") {
            cc.icon = <Icon color={colors.itemText} name={item.icon}  {...item?.iconProps} />
        }
        if (item?.to) {
            isActive = location.pathname.startsWith(item.to)
        }

        return (
            <SubMenu defaultOpen={isActive} key={index} label={<Text numberOfLines={1} color={colors.itemText}>{item.name}</Text>} {...item} {...cc}>
                {item.childrens?.map((item: any, index: any) =>
                    item.childrens ? navGroup(item, index) : navItem(item, index),
                )}
            </SubMenu>
        )
    }

    return (
        <Sidebar
            collapsed={layout?.theme?.leftSidebar?.collapsedMenu}
            toggled={layout?.theme?.leftSidebar?.toggledMenu}
            onBackdropClick={() => layout?.toggleleftSidebar(false)}
            backgroundColor={hexToRgba(colors.background, 1)}
            {...isMobile && { breakPoint: "all", style: { zIndex: 9999 } }}
            rootStyles={{
                height: height,
                borderWidth: 0,
            }}
        >
            <Menu menuItemStyles={menuItemStyles}>
                {items && items.map((item: any, index: any) => {
                    return (
                        <Fragment key={index}>
                            {item.type === "item" && navItem(item, index)}
                            {item.type === "group" && navGroup(item, index)}
                        </Fragment>
                    )
                })}
            </Menu>
        </Sidebar>
    )
}












// import React from 'react'
// import { Link, useLocation } from 'react-router-dom'
// import PropTypes from 'prop-types'
// import { Menu, MenuItem, MenuItemStyles, SubMenu, menuClasses } from 'react-pro-sidebar'
// import { Icon } from '@spazfeed/components'
// import { useLayout } from '..'
// import { Text } from 'native-base'




// const themes = {
//     light: {
//         sidebar: {
//             backgroundColor: '#ffffff',
//             color: '#607489',
//         },
//         menu: {
//             menuContent: '#fbfcfd',
//             icon: '#0098e5',
//             hover: {
//                 backgroundColor: '#c5e4ff',
//                 color: '#44596e',
//             },
//             disabled: {
//                 color: '#9fb6cf',
//             },
//         },
//     },
//     dark: {
//         sidebar: {
//             backgroundColor: '#0b2948',
//             color: '#8ba1b7',
//         },
//         menu: {
//             menuContent: '#082440',
//             icon: '#59d0ff',
//             hover: {
//                 backgroundColor: '#00458b',
//                 color: '#b6c8d9',
//             },
//             disabled: {
//                 color: '#3e5e7e',
//             },
//         },
//     },
// };

// // hex to rgba converter
// const hexToRgba = (hex: string, alpha: number) => {
//     const r = parseInt(hex.slice(1, 3), 16);
//     const g = parseInt(hex.slice(3, 5), 16);
//     const b = parseInt(hex.slice(5, 7), 16);

//     return `rgba(${r}, ${g}, ${b}, ${alpha})`;
// };


// export const AppSidebarNav = ({ items }: any) => {
//     const layout = useLayout()
//     const location = useLocation()
//     const theme = "light"
//     const hasImage = undefined;
//     const menuItemStyles: MenuItemStyles = {
//         root: {
//             fontSize: '13px',
//             fontWeight: 400,
//         },
//         icon: {
//             color: themes[theme].menu.icon,
//             [`&.${menuClasses.disabled}`]: {
//                 color: themes[theme].menu.disabled.color,
//             },
//         },
//         SubMenuExpandIcon: {
//             color: '#b6b7b9',
//         },
//         subMenuContent: ({ level }) => ({
//             backgroundColor:
//                 level === 0
//                     ? hexToRgba(themes[theme].menu.menuContent, hasImage && !layout.theme?.leftSidebar.collapsedMenu ? 0.4 : 1)
//                     : 'transparent',
//         }),
//         button: {
//             [`&.${menuClasses.disabled}`]: {
//                 color: themes[theme].menu.disabled.color,
//             },
//             '&:hover': {
//                 backgroundColor: hexToRgba(themes[theme].menu.hover.backgroundColor, hasImage ? 0.8 : 1),
//                 color: themes[theme].menu.hover.color,
//             },
//         },
//         label: ({ open }) => ({
//             fontWeight: open ? 600 : undefined,
//         }),
//     };


//     return (
//         <Menu menuItemStyles={menuItemStyles}>
//             <Menu>
//                 <SubMenu defaultOpen rootStyles={{
//                     ['& > .' + menuClasses.button]: {
//                         backgroundColor: '#eaabff',
//                         color: '#9f0099',
//                         '&:hover': { backgroundColor: '#eecef9' },
//                     },
//                     ['.' + menuClasses.subMenuContent]: {
//                         backgroundColor: '#fbedff',
//                     },
//                 }} label={<Text>Home1</Text>} icon={<Icon size={25} />}>
//                     <MenuItem active component={<Link to="/" />}><Text>Home</Text></MenuItem>
//                     <MenuItem> Line charts</MenuItem>
//                     <MenuItem> Bar charts</MenuItem>
//                 </SubMenu>
//                 <SubMenu defaultOpen label="Maps">
//                     <MenuItem> Google maps</MenuItem>
//                     <MenuItem> Open street maps</MenuItem>
//                 </SubMenu>
//                 <SubMenu label="Theme" icon={<Icon />}>
//                     <MenuItem> Dark</MenuItem>
//                     <MenuItem> Light</MenuItem>
//                 </SubMenu>
//                 <MenuItem active={true} icon={<Icon />}>Documentation</MenuItem>
//             </Menu>
//         </Menu>
//     )
// }

// AppSidebarNav.propTypes = {
//     items: PropTypes.arrayOf(PropTypes.any).isRequired,
// }
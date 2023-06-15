import { getColorFromComponent } from "@spazfeed/services"
import { useColorMode, useTheme } from "native-base"
import { FC } from "react"
import { AiFillWarning } from "react-icons/ai"
import { MdSpaceDashboard } from "react-icons/md"
import { FaUserCog, FaUsersCog, FaDownload } from "react-icons/fa"
import { SiWireguard } from "react-icons/si"
import { BsFillGearFill, BsFillTrashFill, BsQrCode } from "react-icons/bs"
import { HiOutlineLogout, HiPencilAlt } from "react-icons/hi"

interface IconInterface {
    name?: string
    size?: string | number;
    color?: string;
    title?: string;
}
const Icon: FC<IconInterface> = ({ name, ...res }) => {
    const { colorMode } = useColorMode();
    const theme = useTheme()
    const color = getColorFromComponent(colorMode === "light" ? theme.components.Text.baseStyle().color : theme.components.Text.baseStyle()?._dark.color, theme)

    switch (name) {
        case "FaDownload": return <FaDownload name={name} color={color} {...res} />
        case "BsFillTrashFill": return <BsFillTrashFill name={name} color={color} {...res} />
        case "BsQrCode": return <BsQrCode name={name} color={color} {...res} />
        case "pencil": return <HiPencilAlt name={name} color={color} {...res} />
        case "FaUserCog": return <FaUserCog name={name} color={color} {...res} />
        case "logout": return <HiOutlineLogout name={name} color={color} {...res} />
        case "settings": return <BsFillGearFill name={name} color={color} {...res} />
        case "wireguard": return <SiWireguard name={name} color={color} {...res} />
        case 'users': return <FaUsersCog name={name} color={color} {...res} />
        case 'dashboard': return <MdSpaceDashboard name={name} color={color} {...res} />
        default: return <AiFillWarning name={name} color={color} {...res} />
    }
}

export default Icon
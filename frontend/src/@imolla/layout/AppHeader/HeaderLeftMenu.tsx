import { Icon } from "@imolla/components"
import AppPopover from "@imolla/components/AppPopover"
import { useAppDispatch } from "@imolla/hooks"
import { logOut } from "@imolla/redux/slices/Authorization"
import { Box, Text, Center, Pressable } from "native-base"
import { FC } from "react"
import { useNavigate, useNavigation } from "react-router-dom"

interface HeaderLeftMenuInterface { }

interface ClickbuttonTypes {
    icon: string
}

const ClickButton: FC<ClickbuttonTypes> = ({ icon }) => {
    return (
        <Center size={"42px"} rounded="full" _light={{ backgroundColor: 'gray.300' }} _dark={{ backgroundColor: 'gray.700' }}   >
            <Icon name={icon} size={22} />
        </Center>
    )
}


const HeaderLeftMenu: FC<HeaderLeftMenuInterface> = (): JSX.Element => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    return (
        <Box flexDirection={"row"}>
            <AppPopover bodyWidth={380} button={<ClickButton icon="FaUserCog" />}>
                <Box minW={200}>
                    <Pressable onPress={() => navigate("/profile")} _hover={{ backgroundColor: "gray.100" }} px={4}>
                        <Box flexDirection="row" padding={2}>
                            <Icon name="FaUserCog" size={22} />
                            <Text px={1} >Edit Profile</Text>
                        </Box>
                    </Pressable>


                    <Pressable onPress={() => dispatch(logOut())} _hover={{ backgroundColor: "gray.100" }} px={4}>
                        <Box flexDirection="row" padding={2}>
                            <Icon name="logout" size={22} />
                            <Text px={1} >Log out</Text>
                        </Box>
                    </Pressable>
                </Box>
            </AppPopover>
        </Box>
    )
}


export default HeaderLeftMenu
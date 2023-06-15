import { Box, Popover, Button, Center, Pressable } from "native-base";
import { VStack, Select, CheckIcon, Text } from "native-base";
import { View } from "react-native"
import React, { FC, useState } from "react";
import AppPopover from "@imolla/components/AppPopover";
import { Icon } from "@imolla/components";


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
function User() {

    return (
        <Box flexDirection={"row"}>
            <AppPopover bodyWidth={"100%"} button={<ClickButton icon="CgMenuGridO" />} opacity={0.7}>
                <Box width={"100%"} height={400} backgroundColor="amber.500">
                    <Text>123</Text>
                </Box>
            </AppPopover>
            <AppPopover bodyWidth={380} button={<ClickButton icon="CgMenuGridO" />}>
                <Box width={"100%"} height={400} backgroundColor="amber.500">
                    <Text>123</Text>
                </Box>
            </AppPopover>
            <AppPopover bodyWidth={380} button={<ClickButton icon="CgMenuGridO" />}>
                <Box width={350} height={400} backgroundColor="amber.500">
                    <Text>123</Text>
                </Box>
            </AppPopover>
        </Box>

    )

}


function Example() {
    const [position, setPosition] = useState("auto");
    const [isOpen, setIsOpen] = useState(false);
    return <Box w="100%" alignItems="center">
        <VStack space={6} alignSelf="flex-start" w="100%">
            <Popover // @ts-ignore
                placement={position === "auto" ? undefined : position} trigger={triggerProps => {
                    return <Button colorScheme="danger" alignSelf="center" {...triggerProps} onPress={() => setIsOpen(true)}>
                        Delete Customer
                    </Button>;
                }} isOpen={isOpen} onClose={() => setIsOpen(!isOpen)}>
                <Popover.Content w="56">
                    <Popover.Arrow />
                    <Popover.CloseButton onPress={() => setIsOpen(false)} />
                    <Popover.Header>Delete Customer</Popover.Header>
                    <Popover.Body>
                        This will remove all data relating to Alex. This action cannot be
                        reversed. Deleted data can not be recovered.
                    </Popover.Body>
                    <Popover.Footer justifyContent="flex-end">
                        <Button.Group space={2}>
                            <Button colorScheme="coolGray" variant="ghost" onPress={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button colorScheme="danger" onPress={() => setIsOpen(false)}>
                                Delete
                            </Button>
                        </Button.Group>
                    </Popover.Footer>
                </Popover.Content>
            </Popover>

            <Select selectedValue={position} mx={{
                base: 0,
                md: "auto"
            }} accessibilityLabel="Select a position for Popover" onValueChange={nextValue => setPosition(nextValue)} _selectedItem={{
                bg: "cyan.600",
                endIcon: <CheckIcon size={4} />
            }}>
                <Select.Item label="auto" value="auto" />
                <Select.Item label="Top Left" value="top left" />
                <Select.Item label="Top" value="top" />
                <Select.Item label="Top Right" value="top right" />
                <Select.Item label="Right Top" value="right top" />
                <Select.Item label="Right" value="right" />
                <Select.Item label="Right Bottom" value="right bottom" />
                <Select.Item label="Bottom Left" value="bottom left" />
                <Select.Item label="Bottom" value="bottom" />
                <Select.Item label="Bottom Right" value="bottom right" />
                <Select.Item label="Left Top" value="left top" />
                <Select.Item label="Left" value="left" />
                <Select.Item label="Left Bottom" value="left bottom" />
            </Select>
        </VStack>
    </Box>;
}


export default User
export { Example }
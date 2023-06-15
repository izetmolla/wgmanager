import { Box, Text } from "native-base"
import { FC } from "react"


interface EditClientPageInterface { }
const EditClientPage: FC<EditClientPageInterface> = (): JSX.Element => {
    return (
        <Box m={3} _light={{ backgroundColor: "white" }} minHeight="100vh" rounded={2}>
            <Box flexDir="row" justifyContent="space-between" m={2}>
                <Text>Edit User</Text>
            </Box>



        </Box >
    )
}


export default EditClientPage
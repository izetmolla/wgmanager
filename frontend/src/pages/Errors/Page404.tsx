import { FC } from "react"
import { Box, Center } from "native-base"


interface Page404Interface { }
const Page404: FC<Page404Interface> = (): JSX.Element => {
    return (
        <Box flex={1}>
            <Center>
                <h1> Page 404</h1>
            </Center>
        </Box>
    )
}

export default Page404
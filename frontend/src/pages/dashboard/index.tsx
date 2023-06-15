import { Box } from "native-base"
import { FC } from "react"


interface DashboardPageInterface { }
const DashboardPage: FC<DashboardPageInterface> = (): JSX.Element => {
  return (
    <Box m={3} _light={{ backgroundColor: "white" }} minHeight="100vh" rounded={2}>
      Dashboard
    </Box>
  )
}
export default DashboardPage
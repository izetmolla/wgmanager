import { Box, Button, Center, Pressable, Text } from "native-base"
import { FC, Fragment, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AppLoader, Icon } from "@imolla/components"
import { network } from "@imolla/services"
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import UserModal from "./UserModal"


interface UsersPageInterface { }
export interface UserTypes {
    id?: number | string
    fullname?: string
    password?: string
    username?: string
    roles: any[],
    connections?: number | string
    email?: string
    status?: number
    isAdmin?: boolean
}
const UsersPage: FC<UsersPageInterface> = (): JSX.Element => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<UserTypes[]>([])
    const [error, setError] = useState({ message: "", path: "" })
    const [mc, setmodalContent] = useState({ isOpened: false, type: "", title: "", item: undefined })



    useEffect(() => {
        network.post("/users", {}).then(({ data: { status, data, error } }) => {
            if (status === "success") {
                setData(data?.content || [])
                setLoading(false)
            } else {
                setError(error)
                setLoading(false)
            }
        }).catch((err) => {
            console.log(err)
            setError({ message: err?.message || "server error", path: "" })
            setLoading(false)
        })
        return () => {
            setData([])
            setLoading(true)
        }
    }, [])


    const handleModalClick = (type: string, item: any) => {
        if (type === "edit") {
            navigate("edit/" + item.id, { state: item })
        }
        if (type === "delete") {
            setmodalContent({ ...mc, isOpened: true, title: "Delete User " + item.fullname, type, item })
        }
    }

    return (
        <Box m={3} _light={{ backgroundColor: "white" }} minHeight="100vh" rounded={2}>
            <Box flexDir="row" justifyContent="space-between" m={2}>
                <Text>Clients</Text>
                <Button size="sm" onPress={() => navigate("add")}>Add User</Button>
            </Box>
            {loading ? (
                <AppLoader full />
            ) : error?.message ? (
                <Center>
                    <Text color="red.700" fontWeight="bold" size="lg">{error.message}</Text>
                </Center>
            ) : (
                <Fragment>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead style={{ backgroundColor: "#f0f4f7" }}>
                                <TableRow >
                                    <TableCell><b>ID</b></TableCell>
                                    <TableCell align="left"><b>User Details</b></TableCell>
                                    <TableCell align="left"><b>Connections</b></TableCell>
                                    <TableCell align="left"><b>Clients</b></TableCell>
                                    <TableCell align="left"><b>Bandwith</b></TableCell>
                                    <TableCell align="left"><b>Actions</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data?.length === 0 && <TableRow><TableCell align="center" colSpan={8}>No Users found</TableCell></TableRow>}
                                {data?.map((item, i) => (
                                    <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell><b>{item.id}</b></TableCell>
                                        <TableCell align="left"><Link style={{ textDecoration: "none" }} to={"edit/" + item.id} state={item}>{item.fullname}</Link></TableCell>
                                        <TableCell align="left">0</TableCell>
                                        <TableCell align="left">0</TableCell>
                                        <TableCell align="left">0</TableCell>
                                        <TableCell>
                                            <Box flex={1} flexDirection="row-reverse">
                                                <Button size="sm" variant="outline" mr={1} onPress={() => handleModalClick("delete", item)}><Icon name="BsFillTrashFill" /></Button>
                                                <Button size="sm" variant="outline" mr={1} onPress={() => handleModalClick("edit", item)}><Icon name="pencil" /></Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Fragment>
            )}
            {mc.isOpened && <UserModal removeUser={(id) => setData(data.filter(x => x.id !== Number(id)))} closeModal={() => setmodalContent({ ...mc, isOpened: false, type: "", item: undefined })} isOpen={mc.isOpened} onClose={() => setmodalContent({ ...mc, isOpened: false })} {...mc} />}
        </Box>
    )
}
export default UsersPage
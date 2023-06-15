import { Badge, Box, Button, Center, Text, Pressable } from "native-base"
import { FC, Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppLoader, Icon } from "@spazfeed/components"
import { network } from "@spazfeed/services"
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import ClientModal from "./Modal"

interface ClientsPageInterface { }
interface ClientTypes {
    id: number | string
    name: string
    ipAllocation: string[]
    dnsServerIps: string[]
    lastHandshakeTime: number
    transferRx: number
    transferTx: number
}
const ClientsPage: FC<ClientsPageInterface> = (): JSX.Element => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<ClientTypes[]>([])
    const [error, setError] = useState({ message: "", path: "" })
    const [mc, setmodalContent] = useState({ isOpened: false, type: "", title: "", item: undefined })


    useEffect(() => {
        network.post("/clients", {}).then(({ data: { status, data, error } }) => {
            if (status === "success") {
                setData(data?.content || [])
                setLoading(false)
            } else {
                setError(error)
                setLoading(false)
            }
            console.log(data)
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

    useEffect(() => {

    }, [mc.isOpened, mc.type])


    const handleModalClick = (type: string, item: any) => {
        if (type === "delete") {
            setmodalContent({ ...mc, isOpened: true, title: "Delete Client " + item.name, type, item })
        } else if (type === "edit") {
            navigate("edit/" + item.id, { state: item })
        } else if (type === "qrcode") {
            setmodalContent({ ...mc, isOpened: true, type, title: "QR Code for " + item.name, item })
        } else if (type === "download") {
            network.get("/get.php?id=" + item.id).then(({ data }) => {
                if (data?.status === "success") {
                    window.open(window.location.origin + "/api/download.php?token=" + data?.data?.token, "_blank");
                } else {
                    alert(data?.error?.message)
                }
            }).catch(error => {

                console.log(error)
            })
        }
    }


    return (
        <Box m={3} _light={{ backgroundColor: "white" }} minHeight="100vh" rounded={2}>
            <Box flexDir="row" justifyContent="space-between" m={2}>
                <Text>Clients</Text>
                <Button size="sm" onPress={() => navigate("add")}>Add Client</Button>
            </Box>
            {loading ? (
                <AppLoader full />
            ) : error?.message ? (
                <Center>
                    <Text color="red.700" size="lg">{error.message}</Text>
                </Center>
            ) : (
                <Fragment>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead style={{ backgroundColor: "#f0f4f7" }}>
                                <TableRow >
                                    <TableCell style={{ width: 20 }}><b>ID</b></TableCell>
                                    <TableCell align="left"><b>Name</b></TableCell>
                                    <TableCell align="center"><b>Ip Allocation</b></TableCell>
                                    <TableCell align="center"><b>DNS</b></TableCell>
                                    <TableCell align="center"><b>User</b></TableCell>
                                    <TableCell align="center"><b>Bandwith</b></TableCell>
                                    <TableCell align="center"><b>Last Connect</b></TableCell>
                                    <TableCell align="right"><b>Actions</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data?.length === 0 && <TableRow><TableCell align="center" colSpan={8}>No Clients found</TableCell></TableRow>}
                                {data?.map((item, i) => (
                                    <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell align="left">
                                            <Pressable onPress={() => navigate("edit/" + item.id, { state: item })}><Text fontWeight="bold">{item.name}</Text></Pressable>
                                        </TableCell>
                                        <TableCell align="center">{item?.ipAllocation?.map((a, b) => (<Fragment key={b}><Badge size="xs" my={1} rounded={10} colorScheme="blue" children={a} /></Fragment>))}</TableCell>
                                        <TableCell align="center">{item?.dnsServerIps?.map((a, b) => (<Fragment key={b}><Badge size="xs" my={1} rounded={10} colorScheme="success" children={a} /></Fragment>))}</TableCell>
                                        <TableCell align="center">Admin</TableCell>
                                        <TableCell align="center">0</TableCell>
                                        <TableCell align="center">0</TableCell>
                                        <TableCell>
                                            <Box flex={1} flexDirection="row-reverse">
                                                <Button size="sm" variant="outline" mr={1} onPress={() => handleModalClick("delete", item)}><Icon name="BsFillTrashFill" /></Button>
                                                <Button size="sm" variant="outline" mr={1} onPress={() => handleModalClick("edit", item)}><Icon name="pencil" /></Button>
                                                {/* <Button size="sm" variant="outline" mr={1} onPress={() => handleModalClick("changeStatus", item)}><Icon name="pencil" /></Button> */}
                                                <Button size="sm" variant="outline" mr={1} onPress={() => handleModalClick("qrcode", item)}><Icon name="BsQrCode" /></Button>
                                                <Button size="sm" variant="outline" mr={1} onPress={() => handleModalClick("download", item)}><Icon name="FaDownload" /></Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Fragment>
            )}
            {mc.isOpened && <ClientModal removeClient={(id) => setData(data.filter(x => x.id !== Number(id)))} closeModal={() => setmodalContent({ ...mc, isOpened: false, type: "", item: undefined })} isOpen={mc.isOpened} onClose={() => setmodalContent({ ...mc, isOpened: false })} {...mc} />}
        </Box>
    )
}
export default ClientsPage